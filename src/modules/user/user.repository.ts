import prisma from "../../config/prisma";
import { checkRole } from '../../middlewares/checkRole';

export class UserRepository {
    async checkRoleRequest(userId: string) {
        return prisma.roleRequest.findUnique({ where: { userId } });
    }

    async requestOrganizerRole(userId: string) {
        return prisma.roleRequest.create({ data: { userId, role: "ORGANIZER" } });
    }
}