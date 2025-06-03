import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace, Project } from '../types/workspace';

// This store is a bridge between the existing WorkspaceContext and our Tanstack Query hooks
// It doesn't manage the workspace/project state directly, but provides a way to access it
// from components that don't have access to the WorkspaceContext

interface WorkspaceState {
  // These values will be set by the WorkspaceContextBridge component
  currentWorkspace: Workspace | null;
  currentProject: Project | null;

  // Actions - these are just placeholders that will be overridden by the bridge
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentProject: (project: Project | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      currentProject: null,

      // These are placeholder implementations that will be overridden
      setCurrentWorkspace: (workspace: Workspace | null) => {
        set({ currentWorkspace: workspace });
      },

      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project });
      },
    }),
    {
      name: 'blueprint-workspace-storage',
      // Only persist these fields
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        currentProject: state.currentProject,
      }),
    }
  )
);

// Make the store accessible globally for direct access in other modules
// This is useful for modules that don't have access to React hooks
if (typeof window !== 'undefined') {
  (window as any).__ZUSTAND_WORKSPACE_STORE__ = useWorkspaceStore;
}
