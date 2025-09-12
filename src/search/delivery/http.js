"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHandler = void 0;
const express_1 = require("express");
const schemaValidateSearch_1 = __importDefault(require("./joi_validator/schemaValidateSearch"));
class SearchHandler {
    constructor(searchUC) {
        this.searchUC = searchUC;
    }
    init(apiInstance) {
        let subRouter = (0, express_1.Router)({ mergeParams: true });
        subRouter.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () { return this.search(req, res); }));
        //subRouter.get('/sort_words', async (req, res) => this.sort_words(req,res));
        apiInstance.use('/search', subRouter);
    }
    /* async sort_words (req: Request, res: Response) {
        let search_res = await this.searchUC.sort_words();
        res.json({ data: search_res });
    } */
    search(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                search_string: req.body.search_string,
            };
            //console.log(payload);
            let array_errors_schema_validator = [];
            try {
                const value = yield schemaValidateSearch_1.default.validateAsync(payload, { abortEarly: false });
            }
            catch (error) {
                //console.log(error.details);
                error.details.forEach((error_detail) => {
                    array_errors_schema_validator.push(error_detail.message);
                });
                res.status(400);
                res.json({ error: array_errors_schema_validator });
                return;
            }
            /* let array_labels_aux:string[] = [];
            if(req.body.array_labels != null && req.body.array_labels != undefined) {
                req.body.array_labels.forEach((label:any) => {
                    array_labels_aux.push(label)
                });
            } */
            let search_res = null;
            try {
                search_res = yield this.searchUC.search(req.body.search_string /* , array_labels_aux */);
                if (search_res == null) {
                    res.status(400);
                    res.json({ error: ["No se pudo realizar el proceso de busqueda, intente de nuevo."] });
                    return;
                }
            }
            catch (error) {
                console.log(error);
                res.status(400);
                // Si se verifica un error en los métodos de la capa de crud, sus mensajes de los throw en sus respectivos catch
                // retornaran en este catch en error.message, de no ser así se enviará un mensaje generico de error.
                res.json({ error: [(_a = error.message) !== null && _a !== void 0 ? _a : "No se pudo realizar el proceso de busqueda, intente de nuevo."] });
                return;
            }
            res.json(search_res);
        });
    }
}
exports.SearchHandler = SearchHandler;
