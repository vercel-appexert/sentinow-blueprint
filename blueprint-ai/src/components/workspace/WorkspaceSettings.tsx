import { useState, useEffect } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { useAuth } from '@/lib/auth-context';
import { WorkspaceMember } from '@/lib/types/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  getWorkspaceMembers,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspace,
  getWorkspaceInvitations,
  resendWorkspaceInvitation,
  deleteWorkspaceInvitation,
} from '@/lib/supabase/workspace-api';
import { WorkspaceInvitation } from '@/lib/types/workspace';
import { cn, validateBusinessEmail } from '@/lib/utils';
import { Building, Trash2, UserPlus, Mail, RefreshCw, Clock } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export function WorkspaceSettings() {
  const { currentWorkspace, refreshWorkspaces } = useWorkspace();
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('member');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; userId: string; name: string; email: string } | null>(null);
  const [resendingInvites, setResendingInvites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentWorkspace) {
      setWorkspaceName(currentWorkspace.name);
      loadMembersAndInvitations();
    }
  }, [currentWorkspace]);

  const loadMembersAndInvitations = async () => {
    if (!currentWorkspace) return;

    setIsLoading(true);
    try {
      const [members, invitations] = await Promise.all([
        getWorkspaceMembers(currentWorkspace.id),
        getWorkspaceInvitations(currentWorkspace.id)
      ]);
      setMembers(members);
      setInvitations(invitations);
    } catch (error) {
      console.error('Error loading workspace data:', error);
      toast({
        title: 'Failed to load workspace data',
        description: 'An error occurred while loading workspace members and invitations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!currentWorkspace) return;

    if (!inviteEmail.trim()) {
      toast({
        title: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    // Business email validation
    const emailValidation = validateBusinessEmail(inviteEmail.trim());
    if (!emailValidation.isValid) {
      toast({
        title: 'Invalid email address',
        description: emailValidation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsInviting(true);
    try {
      await inviteWorkspaceMember({
        email: inviteEmail.trim(),
        role: inviteRole as any,
        workspace_id: currentWorkspace.id,
      });

      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${inviteEmail}.`,
      });

      // Reset form
      setInviteEmail('');
      setInviteRole('member');
      setIsInviteDialogOpen(false);

      // Refresh members and invitations list
      await loadMembersAndInvitations();
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Failed to send invitation',
        description: 'An error occurred while sending the invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = (memberId: string, userId: string) => {
    if (!currentWorkspace) return;

    // Prevent removing yourself if you're the owner
    const currentMember = members.find(m => m.id === memberId);
    if (currentMember?.role === 'owner') {
      toast({
        title: 'Cannot remove owner',
        description: 'You cannot remove the workspace owner.',
        variant: 'destructive',
      });
      return;
    }

    // Set the member to delete and open confirmation dialog
    setMemberToDelete({
      id: memberId,
      userId: userId,
      name: currentMember?.user?.name || 'Unknown',
      email: currentMember?.user?.email || ''
    });
    setDeleteDialogOpen(true);
  };

  const handleConfirmRemoveMember = async () => {
    if (!currentWorkspace || !memberToDelete) return;

    try {
      await removeWorkspaceMember(currentWorkspace.id, memberToDelete.userId);
      toast({
        title: 'Member removed',
        description: 'The member has been removed from the workspace.',
      });
      await loadMembersAndInvitations();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Failed to remove member',
        description: 'An error occurred while removing the member.',
        variant: 'destructive',
      });
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleSaveWorkspace = async () => {
    if (!currentWorkspace) return;

    if (!workspaceName.trim()) {
      toast({
        title: 'Workspace name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateWorkspace(currentWorkspace.id, {
        name: workspaceName.trim(),
      });

      toast({
        title: 'Workspace updated',
        description: 'The workspace has been updated successfully.',
      });

      // Refresh workspaces list
      await refreshWorkspaces();
    } catch (error) {
      console.error('Error updating workspace:', error);
      toast({
        title: 'Failed to update workspace',
        description: 'An error occurred while updating the workspace.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    setResendingInvites(prev => new Set(prev).add(invitationId));
    try {
      await resendWorkspaceInvitation(invitationId);
      toast({
        title: 'Invitation resent',
        description: 'The invitation has been resent successfully.',
      });
      await loadMembersAndInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Failed to resend invitation',
        description: 'An error occurred while resending the invitation.',
        variant: 'destructive',
      });
    } finally {
      setResendingInvites(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      await deleteWorkspaceInvitation(invitationId);
      toast({
        title: 'Invitation cancelled',
        description: 'The invitation has been cancelled successfully.',
      });
      await loadMembersAndInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: 'Failed to cancel invitation',
        description: 'An error occurred while cancelling the invitation.',
        variant: 'destructive',
      });
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">
            Members
            {members.length > 0 && (
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                {members.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations
            {invitations.length > 0 && (
              <span className="ml-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Update your workspace details and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Workspace ID</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={currentWorkspace.id}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              {currentWorkspace.domain && (
                <div className="space-y-2">
                  <Label>Email Domain</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentWorkspace.domain}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveWorkspace} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workspace Members</CardTitle>
                <CardDescription>
                  Manage members of your workspace.
                </CardDescription>
              </div>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to join your workspace.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteRole}
                        onValueChange={setInviteRole}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {inviteRole === 'admin'
                          ? 'Admins can manage workspace settings and members.'
                          : inviteRole === 'member'
                            ? 'Members can create and edit test cases.'
                            : 'Reviewers can only review test cases.'}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(false)}
                      disabled={isInviting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleInviteMember} disabled={isInviting}>
                      {isInviting ? 'Inviting...' : 'Send Invitation'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <p>Loading members...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No members found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => {
                      const isCurrentUser = user?.id === member.user_id;
                      const canRemove = member.role !== 'owner' && !isCurrentUser;

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span>{member.user?.name || 'Unknown'}</span>
                                {isCurrentUser && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {member.user?.email || ''}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{member.role}</span>
                          </TableCell>
                          <TableCell>
                            {member.invitation_accepted && member.user?.email_confirmed_at ? (
                              <span className="text-green-500">Active</span>
                            ) : (
                              <span className="text-amber-500">Pending Invite</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(member.id, member.user_id)}
                              disabled={!canRemove}
                              title={
                                member.role === 'owner'
                                  ? 'Cannot remove workspace owner'
                                  : isCurrentUser
                                    ? 'Cannot remove yourself'
                                    : 'Remove member'
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Pending Invitations
              </CardTitle>
              <CardDescription>
                Manage pending workspace invitations. You can resend or cancel invitations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <p>Loading invitations...</p>
                </div>
              ) : invitations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending invitations</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All workspace invitations have been accepted or expired
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => {
                      const isExpired = new Date(invitation.expires_at) < new Date();
                      const isResending = resendingInvites.has(invitation.id);

                      return (
                        <TableRow key={invitation.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{invitation.email}</span>
                              {isExpired && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Expired
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{invitation.role}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(invitation.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-sm",
                              isExpired ? "text-red-500" : "text-muted-foreground"
                            )}>
                              {new Date(invitation.expires_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleResendInvitation(invitation.id)}
                                disabled={isResending}
                                title="Resend invitation"
                              >
                                <RefreshCw className={cn(
                                  "h-4 w-4",
                                  isResending && "animate-spin"
                                )} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteInvitation(invitation.id)}
                                title="Cancel invitation"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Member Removal */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove Member"
        description={
          memberToDelete ? (
            <>
              Are you sure you want to remove <strong>{memberToDelete.name}</strong> ({memberToDelete.email}) from this workspace?
              <br />
              <br />
              They will lose access to all projects and data in this workspace.
            </>
          ) : (
            'Are you sure you want to remove this member from the workspace?'
          )
        }
        confirmLabel="Remove Member"
        variant="destructive"
        onConfirm={handleConfirmRemoveMember}
      />
    </div>
  );
}