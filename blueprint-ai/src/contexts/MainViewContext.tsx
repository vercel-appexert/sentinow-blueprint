import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TestCase } from '@/lib/types';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTestCaseByTestIdFromEdgeFunction, getTestCaseByIdFromEdgeFunction } from '@/lib/supabase/folder-api';
import { useWorkspaceStore } from '@/lib/stores/workspaceStore';
import { useWorkspace } from '@/lib/workspace-context';
import { isUUID, isTestId } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

// Define the different view types
export type MainViewType =
  | { type: 'FOLDER_VIEW'; folderId: string | null }
  | { type: 'TEST_CASE_VIEW'; testCase: TestCase; testCaseId: string }
  | { type: 'GENERATED_TEST_CASES_VIEW'; testCases: any[] }
  | { type: 'EMPTY_VIEW' };

interface MainViewContextType {
  currentView: MainViewType;
  showFolderView: (folderId: string | null) => void;
  showTestCaseView: (testCase: TestCase) => void;
  showGeneratedTestCasesView: (testCases: any[]) => void;
  showEmptyView: () => void;
  isLoadingTestCase: boolean;
  error: Error | null;
}

const MainViewContext = createContext<MainViewContextType | undefined>(undefined);

export function MainViewProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkspace, currentProject } = useWorkspaceStore();
  const { loading: workspaceLoading } = useWorkspace();
  const [currentView, setCurrentView] = useState<MainViewType>({ type: 'EMPTY_VIEW' });
  const [isLoadingTestCase, setIsLoadingTestCase] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Handle URL parameters on mount and URL changes
  useEffect(() => {
    const handleUrlParams = async () => {
      const searchParams = new URLSearchParams(location.search);
      const caseId = searchParams.get('caseId');
      const folderId = searchParams.get('folderId');

      // If we have a case ID in the URL
      if (caseId) {
        // Skip if we're already viewing this test case
        if (currentView.type === 'TEST_CASE_VIEW' &&
          (currentView.testCase?.id === caseId ||
            currentView.testCase?.test_id === caseId)) {
          return;
        }

        // Wait for workspace context to be loaded before attempting to load test case
        if (workspaceLoading) {
          return;
        }

        // Load the test case
        try {
          setIsLoadingTestCase(true);
          setError(null);

          if (!currentWorkspace?.id || !currentProject?.id) {
            throw new Error('Missing workspace or project ID');
          }

          let testCase = null;

          // Check if the ID is a test_id (like HIRE-312) or a UUID
          if (isTestId(caseId)) {
            // If it's a test_id, try to get the test case by test_id
            testCase = await getTestCaseByTestIdFromEdgeFunction(caseId, currentWorkspace.id, currentProject.id);

            // If not found, try with the -DUP- suffix pattern
            if (!testCase) {
              console.log(`Test case with test_id ${caseId} not found. Trying to find it with a suffix...`);

              // Try to find any test case that starts with this test_id (might have a suffix)
              const { data, error } = await supabase
                .from('test_cases')
                .select('*')
                .like('test_id', `${caseId}%`)
                .eq('workspace_id', currentWorkspace.id)
                .eq('project_id', currentProject.id)
                .order('updated_at', { ascending: false });

              if (!error && data && data.length > 0) {
                testCase = data[0];
                console.log(`Found test case with similar test_id: ${testCase.test_id}`);
              }
            }
          } else if (isUUID(caseId)) {
            // If it's a UUID, try to get the test case by ID
            testCase = await getTestCaseByIdFromEdgeFunction(caseId, currentWorkspace.id, currentProject.id);
          } else {
            // If it's neither, try both methods
            testCase = await getTestCaseByTestIdFromEdgeFunction(caseId, currentWorkspace.id, currentProject.id);

            if (!testCase) {
              testCase = await getTestCaseByIdFromEdgeFunction(caseId, currentWorkspace.id, currentProject.id);
            }
          }

          if (!testCase) {
            throw new Error(`Test case with ID ${caseId} not found`);
          }

          // Update the view state without changing the URL
          setCurrentView({
            type: 'TEST_CASE_VIEW',
            testCase,
            testCaseId: testCase.id
          });
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
          // Show empty view if we can't load the test case
          setCurrentView({ type: 'EMPTY_VIEW' });
        } finally {
          setIsLoadingTestCase(false);
        }
      }
      // If we have a folder ID but no case ID
      else if (folderId) {
        // Skip if we're already viewing this folder
        if (currentView.type === 'FOLDER_VIEW' && currentView.folderId === folderId) {
          return;
        }

        // Update the view state without changing the URL
        setCurrentView({ type: 'FOLDER_VIEW', folderId });
      }
      // If we have neither case ID nor folder ID
      else if (caseId === null && folderId === null && location.search === '') {
        // Only reset to empty view if we're not in generated test cases view
        if (currentView.type !== 'GENERATED_TEST_CASES_VIEW') {
          setCurrentView({ type: 'EMPTY_VIEW' });
        }
      }
    };

    handleUrlParams();
  }, [location.search, currentWorkspace, currentProject, workspaceLoading]);

  const showFolderView = (folderId: string | null) => {
    // Update the view state
    setCurrentView({ type: 'FOLDER_VIEW', folderId });

    // Update the URL
    const newParams = new URLSearchParams();
    if (folderId) {
      newParams.set('folderId', folderId);
    }

    const newSearch = newParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    navigate(newUrl, { replace: true });
  };

  const showTestCaseView = (testCase: TestCase) => {
    // Update the view state
    setCurrentView({
      type: 'TEST_CASE_VIEW',
      testCase,
      testCaseId: testCase.id
    });

    // Update the URL
    const newParams = new URLSearchParams();
    const caseId = testCase.test_id || testCase.id;
    newParams.set('caseId', caseId);

    const newSearch = newParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    navigate(newUrl, { replace: true });
  };

  const showGeneratedTestCasesView = (testCases: any[]) => {
    // Update the view state
    setCurrentView({ type: 'GENERATED_TEST_CASES_VIEW', testCases });

    // Clear URL parameters
    navigate(location.pathname, { replace: true });
  };

  const showEmptyView = () => {
    // Update the view state
    setCurrentView({ type: 'EMPTY_VIEW' });

    // Clear URL parameters
    navigate(location.pathname, { replace: true });
  };

  return (
    <MainViewContext.Provider
      value={{
        currentView,
        showFolderView,
        showTestCaseView,
        showGeneratedTestCasesView,
        showEmptyView,
        isLoadingTestCase,
        error
      }}
    >
      {children}
    </MainViewContext.Provider>
  );
}

export function useMainView() {
  const context = useContext(MainViewContext);
  if (context === undefined) {
    throw new Error('useMainView must be used within a MainViewProvider');
  }
  return context;
}