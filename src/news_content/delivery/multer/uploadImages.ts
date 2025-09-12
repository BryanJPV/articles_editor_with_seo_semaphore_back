import { mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';

// Multer
//Setting storage engine
const storageEngine = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = "/tmp/news_content/"
        mkdirSync(path, { recursive: true })
        callback(null, path);
    },
    filename: (req, file, callback) => {
        //cb(null, `${Date.now()}--${file.originalname}`);
        callback(null, file.originalname);
    },
});

const checkFileType = function (file: Express.Multer.File, callback:any) {
    // Validation IMGs
    if (file.fieldname === "img_url_blob") {
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
    }
    // Validation VIDEO
    if (file.fieldname === "video_url_blob") {
        //Allowed file extensions
        const fileTypes = /avi|mp4|mpeg|webm/;
        const fileMimes = /video\/x-msvideo|video\/mp4|video\/mpeg|video\/webm/;

        //check extension names
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileMimes.test(file.mimetype);
        
        if (mimeType && extName) {
            return callback(null, true);
        } else {
            callback("El tipo de archivo subido no es un Video valido, cambielo.!!");
        }
    }
    // Validation AUDIO
    if (file.fieldname === "audio_url_blob") {
        //Allowed file extensions
	const fileTypes = /mp3|aac|wav|weba|oga|opus|mp4|m4a/;
        const fileMimes = /audio\/mpeg|audio\/aac|audio\/wav|audio\/webm|audio\/ogg|audio\/opus|video\/mp4|audio\/x-m4a/;

        //check extension names
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileMimes.test(file.mimetype);
        
        if (mimeType && extName) {
            return callback(null, true);
        } else {
            callback("El tipo de archivo subido no es una Audio valido, cambielo.!!");
        }
    }
};

//initializing multer
const uploadImagenAudioVideoNewsContent = multer({
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

export default uploadImagenAudioVideoNewsContent
