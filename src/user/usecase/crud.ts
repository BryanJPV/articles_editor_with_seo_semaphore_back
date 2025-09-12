import { UserRepository, UserUsecase } from "../../domain/user";

export class UserCRUDUC implements UserUsecase {
    userRepo : UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    async login(credentials: any) : Promise<any | string | null> {
        return await this.userRepo.login(credentials)
    }

    async checkTokenExpiration(remember_token: string) : Promise<boolean | null>{
        return await this.userRepo.checkTokenExpiration(remember_token)
    }

    async changeUserPassword(old_password: string, new_password: string, remember_token: string) : Promise<boolean | null>{
        return await this.userRepo.changeUserPassword(old_password, new_password, remember_token)
    }

    async getUserData(remember_token: string) : Promise<string | null>{
        return await this.userRepo.getUserData(remember_token)
    }
}