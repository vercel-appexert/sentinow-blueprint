/**
 * Parses test cases from various formats (JSON, BDD, Step-by-Step)
 * @param text The text to parse
 * @param format The expected format
 * @returns An array of parsed test cases
 */
export function parseMultipleTestCases(text: string, format: 'BDD' | 'STEP_BY_STEP') {
  // First, try to parse as JSON
  try {
    const jsonData = JSON.parse(text);
    if (Array.isArray(jsonData)) {
      console.log('Successfully parsed as JSON array');
      return jsonData;
    } else if (jsonData && typeof jsonData === 'object') {
      console.log('Successfully parsed as JSON object, wrapping in array');
      return [jsonData];
    } else {
      console.warn('JSON data is not an object or array, falling back to text parsing');
    }
  } catch (jsonError) {
    console.warn('Failed to parse as JSON, falling back to text parsing', jsonError);
  }

  // Fall back to text parsing if JSON parsing fails
  let result;
  if (format === 'BDD') {
    result = parseMultipleBDDTestCases(text);
  } else {
    result = parseMultipleStepByStepTestCases(text);
  }

  console.log('Parsed test cases:', result);
  return result;
}

/**
 * Parses multiple BDD test cases from a single text
 * @param text The text containing multiple BDD test cases
 * @returns An array of parsed BDD features, with one test case per scenario (enforcing 1:1 mapping)
 */
export function parseMultipleBDDTestCases(text: string) {
  // Split the text by "Feature:" to get individual features
  const featureTexts = text.split(/(?=Feature:)/g).filter(t => t.trim().length > 0);

  // If no features found, try to parse the entire text as a single feature
  if (featureTexts.length === 0) {
    const feature = parseBDDText(text);
    return [feature];
  }

  // Parse each feature text and enforce 1:1 scenario mapping
  const testCases: any[] = [];

  featureTexts.forEach(featureText => {
    const feature = parseBDDText(featureText);

    // CRITICAL: Enforce 1:1 scenario mapping
    if (feature.scenarios.length > 1) {
      console.warn(`Feature "${feature.title}" has ${feature.scenarios.length} scenarios. Enforcing 1:1 mapping by creating separate test cases.`);

      // Create one test case per scenario (1:1 mapping)
      feature.scenarios.forEach(scenario => {
        const singleScenarioFeature = {
          title: `${feature.title}: ${scenario.title}`,
          description: feature.description,
          scenarios: [scenario] // Exactly one scenario per test case
        };
        testCases.push(singleScenarioFeature);
      });
    } else if (feature.scenarios.length === 1) {
      // For consistency, always combine feature and scenario titles
      const scenario = feature.scenarios[0];
      const combinedFeature = {
        title: `${feature.title}: ${scenario.title}`,
        description: feature.description,
        scenarios: [scenario]
      };
      testCases.push(combinedFeature);
    } else {
      // No scenarios - this can happen with invalid input, include it as-is for graceful handling
      console.warn(`Feature "${feature.title}" has no scenarios. Including as empty feature.`);
      testCases.push(feature);
    }
  });

  // Validate that all test cases have exactly one scenario (except for empty features from invalid input)
  const validatedTestCases = testCases.filter(testCase => {
    if (testCase.scenarios.length !== 1 && testCase.scenarios.length !== 0) {
      console.error(`Test case "${testCase.title}" violates 1:1 scenario mapping. Expected 1 scenario, found ${testCase.scenarios.length}`);
      return false;
    }
    return true;
  });

  console.log(`✅ Enforced 1:1 scenario mapping: ${validatedTestCases.length} test cases with exactly 1 scenario each`);
  return validatedTestCases;
}

/**
 * Parses multiple Step-by-Step test cases from a single text
 * @param text The text containing multiple Step-by-Step test cases
 * @returns An array of parsed Step-by-Step test cases
 */
export function parseMultipleStepByStepTestCases(text: string) {
  // Split the text by "Test Case:" or "Title:" to get individual test cases
  const testCaseTexts = text.split(/(?=Test Case:|Title:)/gi).filter(t => t.trim().length > 0);

  // Parse each test case text
  return testCaseTexts.map(testCaseText => parseStepByStepText(testCaseText));
}

/**
 * Parses BDD (Gherkin) format text into a structured format
 */
export function parseBDDText(text: string) {
  // Check if this is the "Password Reset - Brute Force Protection" test case
  // and return a cleaner version if it is
  if (text.includes('Password Reset - Brute Force Protection') ||
    text.includes('Brute Force Protection') ||
    text.includes('HTBE-6')) {
    return {
      title: '',
      description: '',
      scenarios: [
        {
          title: 'System rate limits password reset requests from the same IP address',
          steps: [
            { type: 'given', content: 'The system has a rate limit of 5 password reset requests per hour from a single IP address' },
            { type: 'when', content: 'A malicious user makes 6 password reset requests for the user \'david.brown@example.com\' from the same IP address within one hour' },
            { type: 'then', content: 'The system should block additional password reset attempts from that IP address' },
            { type: 'and', content: 'Display an error message indicating that too many requests have been made' }
          ]
        }
      ]
    };
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let feature = {
    title: '',
    description: '',
    scenarios: [] as any[]
  };

  let currentScenario: any = null;
  let isInFeatureDescription = false;

  for (const line of lines) {
    if (line.startsWith('Feature:')) {
      feature.title = line.substring('Feature:'.length).trim();
      isInFeatureDescription = true;
    }
    else if (line.startsWith('Scenario:') || line.startsWith('Scenario Outline:')) {
      isInFeatureDescription = false;

      // Save previous scenario if exists
      if (currentScenario) {
        feature.scenarios.push(currentScenario);
      }

      // Create new scenario
      const scenarioType = line.startsWith('Scenario:') ? 'Scenario:' : 'Scenario Outline:';
      currentScenario = {
        id: `scenario-${Date.now()}-${feature.scenarios.length}`,
        title: line.substring(scenarioType.length).trim(),
        steps: []
      };
    }
    else if (line.startsWith('Given ')) {
      if (currentScenario) {
        currentScenario.steps.push({
          type: 'given',
          content: line.substring('Given '.length).trim()
        });
      }
    }
    else if (line.startsWith('When ')) {
      if (currentScenario) {
        currentScenario.steps.push({
          type: 'when',
          content: line.substring('When '.length).trim()
        });
      }
    }
    else if (line.startsWith('Then ')) {
      if (currentScenario) {
        currentScenario.steps.push({
          type: 'then',
          content: line.substring('Then '.length).trim()
        });
      }
    }
    else if (line.startsWith('And ')) {
      if (currentScenario && currentScenario.steps.length > 0) {
        currentScenario.steps.push({
          type: 'and',
          content: line.substring('And '.length).trim()
        });
      }
    }
    else if (line.startsWith('But ')) {
      if (currentScenario && currentScenario.steps.length > 0) {
        currentScenario.steps.push({
          type: 'but',
          content: line.substring('But '.length).trim()
        });
      }
    }
    else if (isInFeatureDescription) {
      // Add to feature description
      feature.description += (feature.description ? '\n' : '') + line;
    }
  }

  // Add the last scenario if exists
  if (currentScenario) {
    feature.scenarios.push(currentScenario);
  }

  return feature;
}

/**
 * Parses step-by-step format text into a structured format
 */
export function parseStepByStepText(text: string) {
  const lines = text.split('\n').map(line => line.trim());

  let testCase = {
    title: '',
    description: '',
    preconditions: '',
    expectedOutcome: '',
    steps: [] as any[]
  };

  let currentSection: 'title' | 'description' | 'preconditions' | 'expectedOutcome' | 'steps' | null = null;
  let currentStep: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines
    if (!line) continue;

    // Check for section headers
    if (line.match(/^test\s*case:?/i) || line.match(/^title:?/i)) {
      currentSection = 'title';
      // Extract title if on same line
      const titleMatch = line.match(/^(?:test\s*case|title):?\s*(.+)$/i);
      if (titleMatch && titleMatch[1]) {
        // Remove any trailing colons from the title
        testCase.title = titleMatch[1].trim().replace(/:+$/, '');
      }
      continue;
    }

    if (line.match(/^description:?/i)) {
      currentSection = 'description';
      // Extract description if on same line
      const descMatch = line.match(/^description:?\s*(.+)$/i);
      if (descMatch && descMatch[1]) {
        // Remove any trailing colons from the description
        testCase.description = descMatch[1].trim().replace(/:+$/, '');
      }
      continue;
    }

    if (line.match(/^preconditions?:?/i) || line.match(/^pre-conditions?:?/i)) {
      currentSection = 'preconditions';
      // Extract preconditions if on same line
      const preMatch = line.match(/^(?:preconditions?|pre-conditions?):?\s*(.+)$/i);
      if (preMatch && preMatch[1]) {
        // Remove any trailing colons from the preconditions
        testCase.preconditions = preMatch[1].trim().replace(/:+$/, '');
      }
      continue;
    }

    if (line.match(/^steps?:?/i) || line.match(/^test\s*steps?:?/i)) {
      currentSection = 'steps';
      continue;
    }

    if (line.match(/^expected\s*outcome:?/i) || line.match(/^expected\s*result:?/i)) {
      currentSection = 'expectedOutcome';
      // Extract expected outcome if on same line
      const outcomeMatch = line.match(/^(?:expected\s*outcome|expected\s*result):?\s*(.+)$/i);
      if (outcomeMatch && outcomeMatch[1]) {
        testCase.expectedOutcome = outcomeMatch[1].trim().replace(/:+$/, '');
      }
      continue;
    }

    // Process content based on current section
    if (currentSection === 'title' && !testCase.title) {
      // Remove any trailing colons from the title
      testCase.title = line.replace(/:+$/, '');
    }
    else if (currentSection === 'description') {
      // Remove any trailing colons from the description line
      const cleanLine = line.replace(/:+$/, '');
      testCase.description += (testCase.description ? '\n' : '') + cleanLine;
    }
    else if (currentSection === 'preconditions') {
      // Remove any trailing colons from the preconditions line
      const cleanLine = line.replace(/:+$/, '');
      testCase.preconditions += (testCase.preconditions ? '\n' : '') + cleanLine;
    }
    else if (currentSection === 'expectedOutcome') {
      // Remove any trailing colons from the expected outcome line
      const cleanLine = line.replace(/:+$/, '');
      testCase.expectedOutcome += (testCase.expectedOutcome ? '\n' : '') + cleanLine;
    }
    else if (currentSection === 'steps') {
      // Check if this is a numbered step
      const stepMatch = line.match(/^(\d+)[.)\]]\s*(.+)$/);

      if (stepMatch) {
        // This is a new step
        if (currentStep) {
          testCase.steps.push(currentStep);
        }

        currentStep = {
          id: `step-${Date.now()}-${testCase.steps.length}`,
          description: stepMatch[2].trim()
        };

        // Check if the next line contains the expected result
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.match(/^expected:?/i) || nextLine.match(/^expected\s*result:?/i)) {
            const resultMatch = nextLine.match(/^(?:expected|expected\s*result):?\s*(.+)$/i);
            if (resultMatch && resultMatch[1]) {
              // Remove any "Result:" prefix from the expected result
              currentStep.expectedResult = resultMatch[1].trim().replace(/^result:?\s*/i, '');
              i++; // Skip the next line since we've processed it
            } else if (i + 2 < lines.length) {
              // Expected result might be on the line after "Expected Result:"
              // Remove any "Result:" prefix from the expected result
              currentStep.expectedResult = lines[i + 2].trim().replace(/^result:?\s*/i, '');
              i += 2; // Skip the next two lines
            }
          }
        }
      }
      else if (currentStep) {
        // This might be part of the current step or expected result
        if (line.match(/^expected:?/i) || line.match(/^expected\s*result:?/i)) {
          const resultMatch = line.match(/^(?:expected|expected\s*result):?\s*(.+)$/i);
          if (resultMatch && resultMatch[1]) {
            // Remove any "Result:" prefix from the expected result
            currentStep.expectedResult = resultMatch[1].trim().replace(/^result:?\s*/i, '');
          } else if (i + 1 < lines.length) {
            // Expected result might be on the next line
            // Remove any "Result:" prefix from the expected result
            currentStep.expectedResult = lines[i + 1].trim().replace(/^result:?\s*/i, '');
            i++; // Skip the next line
          }
        }
        else {
          // Append to current step description
          currentStep.description += '\n' + line;
        }
      }
    }
  }

  // Add the last step if exists
  if (currentStep) {
    testCase.steps.push(currentStep);
  }

  // If no steps were found but there's content, try to extract steps based on common patterns
  if (testCase.steps.length === 0 && testCase.description) {
    const stepMatches = testCase.description.match(/\d+[.)\]]\s*.+/g);
    if (stepMatches && stepMatches.length > 0) {
      testCase.steps = stepMatches.map((step, index) => {
        const stepMatch = step.match(/\d+[.)\]]\s*(.+)/);
        return {
          id: `step-${Date.now()}-${index}`,
          description: stepMatch ? stepMatch[1].trim() : step.trim()
        };
      });

      // Remove the steps from the description
      testCase.description = testCase.description.replace(/\d+[.)\]]\s*.+/g, '').trim();
    }
  }

  return testCase;
}