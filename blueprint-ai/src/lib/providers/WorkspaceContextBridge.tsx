import { ReactNode, useEffect } from 'react';
import { useWorkspace } from '../workspace-context';
import { useWorkspaceStore } from '../stores/workspaceStore';

interface WorkspaceContextBridgeProps {
  children: ReactNode;
}

// This component bridges the gap between the existing WorkspaceContext
// and our Zustand store, keeping them in sync
export function WorkspaceContextBridge({ children }: WorkspaceContextBridgeProps) {
  const {
    currentWorkspace,
    currentProject,
    loading
  } = useWorkspace();

  const {
    setCurrentWorkspace: storeSetWorkspace,
    setCurrentProject: storeSetProject
  } = useWorkspaceStore();

  // Sync context -> store (including null values)
  useEffect(() => {
    storeSetWorkspace(currentWorkspace);
  }, [currentWorkspace, storeSetWorkspace]);

  useEffect(() => {
    // Always sync the current project, even if it's null
    // This is important when a user has no projects
    if (!loading) {
      storeSetProject(currentProject);
    }
  }, [currentProject, loading, storeSetProject]);

  return <>{children}</>;
}
