import { ConflictError } from "../../utils/errors";
import logger from "../../utils/logger";
import { UserRepository } from "./user.repository";

export class UserService {
    constructor(private userRepo = new UserRepository()) {}

    async requestOrganizerRole(userId: string) {
        const exists = await this.userRepo.checkRoleRequest(userId);
        
        if(exists) throw new ConflictError("You are already requesting an organizer role, please wait until it is approved", { userId, data: exists });

        const roleRequest = await this.userRepo.requestOrganizerRole(userId);
        logger.app.info({ data: roleRequest }, `Role request created by ${userId}`);

        return roleRequest;
    }
}