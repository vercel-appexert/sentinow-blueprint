import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useWorkspace } from '@/lib/workspace-context';
import { useAllPermissions } from '@/hooks/use-permissions';
import {
  getUserCustomPermissions,
  grantUserPermission,
  revokeUserPermission,
  getRolePermissions
} from '@/lib/supabase/permissions-api';
import { Permission, UserPermission, WorkspaceMember, ProjectMember, RolePermission } from '@/lib/types/workspace';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Shield, User, Settings, Database, Play, FileCheck } from 'lucide-react';

interface PermissionsManagerProps {
  member: WorkspaceMember | ProjectMember;
  projectId?: string;
  onPermissionsChange?: () => void;
}

const categoryIcons = {
  workspace: Settings,
  projects: Database,
  test_cases: FileCheck,
  test_runs: Play,
  test_reviews: Shield
};

const categoryLabels = {
  workspace: 'Workspace',
  projects: 'Projects',
  test_cases: 'Test Cases',
  test_runs: 'Test Runs',
  test_reviews: 'Test Reviews'
};

export function PermissionsManager({ member, projectId, onPermissionsChange }: PermissionsManagerProps) {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { permissionsByCategory, loading: permissionsLoading } = useAllPermissions();
  const { toast } = useToast();

  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadUserPermissions();
  }, [member.user_id, currentWorkspace?.id, projectId]);

  const loadUserPermissions = async () => {
    if (!currentWorkspace) return;

    try {
      setLoading(true);

      // Load custom user permissions
      const permissions = await getUserCustomPermissions(
        member.user_id,
        currentWorkspace.id,
        projectId
      );
      setUserPermissions(permissions);

      // Load role-based permissions
      const scope = projectId ? 'project' : 'workspace';
      const rolePerms = await getRolePermissions(member.role, scope);
      setRolePermissions(rolePerms);

    } catch (error) {
      console.error('Error loading user permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user permissions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const hasCustomPermission = (permissionId: string): boolean => {
    return userPermissions.some(up => up.permission_id === permissionId);
  };

  const hasRolePermission = (permissionId: string): boolean => {
    return rolePermissions.some(rp => rp.permission_id === permissionId);
  };

  const togglePermission = async (permission: Permission, granted: boolean) => {
    if (!user || !currentWorkspace) return;

    setUpdating(permission.id);
    try {
      if (granted) {
        await grantUserPermission(
          member.user_id,
          permission.id,
          currentWorkspace.id,
          user.id,
          projectId
        );
        toast({
          title: 'Permission granted',
          description: `${permission.description || permission.name} has been granted to ${member.user?.email}`
        });
      } else {
        await revokeUserPermission(
          member.user_id,
          permission.id,
          currentWorkspace.id,
          projectId
        );
        toast({
          title: 'Permission revoked',
          description: `${permission.description || permission.name} has been revoked from ${member.user?.email}`
        });
      }

      await loadUserPermissions();
      onPermissionsChange?.();
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update permission',
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <User className="h-4 w-4" />
        <span className="font-medium">{member.user?.email}</span>
        <Badge variant="secondary">{member.role}</Badge>
        {projectId && (
          <Badge variant="outline">Project Member</Badge>
        )}
      </div>

      {/* Permissions by Category */}
      {Object.entries(permissionsByCategory).map(([category, permissions]) => {
        const Icon = categoryIcons[category as keyof typeof categoryIcons] || Shield;
        const label = categoryLabels[category as keyof typeof categoryLabels] || category;

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <h4 className="font-medium">{label}</h4>
            </div>

            <div className="space-y-3">
              {permissions.map((permission) => {
                const isRoleBased = hasRolePermission(permission.id);
                const isCustom = hasCustomPermission(permission.id);
                const isChecked = isRoleBased || isCustom;

                return (
                  <div key={permission.id} className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {permission.description || permission.name}
                        {isRoleBased && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Role Default
                          </Badge>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.name}
                      </p>
                    </div>

                    <Switch
                      id={`permission-${permission.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (!isRoleBased) {
                          togglePermission(permission, checked);
                        }
                      }}
                      disabled={isRoleBased || updating === permission.id}
                      title={
                        isRoleBased
                          ? `This permission is granted by the ${member.role} role and cannot be changed`
                          : isCustom
                            ? 'Custom permission - click to revoke'
                            : 'Click to grant this permission'
                      }
                    />
                  </div>
                );
              })}
            </div>

            {category !== Object.keys(permissionsByCategory)[Object.keys(permissionsByCategory).length - 1] && (
              <Separator />
            )}
          </div>
        );
      })}

      {Object.keys(permissionsByCategory).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No permissions available to manage
        </div>
      )}
    </div>
  );
}