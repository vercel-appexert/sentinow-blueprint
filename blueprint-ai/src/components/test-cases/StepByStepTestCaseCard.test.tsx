import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StepByStepTestCaseCard } from './StepByStepTestCaseCard';

const mockTestCase = {
  title: 'Test Login Functionality',
  description: 'Test user login process',
  preconditions: 'User has valid credentials',
  expectedOutcome: 'User should be logged in successfully',
  steps: [
    {
      id: 'step-1',
      description: 'Navigate to login page',
      expectedResult: 'Login page is displayed'
    },
    {
      id: 'step-2', 
      description: 'Enter username and password',
      expectedResult: 'Credentials are entered'
    }
  ]
};

describe('StepByStepTestCaseCard', () => {
  it('should render test case content correctly', () => {
    const mockOnUpdate = vi.fn();
    
    render(
      <StepByStepTestCaseCard
        testCase={mockTestCase}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Check that title is displayed
    expect(screen.getByText('Test Login Functionality')).toBeInTheDocument();
    
    // Check that preconditions are displayed
    expect(screen.getByText('User has valid credentials')).toBeInTheDocument();
    
    // Check that expected outcome is displayed
    expect(screen.getByText('User should be logged in successfully')).toBeInTheDocument();
    
    // Check that steps are displayed
    expect(screen.getByText('Navigate to login page')).toBeInTheDocument();
    expect(screen.getByText('Enter username and password')).toBeInTheDocument();
    
    // Check that step count badge is correct
    expect(screen.getByText('2 Steps')).toBeInTheDocument();
  });

  it('should update when testCase prop changes', () => {
    const mockOnUpdate = vi.fn();
    
    const { rerender } = render(
      <StepByStepTestCaseCard
        testCase={mockTestCase}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Initial render - check original content
    expect(screen.getByText('Test Login Functionality')).toBeInTheDocument();
    expect(screen.getByText('Navigate to login page')).toBeInTheDocument();

    // Update the test case prop
    const updatedTestCase = {
      ...mockTestCase,
      title: 'Updated Test Title',
      steps: [
        {
          id: 'step-1',
          description: 'Updated step description',
          expectedResult: 'Updated expected result'
        }
      ]
    };

    rerender(
      <StepByStepTestCaseCard
        testCase={updatedTestCase}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Check that the component displays updated content
    expect(screen.getByText('Updated Test Title')).toBeInTheDocument();
    expect(screen.getByText('Updated step description')).toBeInTheDocument();
    expect(screen.getByText('1 Step')).toBeInTheDocument();
    
    // Old content should not be present
    expect(screen.queryByText('Test Login Functionality')).not.toBeInTheDocument();
    expect(screen.queryByText('Navigate to login page')).not.toBeInTheDocument();
  });

  it('should handle empty steps array', () => {
    const mockOnUpdate = vi.fn();
    const emptyTestCase = {
      ...mockTestCase,
      steps: []
    };
    
    render(
      <StepByStepTestCaseCard
        testCase={emptyTestCase}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    expect(screen.getByText('0 Steps')).toBeInTheDocument();
  });
});