# Permissions System

This document describes the new granular permissions system that replaces the old role-based access control.

## Overview

The permissions system provides fine-grained access control for different actions within the application. It combines role-based permissions with custom user permissions for maximum flexibility.

## Changes from Previous System

### Roles Simplified
- **Before**: `owner`, `admin`, `member`, `reviewer`
- **After**: `owner`, `admin`, `member`

The `reviewer` role has been removed as it didn't provide meaningful distinction from `member`. Users can now be granted specific review permissions through the granular permissions system.

### New Permission Categories

1. **Workspace** - Managing workspace settings and members
2. **Projects** - Creating, updating, deleting projects
3. **Test Cases** - Managing test cases
4. **Test Runs** - Managing test runs and execution
5. **Test Reviews** - Managing test reviews and approvals

## Database Schema

### Tables

#### `permissions`
Defines all available permissions in the system.
```sql
- id: UUID (Primary Key)
- name: TEXT (Unique) - e.g., 'projects.create'
- description: TEXT - Human-readable description
- category: TEXT - e.g., 'projects', 'test_cases'
- action: TEXT - e.g., 'create', 'read', 'update', 'delete'
```

#### `user_permissions`
Grants specific permissions to users.
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- permission_id: UUID (Foreign Key to permissions)
- workspace_id: UUID (Foreign Key to workspaces)
- project_id: UUID (Optional, for project-specific permissions)
- granted_by: UUID (Foreign Key to auth.users)
```

#### `role_permissions`
Defines default permissions for each role.
```sql
- id: UUID (Primary Key)
- role: TEXT - 'owner', 'admin', 'member'
- permission_id: UUID (Foreign Key to permissions)
- scope: TEXT - 'workspace' or 'project'
```

## Available Permissions

### Project Permissions
- `projects.create` - Create new projects
- `projects.read` - View projects
- `projects.update` - Edit project details
- `projects.delete` - Delete projects
- `projects.manage_members` - Add/remove project members

### Test Case Permissions
- `test_cases.create` - Create new test cases
- `test_cases.read` - View test cases
- `test_cases.update` - Edit test cases
- `test_cases.delete` - Delete test cases

### Test Run Permissions
- `test_runs.create` - Create new test runs
- `test_runs.read` - View test runs
- `test_runs.update` - Edit test runs
- `test_runs.delete` - Delete test runs
- `test_runs.execute` - Execute test runs

### Test Review Permissions
- `test_reviews.create` - Create test reviews
- `test_reviews.read` - View test reviews
- `test_reviews.update` - Edit test reviews
- `test_reviews.delete` - Delete test reviews
- `test_reviews.approve` - Approve test reviews

### Workspace Permissions
- `workspace.manage_members` - Manage workspace members
- `workspace.manage_settings` - Manage workspace settings

## Default Role Permissions

### Admin (Workspace Level)
Admins receive ALL permissions at the workspace level.

### Member (Workspace Level)
Members receive:
- `projects.read`
- `test_cases.create`, `test_cases.read`, `test_cases.update`
- `test_runs.create`, `test_runs.read`, `test_runs.update`, `test_runs.execute`
- `test_reviews.create`, `test_reviews.read`, `test_reviews.update`, `test_reviews.approve`

### Member (Project Level)
Project members receive the same permissions as workspace members but scoped to specific projects.

## Usage in Components

### Basic Permission Checking

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      {hasPermission('projects.create') && (
        <Button>Create Project</Button>
      )}
    </div>
  );
}
```

### Convenience Hooks

```typescript
import { 
  useCanCreateProjects,
  useCanManageWorkspace,
  useCanCreateTestCases 
} from '@/hooks/use-permissions';

function MyComponent() {
  const canCreateProjects = useCanCreateProjects();
  const canManageWorkspace = useCanManageWorkspace();
  const canCreateTestCases = useCanCreateTestCases();
  
  // Use the boolean values directly
}
```

### Project-Specific Permissions

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function ProjectComponent({ projectId }: { projectId: string }) {
  const { hasPermission } = usePermissions(projectId);
  
  return (
    <div>
      {hasPermission('test_cases.create', projectId) && (
        <Button>Create Test Case</Button>
      )}
    </div>
  );
}
```

## API Functions

### Check Permissions
```typescript
import { hasPermission } from '@/lib/supabase/permissions-api';

const canCreate = await hasPermission(
  userId, 
  workspaceId, 
  'projects.create'
);
```

### Get User Permissions
```typescript
import { getUserPermissions } from '@/lib/supabase/permissions-api';

const permissions = await getUserPermissions(
  userId, 
  workspaceId, 
  projectId // optional
);
```

### Grant/Revoke Permissions
```typescript
import { 
  grantUserPermission, 
  revokeUserPermission 
} from '@/lib/supabase/permissions-api';

// Grant permission
await grantUserPermission(
  userId,
  permissionId,
  workspaceId,
  grantedByUserId,
  projectId // optional
);

// Revoke permission
await revokeUserPermission(
  userId,
  permissionId,
  workspaceId,
  projectId // optional
);
```

## Management UI

### Permissions Overview
The `PermissionsOverview` component shows default permissions for each role in a table format.

### Permissions Manager
The `PermissionsManager` component allows admins to grant/revoke custom permissions for individual users.

### Integration
Both components are integrated into the Workspace Settings under the "Permissions" tab.

## Migration

The migration automatically:
1. Creates the new permissions tables
2. Populates default permissions
3. Updates role constraints to remove 'reviewer'
4. Migrates existing 'reviewer' roles to 'member'

## Best Practices

1. **Use convenience hooks** when possible for common permission checks
2. **Check permissions at the component level** rather than relying solely on API-level checks
3. **Combine with role checks** for backward compatibility during transition
4. **Grant minimal permissions** and add more as needed
5. **Use project-specific permissions** for fine-grained access control

## Backward Compatibility

The system maintains backward compatibility by:
- Keeping existing role-based checks alongside permission checks
- Providing fallback logic in components
- Maintaining the `useRoleAccess` hook for existing code

This allows for gradual migration to the new permissions system.