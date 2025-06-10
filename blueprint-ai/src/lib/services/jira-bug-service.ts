import { createJiraIssue, linkJiraIssues, validateJiraIssueKey, getJiraProjects } from '../jira/bug-api';
import { createJiraBugRecord, getJiraBugForTestCase, getProjectBugSettings } from '../supabase/jira-bugs-api';
import { TestCase, TestRunItem } from '../types';
import { JiraBug } from '../types/jira-bugs';
import { isJiraAuthenticated, getJiraAuthData } from '../jira/oauth';

export interface CreateBugFromTestFailureParams {
  testRunItem: TestRunItem;
  testCase: TestCase;
  parentJiraKey?: string;
  priority?: string;
  issueType?: string;
  userId: string;
  workspaceId?: string;
  projectId?: string;
  jiraProjectKey?: string;
}

/**
 * Creates a JIRA bug from a failed test case
 */
export async function createBugFromTestFailure(params: CreateBugFromTestFailureParams): Promise<JiraBug> {
  const {
    testRunItem,
    testCase,
    parentJiraKey,
    priority,
    issueType,
    userId,
    workspaceId,
    projectId,
    jiraProjectKey
  } = params;

  // Check if user is authenticated with JIRA
  if (!isJiraAuthenticated()) {
    throw new Error('JIRA authentication required. Please connect your JIRA account in Settings > Integrations.');
  }

  // Check if bug already exists for this test case in this test run
  const existingBug = await getJiraBugForTestCase(testRunItem.test_run_id, testRunItem.test_case_id);
  if (existingBug) {
    throw new Error(`A bug has already been created for this test case: ${existingBug.jira_issue_key}`);
  }

  // Get project bug settings
  let projectSettings = null;
  if (projectId) {
    projectSettings = await getProjectBugSettings(projectId);
  }

  // Get JIRA projects to determine the project key
  const jiraProjects = await getJiraProjects();
  if (!jiraProjects || jiraProjects.length === 0) {
    throw new Error('No JIRA projects found. Please ensure you have access to at least one JIRA project.');
  }

  // Determine which JIRA project to use
  let jiraProject = null;
  if (jiraProjectKey) {
    // Use the explicitly provided project key (from user selection)
    jiraProject = jiraProjects.find(p => p.key === jiraProjectKey);
    if (!jiraProject) {
      throw new Error(`Selected JIRA project '${jiraProjectKey}' not found or not accessible.`);
    }
  } else if (projectSettings?.jira_project_key) {
    // Fall back to project settings
    jiraProject = jiraProjects.find(p => p.key === projectSettings.jira_project_key);
    if (!jiraProject) {
      throw new Error(`Configured JIRA project '${projectSettings.jira_project_key}' not found or not accessible. Please check your project settings.`);
    }
  } else {
    // If no project configured, use the first available project
    jiraProject = jiraProjects[0];
    console.warn('No JIRA project configured for this Blueprint project. Using first available JIRA project:', jiraProject.key);
  }

  // Validate parent JIRA key if provided
  if (parentJiraKey) {
    const isValidParent = await validateJiraIssueKey(parentJiraKey);
    if (!isValidParent) {
      throw new Error(`Parent JIRA issue ${parentJiraKey} not found or not accessible.`);
    }
  }

  // Prepare bug details
  const bugTitle = `Failure - ${testCase.title}`;
  const bugDescription = createBugDescription(testCase, testRunItem);

  // Create the JIRA issue
  const jiraIssue = await createJiraIssue({
    summary: bugTitle,
    description: bugDescription,
    issue_type: issueType || projectSettings?.default_issue_type || 'Bug',
    priority: priority || projectSettings?.default_priority || 'Medium',
    project_key: jiraProject.key
  });

  // Link to parent issue if specified
  if (parentJiraKey) {
    try {
      await linkJiraIssues(jiraIssue.key, parentJiraKey, 'Blocks');
    } catch (linkError) {
      console.error('Error linking to parent issue:', linkError);
      // Don't fail the entire operation if linking fails
    }
  }

  // Construct JIRA issue URL using domain from response or fallback methods
  let jiraIssueUrl: string;

  if (jiraIssue.jira_domain) {
    // Use the JIRA domain from the API response (most reliable)
    jiraIssueUrl = `https://${jiraIssue.jira_domain}/browse/${jiraIssue.key}`;
    console.log('Using JIRA domain from API response:', jiraIssue.jira_domain);
  } else {
    // Fallback: try to get domain from stored auth data
    const jiraDomain = await getJiraDomain();
    if (jiraDomain && jiraDomain !== 'atlassian.net') {
      const cleanDomain = jiraDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      jiraIssueUrl = `https://${cleanDomain}/browse/${jiraIssue.key}`;
      console.log('Using JIRA domain from auth data:', cleanDomain);
    } else {
      // Last fallback: try to extract domain from project self URL
      try {
        const projectUrl = new URL(jiraProject.self);
        jiraIssueUrl = `${projectUrl.protocol}//${projectUrl.host}/browse/${jiraIssue.key}`;
        console.log('Using JIRA domain from project self URL:', projectUrl.host);
      } catch (error) {
        console.error('Error parsing project self URL:', error);
        // Final fallback - this should rarely happen now
        console.warn('Using fallback domain - this may result in incorrect URLs');
        jiraIssueUrl = `https://atlassian.net/browse/${jiraIssue.key}`;
      }
    }
  }

  // Create the bug record in our database
  const jiraBugRecord = await createJiraBugRecord({
    test_run_id: testRunItem.test_run_id,
    test_case_id: testRunItem.test_case_id,
    jira_issue_key: jiraIssue.key,
    jira_issue_url: jiraIssueUrl,
    parent_jira_key: parentJiraKey,
    created_by: userId,
    workspace_id: workspaceId,
    project_id: projectId
  });

  return jiraBugRecord;
}

/**
 * Creates a detailed bug description from test case and execution details
 */
function createBugDescription(testCase: TestCase, testRunItem: TestRunItem): string {
  let description = `**Test Case:** ${testCase.test_id || testCase.id} - ${testCase.title}\n\n`;

  description += `**Status:** ${testRunItem.status}\n\n`;

  if (testCase.description) {
    description += `**Test Description:**\n${testCase.description}\n\n`;
  }

  description += `**Steps to Reproduce:**\n`;
  if (testCase.format === 'BDD') {
    description += `${testCase.content}\n\n`;
  } else {
    description += `${testCase.content}\n\n`;
  }

  if (testRunItem.notes) {
    description += `**Observed Result:**\n${testRunItem.notes}\n\n`;
  } else {
    description += `**Observed Result:**\nTest case failed during execution. Please review the test case details and execution logs.\n\n`;
  }

  description += `**Environment:** Test execution environment\n\n`;
  description += `**Created from:** Sentinow Test Execution\n`;
  description += `**Test Run ID:** ${testRunItem.test_run_id}\n`;
  description += `**Test Case ID:** ${testRunItem.test_case_id}`;

  return description;
}

/**
 * Checks if a bug can be created for the given test status
 */
export function canCreateBugForStatus(status: string): boolean {
  return status === 'FAILED' || status === 'BLOCKED';
}

/**
 * Gets the JIRA domain from auth data for constructing URLs
 */
export async function getJiraDomain(): Promise<string | null> {
  try {
    const authData = await getJiraAuthData();
    return authData?.jiraDomain || null;
  } catch (error) {
    console.error('Error getting JIRA domain:', error);
    return null;
  }
}
