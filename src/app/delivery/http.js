"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAPI = void 0;
const https = __importStar(require("https"));
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
class HttpAPI {
    constructor(port, credentials = null) {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.raw());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use((0, cors_1.default)({ origin: '*' }));
        // STTAIC FOLDER FOR MAIN APP
        app.use(express_1.default.static('public'));
        //app.use('/storage/img', express.static('public/podcasts/img'))
        //app.use('/storage/audio', express.static('public/podcast_episodes/audio'))
        this.app = app;
        this.port = port;
        this.credentials = credentials;
    }
    addAdminHandler(handler) {
        let apiSubRouter = (0, express_1.Router)({ mergeParams: true });
        handler.init(apiSubRouter);
        this.app.use('/api/admin', apiSubRouter);
    }
    addHandler(handler) {
        let apiSubRouter = (0, express_1.Router)({ mergeParams: true });
        handler.init(apiSubRouter);
        this.app.use('/api', apiSubRouter);
    }
    getExpressInstance() {
        return this.app;
    }
    run() {
        if (this.credentials != null) {
            https.createServer(this.credentials, this.app).listen(this.port, () => {
                console.log(`App de prueba escuchando por el puerto: ${this.port}`);
            });
            return;
        }
        this.app.listen(this.port, () => {
            console.log(`App de prueba escuchando por el puerto: ${this.port}`);
        });
    }
}
exports.HttpAPI = HttpAPI;
