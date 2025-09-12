"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer
//Setting storage engine
const storageEngine = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        let path = "/tmp/news/";
        (0, fs_1.mkdirSync)(path, { recursive: true });
        callback(null, path);
    },
    filename: (req, file, callback) => {
        //callback(null, `${Date.now()}--${file.originalname}`);
        callback(null, file.originalname);
    },
});
const checkFileType = function (file, callback) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg|webp/;
    //check extension names
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return callback(null, true);
    }
    else {
        callback("El tipo de archivo subido no es una Imagen valida, cambiela.!!");
    }
};
//initializing multer
const uploadImagenNews = (0, multer_1.default)({
    storage: storageEngine,
    /* limits: {
        fileSize: 1024 * 1024 * 15 // 15 Mb porque solo recibe imagenes
    }, */
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    },
}).fields([
    {
        name: "img_url_blob",
        maxCount: 1
    },
]);
exports.default = uploadImagenNews;
