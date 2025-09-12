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
        let path = "/tmp/news_content/";
        (0, fs_1.mkdirSync)(path, { recursive: true });
        callback(null, path);
    },
    filename: (req, file, callback) => {
        //cb(null, `${Date.now()}--${file.originalname}`);
        callback(null, file.originalname);
    },
});
const checkFileType = function (file, callback) {
    // Validation IMGs
    if (file.fieldname === "img_url_blob") {
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
    }
    // Validation VIDEO
    if (file.fieldname === "video_url_blob") {
        //Allowed file extensions
        const fileTypes = /avi|mp4|mpeg|webm/;
        const fileMimes = /video\/x-msvideo|video\/mp4|video\/mpeg|video\/webm/;
        //check extension names
        const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = fileMimes.test(file.mimetype);
        if (mimeType && extName) {
            return callback(null, true);
        }
        else {
            callback("El tipo de archivo subido no es un Video valido, cambielo.!!");
        }
    }
    // Validation AUDIO
    if (file.fieldname === "audio_url_blob") {
        //Allowed file extensions
        const fileTypes = /mp3|aac|wav|weba|oga|opus|mp4|m4a/;
        const fileMimes = /audio\/mpeg|audio\/aac|audio\/wav|audio\/webm|audio\/ogg|audio\/opus|video\/mp4|audio\/x-m4a/;
        //check extension names
        const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = fileMimes.test(file.mimetype);
        if (mimeType && extName) {
            return callback(null, true);
        }
        else {
            callback("El tipo de archivo subido no es una Audio valido, cambielo.!!");
        }
    }
};
//initializing multer
const uploadImagenAudioVideoNewsContent = (0, multer_1.default)({
    storage: storageEngine,
    /* limits: {
        fileSize: 1024 * 1024 * 20 // 20 Mb porque recibe de los 3 tipos de archivos, y el peso max de video es 20 Mb
    }, */
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    },
}).fields([
    {
        name: "img_url_blob",
        maxCount: 1
    },
    {
        name: "video_url_blob",
        maxCount: 1
    },
    {
        name: "audio_url_blob",
        maxCount: 1
    },
]);
exports.default = uploadImagenAudioVideoNewsContent;
