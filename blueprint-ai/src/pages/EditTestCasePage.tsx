import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestCaseForm } from '../components/test-cases/TestCaseForm';
import { getTestCaseById, updateTestCase } from '../lib/supabase/api';
import { TestCase } from '../lib/types';
import { useToast } from '../hooks/use-toast';
import { useCanUpdateTestCases } from '../hooks/use-permissions';
import { useWorkspaceStore } from '../lib/stores/workspaceStore';
import { Button } from '../components/ui/button';

export function EditTestCasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentProject } = useWorkspaceStore();
  const canUpdateTestCases = useCanUpdateTestCases(currentProject?.id);

  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestCase = async () => {
      if (!id) return;

      try {
        const data = await getTestCaseById(id);
        setTestCase(data);
      } catch (error) {
        console.error('Error fetching test case:', error);
        toast({
          title: 'Error',
          description: 'Failed to load test case for editing.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestCase();
  }, [id, toast]);

  const handleSubmit = async (data: any): Promise<TestCase> => {
    if (!id) throw new Error("Test case ID is required");

    try {
      const updatedTestCase = await updateTestCase(id, data);

      toast({
        title: 'Test case updated',
        description: 'Your test case has been updated successfully.',
      });

      navigate(`/test-cases/${id}`);
      return updatedTestCase;
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update test case. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading test case...</div>;
  }

  if (!canUpdateTestCases) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Permission Denied</h2>
        <p className="text-muted-foreground mb-4">
          You do not have permission to edit test cases in this project.
        </p>
        <Button onClick={() => navigate('/test-library')}>
          Back to Test Library
        </Button>
      </div>
    );
  }

  if (!testCase) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Test Case Not Found</h2>
        <p className="text-muted-foreground">The test case you're trying to edit doesn't exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Test Case</h1>
      <TestCaseForm initialData={testCase} onSubmit={handleSubmit} isEditing={true} />
    </div>
  );
}
