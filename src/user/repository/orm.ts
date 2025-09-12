import { User, UserRepository } from "../../domain/user"
import { DataSource, Entity, PrimaryGeneratedColumn, Column, Repository, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"

import { MD5 } from "crypto-js"

@Entity("users")
export class UserORM {
    @PrimaryGeneratedColumn({ unsigned: true })
    declare id: number

    @Column({ type: "varchar", length: 150, nullable: false })
    declare username: string

    @Column({ type: "varchar", length: 150, nullable: false })
    declare usermail: string
    @Column({ type: "text", nullable: false })
    declare password: string

    @Column({ type: "text", nullable: true })
    declare remember_token: string

    @Column({ type: 'datetime', nullable: true })
    declare expiration: Date;

    @CreateDateColumn()
    declare createdAt: Date
    @UpdateDateColumn()
    declare updatedAt: Date

    toUser() : User {
        let user = new User();

        user.id = this.id;
        user.username = this.username;
        user.usermail = this.usermail;
        user.password = this.password;
        user.remember_token = this.remember_token;
        user.expiration = this.expiration;

        user.created_at = this.createdAt;//.toDateString();
        user.updated_at = this.updatedAt;//.toDateString();

        return user;
    }

    fromUser(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.usermail = user.usermail;
        this.password = user.password;
        this.remember_token = user.remember_token;
        this.expiration = user.expiration
        return this;
    }
}

export class ORMUserRepository implements UserRepository{
    dataSource: DataSource;
    userRepoORM: Repository<UserORM>;

    constructor (dataSource: DataSource) {
        this.dataSource = dataSource;
        this.userRepoORM = this.dataSource.getRepository(UserORM);
    }
    async login(credentials: any) : Promise<any | string | null>{
        const userModel = await this.userRepoORM.findOne({ 
            where: {
                usermail: credentials.usermail,
                password: MD5(credentials.password).toString(),
            }
        });
        if (userModel === null) {
            console.log('Not found!');
            return null;
        }
        
        let user_id:number | undefined = userModel?.toUser().id;
        
        // Geración Token
        let remember_token:string = MD5(user_id.toString() + Date.now().toString()).toString();
        // Geración fecha expiración agregandole 1 hora a la fecha de expiración
        let expiration = new Date();
        expiration.setTime(expiration.getTime() + (4 * 60 * 60 * 1000) );
        
        await this.userRepoORM.update(
            { // WHERE
                id: user_id
            },
            {   // SET
                remember_token: remember_token,
                expiration: expiration
            }
        )
        
        return remember_token
    }
    async checkTokenExpiration(remember_token: string) : Promise<boolean | null>{
        const userModel = await this.userRepoORM.findOne({ 
            where: {
                remember_token: remember_token,
            }
        });
        if (userModel === null) {
            console.log('Not found!');
            return null;
        }

        let dateNow:Date = new Date();
        if(userModel.expiration < dateNow){
            return true
        }
        return false;
    }
    
    async changeUserPassword(old_password: string, new_password: string, remember_token: string) : Promise<boolean | null>{
        const userModel = await this.userRepoORM.findOne({ 
            where: {
                remember_token: remember_token,
                password: MD5(old_password).toString(),
            }
        });
        if (userModel === null) {
            console.log('Not found!');
            return null;
        }

        let user_id:number | undefined = userModel?.toUser().id;

        await this.userRepoORM.update(
            { // WHERE
                id: user_id
            },
            {   // SET
                password: MD5(new_password).toString(),
            }
        )
        return true
    }
    
    async getUserData(remember_token: string) : Promise<string | null>{
        const userModel = await this.userRepoORM.findOne({ 
            where: {
                remember_token: remember_token,
            }
        });
        if (userModel === null) {
            console.log('Not found!');
            return null;
        }

        return userModel?.toUser().username
    }
}
