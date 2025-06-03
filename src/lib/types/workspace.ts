export interface Workspace {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  role: WorkspaceRole;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  key: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  role: ProjectRole;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member';
export type ProjectRole = 'admin' | 'member';

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
  updated_at: string;
  invited_by?: string;
  invitation_accepted: boolean;
  user?: {
    email: string;
    name?: string;
    email_confirmed_at?: string;
  };
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    name?: string;
    email_confirmed_at?: string;
  };
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  role: WorkspaceRole;
  token: string;
  expires_at: string;
  created_at: string;
  invited_by?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  slug?: string;
  domain?: string;
  logo_url?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  key: string;
  workspace_id: string;
}

export interface InviteWorkspaceMemberRequest {
  email: string;
  role: WorkspaceRole;
  workspace_id: string;
}

export interface AddProjectMemberRequest {
  user_id: string;
  role: ProjectRole;
  project_id: string;
}

// Permission system types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  category: string;
  action: string;
  created_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  workspace_id?: string;
  project_id?: string;
  granted_by?: string;
  created_at: string;
  permission?: Permission;
}

export interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
  scope: 'workspace' | 'project';
  created_at: string;
  permission?: Permission;
}

export interface PermissionCategory {
  name: string;
  permissions: Permission[];
}

export interface UserPermissions {
  workspace: Permission[];
  project: Permission[];
}