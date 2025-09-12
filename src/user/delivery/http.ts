import { Express, Router, Request, Response } from "express"
import { UserUsecase } from "../../domain/user"

import { MD5 } from "crypto-js"

import schemaValidateLoginCredentials from "./joi_validator/schemaValidateLoginCredentials"
import schemaValidateChangePassword from "./joi_validator/schemaValidateChangePassword"

export class UserHandler {
    userUC: UserUsecase;

    constructor(userUC: UserUsecase) {
        this.userUC = userUC;
    }

    init(apiInstance: Express) {
        let subRouter = Router({mergeParams: true});

        subRouter.post('/login', async (req, res) => this.login(req,res));
        subRouter.post('/check_token_expiration', async (req, res) => this.checkTokenExpiration(req,res));
        subRouter.post('/change_user_password', async (req, res) => this.changeUserPassword(req,res));
        subRouter.get('/get_user_data', async (req, res) => this.getUserData(req,res));
        //subRouter.post('/register', async (req, res) => this.register(req,res));

        apiInstance.use('/user', subRouter)
    }

    async checkTokenExpiration (req: Request, res: Response) {
        let expiration_res_token:boolean | null = null;
        try {
            expiration_res_token = await this.userUC.checkTokenExpiration(req.body.remember_token);

            if (expiration_res_token == null) {
                res.status(400)
                res.json( { error : ["No se pudo verificar el Token o el Token enviado no existe."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo verificar la Expiración del Token, intente de nuevo." ] }); 
            return;
        }

        res.json({ message: "Verificación exitosa.", data: expiration_res_token });
    }

    async login (req: Request, res: Response) {
        const payload:any = {
            usermail: req.body.usermail,
            password: req.body.password,
        };

        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateLoginCredentials.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }

        let login_res_token:any[] | null = null;
        try {
            login_res_token =  await this.userUC.login(payload);

            if (login_res_token == null) {
                res.status(400)
                res.json( { error : ["No se pudo logear, credenciales erroneas."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo logear o credenciales erroneas, intente de nuevo." ] }); 
            return;
        }

        res.json({ message: "Login exitoso.", data: login_res_token });
    }

    async changeUserPassword (req: Request, res: Response) {
        let expiration_res_token:boolean | null = null;
        try {
            expiration_res_token = await this.userUC.checkTokenExpiration(req.body.remember_token);

            if (expiration_res_token == null) {
                res.status(400)
                res.json( { error : ["No se pudo verificar el Token o el Token enviado no existe."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo verificar la Expiración del Token, intente de nuevo." ] }); 
            return;
        }
        let old_password:string = (typeof req.body.old_password !== "string") ? req.body.old_password.toString() : req.body.old_password;
        let new_password:string = (typeof req.body.new_password !== "string") ? req.body.new_password.toString() : req.body.new_password;

        const payload:any = {
            old_password: old_password,
            new_password: new_password,
        };

        let array_errors_schema_validator:string[] = [];
        try {
            const value = await schemaValidateChangePassword.validateAsync(payload, { abortEarly: false });
        } catch (error:Error | any) {
            //console.log(error.details);
            error.details.forEach((error_detail:any) => {
                array_errors_schema_validator.push(error_detail.message)
            });
            res.status(400)
            res.json({error: array_errors_schema_validator! }); 
            return;
        }

        let change_password_res:boolean | null = null;
        try {
            change_password_res =  await this.userUC.changeUserPassword(req.body.old_password, req.body.new_password, req.body.remember_token);

            if (change_password_res == null) {
                res.status(400)
                res.json( { error : ["No se pudo cambiar la Contraseña Actual, la contraseña Anterior es incorrecta."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo cambiar la Contraseña Actual, intente de nuevo." ] }); 
            return;
        }

        res.json({ message: "Cambio de Contraseña exitoso.", data: change_password_res });
    }

    async getUserData (req: Request, res: Response) {
        let user_data_res:string | null = null;
        try {
            user_data_res = await this.userUC.getUserData(req.body.remember_token);

            if (user_data_res == null) {
                res.status(400)
                res.json( { error : ["No se pudo consultar los datos del Usuario."] } )
                return
            }
        } catch (error:Error | any) {
            console.log(error);
            res.status(400)
            // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
            // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
            res.json({ error: [ error.message ?? "No se pudo consultar los datos del Usuario, intente de nuevo." ] }); 
            return;
        }

        res.json({ message: "Consulta exitosa.", data: user_data_res });
    }

    /* async register (req: Request, res: Response) {
        console.log(MD5("12345").toString());

        res.json({ message: "Registro exitoso." });
    } */
}