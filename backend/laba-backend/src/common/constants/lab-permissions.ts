import { LabRole } from '../../../generated/prisma/client.js';

/**
 * Кто кого имеет право приглашать/блокировать/менять роль/увольнять
 * в рамках лабы. OWNER не входит ни в один список — владельца нельзя
 * администрировать через эти операции ни с чьей стороны, включая
 * другого OWNER (несколько OWNER-строк на лабу — теоретически
 * возможны, но не управляют друг другом).
 */
export const MANAGE_PERMISSIONS: Record<LabRole, LabRole[]> = {
  OWNER: ['ADMIN', 'TECHNICIAN'],
  ADMIN: ['TECHNICIAN'],
  TECHNICIAN: [],
};

export function canManageRole(actorRole: LabRole | undefined, targetRole: LabRole): boolean {
  return !!actorRole && MANAGE_PERMISSIONS[actorRole].includes(targetRole);
}
