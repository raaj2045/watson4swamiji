'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var apiController = require("../controllers/api");
var userController = require("../controllers/user");
var Api = (function () {
    function Api() {
        this.router = express_1.Router();
        this.init();
    }
    Api.prototype.init = function () {
        this.router.get('/model', apiController.checkWatsonCredential, apiController.getModel);
        this.router.post('/transcribe', apiController.checkWatsonCredential, apiController.uploadAudio, apiController.postTranscribe);
        this.router.post('/train', apiController.checkWatsonCredential, apiController.trainModel);
        this.router.post('/train-acoustic', apiController.checkWatsonCredential, apiController.trainAcousticModel);
        this.router.get('/acoustic-model', apiController.checkWatsonCredential, apiController.getAcousticModel);
        this.router.get('/audio', apiController.checkWatsonCredential, apiController.listAudio);
        this.router.delete('/audio/:name', apiController.checkWatsonCredential, apiController.deleteAudio);
        this.router.post('/audio', apiController.checkWatsonCredential, apiController.uploadAudio, apiController.postAudio);
        this.router.get('/corpora', apiController.checkWatsonCredential, apiController.getCorpora);
        this.router.delete('/corpora/:name', apiController.checkWatsonCredential, apiController.deleteCorpus);
        this.router.post('/corpora', apiController.checkWatsonCredential, apiController.postCorpus);
        this.router.get('/words', apiController.checkWatsonCredential, apiController.getWords);
        this.router.post('/words', apiController.checkWatsonCredential, apiController.addWord);
        this.router.delete('/words/:name', apiController.checkWatsonCredential, apiController.deleteWord);
        this.router.post('/login', userController.postLogin);
        this.router.post('/logout', userController.postLogout);
        this.router.get('/user', userController.getUser);
    };
    return Api;
}());
exports.router = (new Api()).router;
//# sourceMappingURL=api.js.map