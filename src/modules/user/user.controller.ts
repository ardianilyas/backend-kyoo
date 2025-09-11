import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
    constructor() {
        this.requestOrganizerRole = this.requestOrganizerRole.bind(this);
    }

    async requestOrganizerRole(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id!;
            const roleRequest = await service.requestOrganizerRole(userId);
            return res.status(200).json({ message: "Role requested successfully", roleRequest });
        } catch (error) {
            next(error);
        }
    }
}