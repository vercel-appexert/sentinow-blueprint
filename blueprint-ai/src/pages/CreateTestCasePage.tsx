import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TestCaseBuilderForm } from '@/components/test-cases/TestCaseBuilderForm';
import { GeneratedTestCasesList } from '@/components/test-cases/GeneratedTestCasesList';
import { SaveFolderDialog } from '@/components/test-cases/SaveFolderDialog';
import { TestCase, TestCaseFormat, FolderNode } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { getFolderStructureFromEdgeFunction } from '@/lib/supabase/folder-api';
import { useTestCaseGeneration } from '@/hooks/use-test-case-generation';
import { useWorkspaceStore } from '@/lib/stores/workspaceStore';
import { useCanCreateTestCases } from '@/hooks/use-permissions';
import { useCreateMultipleTestCases } from '@/lib/hooks/useTestCases';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function CreateTestCasePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkspace, currentProject } = useWorkspaceStore();
  const canCreateTestCases = useCanCreateTestCases(currentProject?.id);
  const { isGenerating, generatedTestCases, generateTestCases, updateTestCases } = useTestCaseGeneration();
  const createTestCasesMutation = useCreateMultipleTestCases();

  // Get folder ID from URL query parameters or location state if available
  const searchParams = new URLSearchParams(location.search);
  const folderIdFromQuery = searchParams.get('folderId');
  const initialFolderId = folderIdFromQuery || location.state?.folderId || null;

  // Use a ref to track the current folder ID to avoid unnecessary re-renders
  const folderIdRef = useRef<string | null>(initialFolderId);

  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [folders, setFolders] = useState<FolderNode[]>([]);
  // Keep the state for UI updates, but use the ref for operations
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId);
  const [saveFolderDialogOpen, setSaveFolderDialogOpen] = useState(false);

  // Load folders - memoize the effect callback to avoid recreating it on each render
  useEffect(() => {
    const loadFolders = async () => {
      try {
        // Get the current workspace and project IDs from the store
        const workspaceId = currentWorkspace?.id;
        const projectId = currentProject?.id;

        console.log('Using workspace/project IDs:', { workspaceId, projectId });

        if (!workspaceId || !projectId) {
          console.warn('Missing workspace or project ID from store');
          return;
        }

        const folderStructure = await getFolderStructureFromEdgeFunction(
          workspaceId,
          projectId
        );
        setFolders(folderStructure);

        // If we have an initial folder ID, make sure the ref is updated
        if (initialFolderId && folderIdRef.current !== initialFolderId) {
          folderIdRef.current = initialFolderId;
        }
      } catch (error) {
        console.error('Error loading folders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load folders. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadFolders();
  }, [toast, initialFolderId, currentWorkspace, currentProject]);

  // Handle test case generation
  const handleGenerateTestCases = useCallback(async (
    input: string,
    testFormat: TestCaseFormat,
    coverage: string,
    metadata?: Record<string, any>
  ) => {
    const testCases = await generateTestCases(input, testFormat, coverage, metadata);
    if (testCases.length > 0) {
      setShowForm(false);
    }
  }, [generateTestCases]);

  // Handle test case updates
  const handleUpdateTestCases = useCallback((updatedTestCases: TestCase[]) => {
    updateTestCases(updatedTestCases);
  }, [updateTestCases]);

  // Function to open the save dialog
  const openSaveDialog = useCallback(async () => {
    if (!selectedFolderId) {
      // If no folder is selected, show a warning in the dialog
      setSaveFolderDialogOpen(true);
    } else {
      // If a folder is already selected, open the dialog with that folder
      setSaveFolderDialogOpen(true);
    }
    // Return a resolved promise to satisfy the type requirement
    return Promise.resolve();
  }, [selectedFolderId]);

  // Memoize the save function to avoid recreating it on each render
  const handleSaveTestCases = useCallback(async () => {
    // Use the ref value instead of the state to avoid re-renders affecting the operation
    const currentFolderId = folderIdRef.current;

    if (!currentFolderId) {
      // If no folder is selected, open the dialog instead of showing a toast
      openSaveDialog();
      return;
    }

    try {
      setIsSaving(true);

      // Prepare test cases for saving
      const testCasesToSave = generatedTestCases.map((testCase, index) => {
        const testCaseToSave = {
          ...testCase,
          folder_id: currentFolderId,
          position: index,
          // Preserve existing source, source_url, reference_type, and reference_id if they exist
          source: testCase.source || 'AI Generated',
          source_url: testCase.source_url || '',
          reference_type: testCase.reference_type,
          reference_id: testCase.reference_id,
          created_by: user?.id,
        };

        // Remove id, created_at, updated_at, and isSelected as they will be generated by the database
        // or are not part of the database schema
        const { id, created_at, updated_at, isSelected, ...testCaseData } = testCaseToSave;
        return testCaseData;
      });

      // Use the mutation to save all test cases
      await createTestCasesMutation.mutateAsync(testCasesToSave);

      // Navigate back to the test library with the selected folder as query parameter
      navigate(currentFolderId ? `/test-library?folderId=${currentFolderId}` : '/test-library');
    } catch (error) {
      console.error('Error saving test cases:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save test cases. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [generatedTestCases, navigate, toast, user?.id, openSaveDialog, createTestCasesMutation]);

  // Memoize the back to form function to avoid recreating it on each render
  const handleBackToForm = useCallback(() => {
    setShowForm(true);
  }, []);

  // Memoize the folder selection handler to avoid recreating it on each render
  const handleFolderSelect = useCallback((folderId: string) => {
    // Update both the ref and the state
    folderIdRef.current = folderId;
    setSelectedFolderId(folderId);
  }, []);

  // Check permissions before rendering
  if (!canCreateTestCases) {
    return (
      <div className="container mx-auto space-y-4">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/test-library')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Create Test Case</h1>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Permission Denied</h2>
          <p className="text-muted-foreground mb-4">
            You do not have permission to create test cases in this project.
          </p>
          <Button onClick={() => navigate('/test-library')}>
            Back to Test Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4">
      {showForm && (
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/test-library')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Create Test Case</h1>
        </div>
      )}

      {showForm ? (
        <div>
          <TestCaseBuilderForm
            onGenerateTestCases={handleGenerateTestCases}
            isGenerating={isGenerating}
          />
        </div>
      ) : (
        <div>
          <GeneratedTestCasesList
            testCases={generatedTestCases}
            onUpdateTestCases={handleUpdateTestCases}
            onSaveTestCases={openSaveDialog}
            onCancel={handleBackToForm}
          />
        </div>
      )}

      <SaveFolderDialog
        open={saveFolderDialogOpen}
        onOpenChange={setSaveFolderDialogOpen}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        onSave={handleSaveTestCases}
        isSaving={isSaving}
      />
    </div>
  );
}
