import { supabase } from './client';
import { Permission, UserPermission, RolePermission, UserPermissions } from '../types/workspace';

// Get all available permissions
export async function getAllPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('category', { ascending: true })
    .order('action', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get permissions by category
export async function getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
  const permissions = await getAllPermissions();
  
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
}

// Get user's effective permissions (role-based + custom permissions)
export async function getUserPermissions(
  userId: string, 
  workspaceId: string, 
  projectId?: string
): Promise<UserPermissions> {
  try {
    // Get user's workspace role
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .eq('invitation_accepted', true)
      .single();

    if (!workspaceMember) {
      return { workspace: [], project: [] };
    }

    // Get role-based permissions for workspace
    const { data: workspaceRolePermissions } = await supabase
      .from('role_permissions')
      .select(`
        permission:permissions(*)
      `)
      .eq('role', workspaceMember.role)
      .eq('scope', 'workspace');

    // Get role-based permissions for project (if project member)
    let projectRolePermissions: any[] = [];
    if (projectId) {
      const { data: projectMember } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single();

      if (projectMember) {
        const { data } = await supabase
          .from('role_permissions')
          .select(`
            permission:permissions(*)
          `)
          .eq('role', projectMember.role)
          .eq('scope', 'project');
        
        projectRolePermissions = data || [];
      }
    }

    // Get custom user permissions
    const { data: customPermissions } = await supabase
      .from('user_permissions')
      .select(`
        permission:permissions(*)
      `)
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId);

    // Combine and deduplicate permissions
    const workspacePermissions = new Map<string, Permission>();
    const projectPermissions = new Map<string, Permission>();

    // Add role-based workspace permissions
    workspaceRolePermissions?.forEach((rp: any) => {
      if (rp.permission && typeof rp.permission === 'object' && rp.permission.id) {
        workspacePermissions.set(rp.permission.id, rp.permission as Permission);
      }
    });

    // Add role-based project permissions
    projectRolePermissions?.forEach((rp: any) => {
      if (rp.permission && typeof rp.permission === 'object' && rp.permission.id) {
        projectPermissions.set(rp.permission.id, rp.permission as Permission);
      }
    });

    // Add custom permissions
    customPermissions?.forEach((up: any) => {
      if (up.permission && typeof up.permission === 'object' && up.permission.id) {
        if (up.project_id) {
          projectPermissions.set(up.permission.id, up.permission as Permission);
        } else {
          workspacePermissions.set(up.permission.id, up.permission as Permission);
        }
      }
    });

    return {
      workspace: Array.from(workspacePermissions.values()),
      project: Array.from(projectPermissions.values())
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return { workspace: [], project: [] };
  }
}

// Check if user has a specific permission
export async function hasPermission(
  userId: string,
  workspaceId: string,
  permissionName: string,
  projectId?: string
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId, workspaceId, projectId);
    
    // Check workspace permissions first
    const hasWorkspacePermission = permissions.workspace.some(p => p.name === permissionName);
    if (hasWorkspacePermission) return true;
    
    // Check project permissions if project context
    if (projectId) {
      const hasProjectPermission = permissions.project.some(p => p.name === permissionName);
      return hasProjectPermission;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

// Grant permission to user
export async function grantUserPermission(
  userId: string,
  permissionId: string,
  workspaceId: string,
  grantedBy: string,
  projectId?: string
): Promise<UserPermission> {
  const { data, error } = await supabase
    .from('user_permissions')
    .insert({
      user_id: userId,
      permission_id: permissionId,
      workspace_id: workspaceId,
      project_id: projectId,
      granted_by: grantedBy
    })
    .select(`
      *,
      permission:permissions(*)
    `)
    .single();

  if (error) throw error;
  return data;
}

// Revoke permission from user
export async function revokeUserPermission(
  userId: string,
  permissionId: string,
  workspaceId: string,
  projectId?: string
): Promise<void> {
  const { error } = await supabase
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('permission_id', permissionId)
    .eq('workspace_id', workspaceId)
    .eq('project_id', projectId || null);

  if (error) throw error;
}

// Get user's custom permissions (excluding role-based)
export async function getUserCustomPermissions(
  userId: string,
  workspaceId: string,
  projectId?: string
): Promise<UserPermission[]> {
  const query = supabase
    .from('user_permissions')
    .select(`
      *,
      permission:permissions(*)
    `)
    .eq('user_id', userId)
    .eq('workspace_id', workspaceId);

  if (projectId) {
    query.eq('project_id', projectId);
  } else {
    query.is('project_id', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// Get all role permissions for a specific role and scope
export async function getRolePermissions(
  role: string,
  scope: 'workspace' | 'project'
): Promise<RolePermission[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select(`
      *,
      permission:permissions(*)
    `)
    .eq('role', role)
    .eq('scope', scope);

  if (error) throw error;
  return data || [];
}