
import { mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';

// Multer
//Setting storage engine
const storageEngine = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = "/tmp/news/"
        mkdirSync(path, { recursive: true })
        callback(null, path);
    },
    filename: (req, file, callback) => {
        //callback(null, `${Date.now()}--${file.originalname}`);
        callback(null, file.originalname);
    },
});

const checkFileType = function (file: Express.Multer.File, callback:any) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg|webp/;

    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return callback(null, true);
    } else {
        callback("El tipo de archivo subido no es una Imagen valida, cambiela.!!");
    }
};

//initializing multer
const uploadImagenNews = multer({
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

export default uploadImagenNews