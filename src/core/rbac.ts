/**
 * TRACE-X Frontend Role-Based Access Control (Phase F Alignment)
 * UX Only: Enables or hides UI actions. Real security enforcement remains in FastAPI JWT scoping.
 */

import { useAuth } from '../app/AuthContext';

export type UserRole = 'investigator' | 'supervisor' | 'admin' | string;

export interface RbacPermissions {
  canViewCase: boolean;
  canEditCase: boolean;
  canCreateCase: boolean;
  canApproveDataRequest: boolean;
  canShareRecords: boolean;
  canViewAuditLog: boolean;
  canAdminUsers: boolean;
}

export function getPermissionsForRoles(roles: string[] = []): RbacPermissions {
  const isSupervisor = roles.includes('supervisor') || roles.includes('station-supervisor');
  const isAdmin = roles.includes('admin') || roles.includes('station-admin');
  const isInvestigator = roles.includes('investigator') || roles.includes('local-authority') || roles.length === 0;

  return {
    canViewCase: true, // All station personnel can read assigned cases
    canEditCase: isInvestigator || isSupervisor,
    canCreateCase: isInvestigator || isSupervisor,
    canApproveDataRequest: isSupervisor, // Only supervisors can sign off interagency disclosures
    canShareRecords: isSupervisor, // Only supervisors can authorize cryptographic sharing
    canViewAuditLog: isSupervisor || isAdmin, // Audit trail inspection restricted to supervisor/admin
    canAdminUsers: isAdmin,
  };
}

export function useRbac(): RbacPermissions & { userRoles: string[]; isSupervisor: boolean; isAdmin: boolean } {
  const { user } = useAuth();
  const userRoles = user?.roles || ['investigator'];
  const permissions = getPermissionsForRoles(userRoles);

  return {
    ...permissions,
    userRoles,
    isSupervisor: userRoles.includes('supervisor') || userRoles.includes('station-supervisor'),
    isAdmin: userRoles.includes('admin') || userRoles.includes('station-admin'),
  };
}
