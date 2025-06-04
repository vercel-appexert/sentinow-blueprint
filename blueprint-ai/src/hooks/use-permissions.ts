import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useWorkspace } from '@/lib/workspace-context';
import { supabase } from '@/lib/supabase/client';
import {
  getUserPermissions,
  hasPermission,
  getAllPermissions,
  getPermissionsByCategory
} from '@/lib/supabase/permissions-api';
import { Permission, UserPermissions } from '@/lib/types/workspace';

interface UsePermissionsResult {
  permissions: UserPermissions;
  loading: boolean;
  error: string | null;
  hasPermission: (permissionName: string, projectId?: string) => boolean;
  checkPermission: (permissionName: string, projectId?: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(projectId?: string): UsePermissionsResult {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [permissions, setPermissions] = useState<UserPermissions>({ workspace: [], project: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPermissions = useCallback(async () => {
    if (!user || !currentWorkspace) {
      setPermissions({ workspace: [], project: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userPermissions = await getUserPermissions(
        user.id,
        currentWorkspace.id,
        projectId
      );

      setPermissions(userPermissions);
    } catch (err) {
      console.error('Error loading permissions:', err);
      setError('Failed to load permissions');
      setPermissions({ workspace: [], project: [] });
    } finally {
      setLoading(false);
    }
  }, [user, currentWorkspace, projectId]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Set up real-time subscription for permission changes
  useEffect(() => {
    if (!user || !currentWorkspace) return;

    // Subscribe to user_permissions table changes for this user
    const subscription = supabase
      .channel('user-permissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_permissions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh permissions on any change
          loadPermissions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, currentWorkspace, loadPermissions]);

  const hasPermissionLocal = useCallback((permissionName: string, checkProjectId?: string) => {
    // Check workspace permissions first
    const hasWorkspacePermission = permissions.workspace.some(p => p.name === permissionName);
    if (hasWorkspacePermission) return true;

    // Check project permissions if project context
    if (checkProjectId || projectId) {
      const hasProjectPermission = permissions.project.some(p => p.name === permissionName);
      return hasProjectPermission;
    }

    return false;
  }, [permissions, projectId]);

  const checkPermissionAsync = useCallback(async (permissionName: string, checkProjectId?: string) => {
    if (!user || !currentWorkspace) return false;

    try {
      return await hasPermission(
        user.id,
        currentWorkspace.id,
        permissionName,
        checkProjectId || projectId
      );
    } catch (err) {
      console.error('Error checking permission:', err);
      return false;
    }
  }, [user, currentWorkspace, projectId]);

  return {
    permissions,
    loading,
    error,
    hasPermission: hasPermissionLocal,
    checkPermission: checkPermissionAsync,
    refreshPermissions: loadPermissions
  };
}

interface UseAllPermissionsResult {
  allPermissions: Permission[];
  permissionsByCategory: Record<string, Permission[]>;
  loading: boolean;
  error: string | null;
}

export function useAllPermissions(): UseAllPermissionsResult {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionsByCategory, setPermissionsByCategory] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const [permissions, categorizedPermissions] = await Promise.all([
          getAllPermissions(),
          getPermissionsByCategory()
        ]);

        setAllPermissions(permissions);
        setPermissionsByCategory(categorizedPermissions);
      } catch (err) {
        console.error('Error loading all permissions:', err);
        setError('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };

    loadAllPermissions();
  }, []);

  return {
    allPermissions,
    permissionsByCategory,
    loading,
    error
  };
}

// Convenience hooks for common permission checks
export function useCanCreateProjects(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission('projects.create');
}

export function useCanManageWorkspace(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission('workspace.manage_members') || hasPermission('workspace.manage_settings');
}

export function useCanManageProject(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('projects.update', projectId) || hasPermission('projects.manage_members', projectId);
}

export function useCanCreateTestCases(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_cases.create', projectId);
}

export function useCanUpdateTestCases(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_cases.update', projectId);
}

export function useCanDeleteTestCases(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_cases.delete', projectId);
}

export function useCanCreateTestRuns(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_runs.create', projectId);
}

export function useCanUpdateTestRuns(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_runs.update', projectId);
}

export function useCanDeleteTestRuns(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_runs.delete', projectId);
}

export function useCanExecuteTestRuns(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_runs.execute', projectId);
}

export function useCanCreateTestReviews(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_reviews.create', projectId);
}

export function useCanUpdateTestReviews(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_reviews.update', projectId);
}

export function useCanDeleteTestReviews(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_reviews.delete', projectId);
}

export function useCanApproveTestReviews(projectId?: string): boolean {
  const { hasPermission } = usePermissions(projectId);
  return hasPermission('test_reviews.approve', projectId);
}

export function useCanDeleteProjects(): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission('projects.delete');
}
