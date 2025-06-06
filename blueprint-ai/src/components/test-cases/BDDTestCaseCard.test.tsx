import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BDDTestCaseCard } from './BDDTestCaseCard';

const mockFeature = {
  title: 'User Login Feature',
  description: 'Test user authentication functionality',
  scenarios: [
    {
      id: 'scenario-1',
      title: 'Valid login',
      steps: [
        { type: 'given' as const, content: 'user is on login page' },
        { type: 'when' as const, content: 'user enters valid credentials' },
        { type: 'then' as const, content: 'user should be logged in' }
      ]
    }
  ]
};

describe('BDDTestCaseCard', () => {
  it('should render feature content correctly', () => {
    const mockOnUpdate = vi.fn();
    
    render(
      <BDDTestCaseCard
        feature={mockFeature}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Check that title is displayed
    expect(screen.getByText('User Login Feature')).toBeInTheDocument();
    
    // Check that steps are displayed
    expect(screen.getByText('user is on login page')).toBeInTheDocument();
    expect(screen.getByText('user enters valid credentials')).toBeInTheDocument();
    expect(screen.getByText('user should be logged in')).toBeInTheDocument();
    
    // Check that step types are displayed
    expect(screen.getByText('given')).toBeInTheDocument();
    expect(screen.getByText('when')).toBeInTheDocument();
    expect(screen.getByText('then')).toBeInTheDocument();
  });

  it('should update when feature prop changes', () => {
    const mockOnUpdate = vi.fn();
    
    const { rerender } = render(
      <BDDTestCaseCard
        feature={mockFeature}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Initial render - check original content
    expect(screen.getByText('User Login Feature')).toBeInTheDocument();
    expect(screen.getByText('user is on login page')).toBeInTheDocument();

    // Update the feature prop
    const updatedFeature = {
      ...mockFeature,
      title: 'Updated Feature Title',
      scenarios: [
        {
          id: 'scenario-1',
          title: 'Updated scenario',
          steps: [
            { type: 'given' as const, content: 'updated step content' }
          ]
        }
      ]
    };

    rerender(
      <BDDTestCaseCard
        feature={updatedFeature}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    // Check that the component displays updated content
    expect(screen.getByText('Updated Feature Title')).toBeInTheDocument();
    expect(screen.getByText('updated step content')).toBeInTheDocument();
    
    // Old content should not be present
    expect(screen.queryByText('User Login Feature')).not.toBeInTheDocument();
    expect(screen.queryByText('user is on login page')).not.toBeInTheDocument();
  });

  it('should handle empty scenarios array', () => {
    const mockOnUpdate = vi.fn();
    const emptyFeature = {
      ...mockFeature,
      scenarios: []
    };
    
    render(
      <BDDTestCaseCard
        feature={emptyFeature}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    expect(screen.getByText('User Login Feature')).toBeInTheDocument();
    // Should not crash with empty scenarios
  });

  it('should handle multiple scenarios', () => {
    const mockOnUpdate = vi.fn();
    const multiScenarioFeature = {
      ...mockFeature,
      scenarios: [
        {
          id: 'scenario-1',
          title: 'Valid login',
          steps: [
            { type: 'given' as const, content: 'user is on login page' }
          ]
        },
        {
          id: 'scenario-2', 
          title: 'Invalid login',
          steps: [
            { type: 'given' as const, content: 'user enters invalid credentials' }
          ]
        }
      ]
    };
    
    render(
      <BDDTestCaseCard
        feature={multiScenarioFeature}
        onUpdate={mockOnUpdate}
        forceEditMode={false}
      />
    );

    expect(screen.getByText('user is on login page')).toBeInTheDocument();
    expect(screen.getByText('user enters invalid credentials')).toBeInTheDocument();
  });
});