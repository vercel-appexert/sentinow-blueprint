import { useState } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { Project } from '@/lib/types/workspace';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createProject } from '@/lib/supabase/workspace-api';
import { usePermissions } from '@/hooks/use-permissions';
import { ChevronDown, FolderKanban, Plus, Shield } from 'lucide-react';

export function ProjectSwitcher() {
  const { currentWorkspace, currentProject, projects, setCurrentProject, refreshProjects } = useWorkspace();
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const canCreateProjects = hasPermission('projects.create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectKey, setNewProjectKey] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (!currentWorkspace) {
      toast({
        title: 'No workspace selected',
        description: 'Please select a workspace first.',
        variant: 'destructive',
      });
      return;
    }

    // Check create project permissions
    if (!canCreateProjects) {
      toast({
        title: 'Permission denied',
        description: 'You do not have permission to create projects.',
        variant: 'destructive',
      });
      return;
    }

    if (!newProjectName.trim()) {
      toast({
        title: 'Project name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!newProjectKey.trim()) {
      toast({
        title: 'Project key is required',
        description: 'The key is used for test case IDs (e.g., WEB-123).',
        variant: 'destructive',
      });
      return;
    }

    // Validate project key format (alphanumeric, no spaces)
    if (!/^[A-Za-z0-9]+$/.test(newProjectKey)) {
      toast({
        title: 'Invalid project key',
        description: 'Project key must contain only letters and numbers.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      await createProject({
        name: newProjectName.trim(),
        key: newProjectKey.trim().toUpperCase(),
        description: newProjectDescription.trim() || undefined,
        workspace_id: currentWorkspace.id,
      });

      toast({
        title: 'Project created',
        description: `${newProjectName} project has been created successfully.`,
      });

      // Reset form
      setNewProjectName('');
      setNewProjectKey('');
      setNewProjectDescription('');
      setIsDialogOpen(false);

      // Refresh projects list
      await refreshProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Failed to create project',
        description: 'An error occurred while creating the project.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
  };

  // Generate project key as user types project name
  const handleProjectNameChange = (value: string) => {
    setNewProjectName(value);

    // Only auto-generate key if user hasn't manually entered one
    if (!newProjectKey) {
      // Generate key from first letters of each word, uppercase
      const key = value
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 5); // Limit to 5 characters

      setNewProjectKey(key);
    }
  };

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="flex items-center gap-2 w-full justify-between bg-primary text-primary-foreground hover:bg-primary/90">
            <div className="flex items-center gap-2 truncate">
              <FolderKanban className="h-4 w-4" />
              <span className="truncate font-medium">{currentProject?.name || 'Select Project'}</span>
              {currentProject?.key && (
                <span className="text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded-sm">{currentProject.key}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects.length > 0 ? (
            projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className={currentProject?.id === project.id ? 'bg-accent' : ''}
              >
                <div className="flex items-center gap-2 w-full truncate">
                  <FolderKanban className="h-4 w-4" />
                  <span className="truncate">{project.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{project.key}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No projects found</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {canCreateProjects ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2 w-full">
                    <Plus className="h-4 w-4" />
                    <span>Create Project</span>
                    <Shield className="h-3 w-3 ml-auto text-amber-500" />
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Create New Project
                    <Shield className="h-4 w-4 text-amber-500" />
                  </DialogTitle>
                  <DialogDescription>
                    Create a new project in the {currentWorkspace.name} workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter project name"
                      value={newProjectName}
                      onChange={(e) => handleProjectNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">
                      Project Key
                    </Label>
                    <Input
                      id="key"
                      placeholder="KEY"
                      value={newProjectKey}
                      onChange={(e) => setNewProjectKey(e.target.value.toUpperCase())}
                      maxLength={10}
                    />
                    <p className="text-sm text-muted-foreground">
                      Used for test case IDs (e.g., {newProjectKey || 'KEY'}-123)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter project description"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Project'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    <div className="flex items-center gap-2 w-full">
                      <Plus className="h-4 w-4" />
                      <span>Create Project</span>
                      <Shield className="h-3 w-3 ml-auto text-amber-500" />
                    </div>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You do not have permission to create projects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
