# Fix permissions system for project creation

## Problem
- ProjectSwitcher component was using old role-based access control instead of new permissions system
- Database RLS policy only allowed admin/owner roles, ignoring custom permissions
- No real-time updates when permissions were revoked by admins
- Users could still see "Create Project" option after permission revocation due to frontend caching

## Solution
1. **Updated ProjectSwitcher Component**
   - Replaced `useRoleAccess` with `usePermissions` hook
   - Updated permission checks to use `projects.create` permission
   - Updated UI messages to be more generic

2. **Updated Database RLS Policy**
   - Replaced restrictive role-based policy with permission-based policy
   - New policy checks both custom user permissions and role-based permissions
   - Applied migration: `update_project_creation_policy_for_permissions`

3. **Added Real-time Permission Updates**
   - Added Supabase real-time subscription to `usePermissions` hook
   - Automatically refreshes permissions when `user_permissions` table changes
   - Prevents frontend caching issues

## Testing
- Verified permission revocation works correctly at database level
- Confirmed RLS policy blocks unauthorized project creation
- Real-time subscription updates permissions automatically
- Member users with `projects.create` permission can create projects
- Member users without permission cannot create projects

## Files Changed
- `src/components/workspace/ProjectSwitcher.tsx`
- `src/hooks/use-permissions.ts`
- Database migration for RLS policy update