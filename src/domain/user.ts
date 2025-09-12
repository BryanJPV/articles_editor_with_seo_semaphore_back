export class User {
    id: number;
    username: string;
    usermail: string;
    password: string;
    remember_token: string;
    expiration: Date;
    created_at: Date;
    updated_at: Date;
    //rol_id: number;

    constructor () {
        this.id = 0;
        this.username = "";
        this.usermail = "";
        this.password = "";
        this.remember_token = "";
        this.expiration = new Date();
        this.created_at = new Date();
        this.updated_at = new Date();
        //this.rol_id = 0;
    }
}

export interface UserRepository {
    login(credentials: any[]) : Promise<any | string | null>;
    checkTokenExpiration(remember_token: string) : Promise<boolean | null>;
    changeUserPassword(old_password: string, new_password: string, remember_token: string) : Promise<boolean | null>;
    getUserData(remember_token: string) : Promise<string | null>;
}

export interface UserUsecase {
    login(credentials: any[]) : Promise<any | string | null>;
    checkTokenExpiration(remember_token: string) : Promise<boolean | null>;
    changeUserPassword(old_password: string, new_password: string, remember_token: string) : Promise<boolean | null>;
    getUserData(remember_token: string) : Promise<string | null>;
}