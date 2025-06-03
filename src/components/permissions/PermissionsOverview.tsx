import { useState, useEffect } from 'react';
import { useAllPermissions } from '@/hooks/use-permissions';
import { getRolePermissions } from '@/lib/supabase/permissions-api';
import { RolePermission, WorkspaceRole, ProjectRole } from '@/lib/types/workspace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, FileCheck, Play, Settings } from 'lucide-react';

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

export function PermissionsOverview() {
  const { permissionsByCategory, loading: permissionsLoading } = useAllPermissions();
  const [workspaceRolePermissions, setWorkspaceRolePermissions] = useState<Record<string, RolePermission[]>>({});
  const [projectRolePermissions, setProjectRolePermissions] = useState<Record<string, RolePermission[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRolePermissions();
  }, []);

  const loadRolePermissions = async () => {
    try {
      setLoading(true);

      // Load workspace role permissions
      const workspaceRoles: WorkspaceRole[] = ['owner', 'admin', 'member'];
      const workspacePermissions: Record<string, RolePermission[]> = {};

      for (const role of workspaceRoles) {
        const permissions = await getRolePermissions(role, 'workspace');
        workspacePermissions[role] = permissions;
      }

      // Load project role permissions
      const projectRoles: ProjectRole[] = ['admin', 'member'];
      const projectPermissions: Record<string, RolePermission[]> = {};

      for (const role of projectRoles) {
        const permissions = await getRolePermissions(role, 'project');
        projectPermissions[role] = permissions;
      }

      setWorkspaceRolePermissions(workspacePermissions);
      setProjectRolePermissions(projectPermissions);
    } catch (error) {
      console.error('Error loading role permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRolePermission = (rolePermissions: RolePermission[], permissionName: string): boolean => {
    return rolePermissions.some(rp => rp.permission?.name === permissionName);
  };

  if (loading || permissionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions Overview
          </CardTitle>
          <CardDescription>Loading permissions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissions Overview
        </CardTitle>
        <CardDescription>
          View default permissions for each role. Custom permissions can be granted individually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workspace" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workspace">Workspace Roles</TabsTrigger>
            <TabsTrigger value="project">Project Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="space-y-6">
            {Object.entries(permissionsByCategory).map(([category, permissions]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || Shield;
              const label = categoryLabels[category as keyof typeof categoryLabels] || category;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <h4 className="font-medium">{label}</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium">Permission</th>
                          <th className="text-center py-2 px-2 font-medium">Owner</th>
                          <th className="text-center py-2 px-2 font-medium">Admin</th>
                          <th className="text-center py-2 px-2 font-medium">Member</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissions.map((permission) => (
                          <tr key={permission.id} className="border-b border-gray-100">
                            <td className="py-2 pr-4">
                              <div>
                                <div className="font-medium text-sm">
                                  {permission.description || permission.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {permission.name}
                                </div>
                              </div>
                            </td>
                            <td className="text-center py-2 px-2">
                              {hasRolePermission(workspaceRolePermissions.owner || [], permission.name) ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="text-center py-2 px-2">
                              {hasRolePermission(workspaceRolePermissions.admin || [], permission.name) ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="text-center py-2 px-2">
                              {hasRolePermission(workspaceRolePermissions.member || [], permission.name) ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            {Object.entries(permissionsByCategory)
              .filter(([category]) => category !== 'workspace')
              .map(([category, permissions]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons] || Shield;
                const label = categoryLabels[category as keyof typeof categoryLabels] || category;

                return (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <h4 className="font-medium">{label}</h4>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 pr-4 font-medium">Permission</th>
                            <th className="text-center py-2 px-2 font-medium">Admin</th>
                            <th className="text-center py-2 px-2 font-medium">Member</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permissions.map((permission) => (
                            <tr key={permission.id} className="border-b border-gray-100">
                              <td className="py-2 pr-4">
                                <div>
                                  <div className="font-medium text-sm">
                                    {permission.description || permission.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {permission.name}
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-2 px-2">
                                {hasRolePermission(projectRolePermissions.admin || [], permission.name) ? (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                              <td className="text-center py-2 px-2">
                                {hasRolePermission(projectRolePermissions.member || [], permission.name) ? (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">✓</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}