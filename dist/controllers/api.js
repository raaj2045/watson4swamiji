'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("multer");
var stream = require("stream");
var util_1 = require("../util");
var upload = multer({ storage: multer.memoryStorage() });
var uploadAudio = upload.single('audio');
exports.uploadAudio = uploadAudio;
function postTranscribe(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var bufferStream, type, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bufferStream = new stream.PassThrough();
                    bufferStream.end(req.file.buffer);
                    type = req.file.originalname.split('.').pop();
                    return [4, req.watsonSTT.transcribe(req.file.buffer, type, req.file.originalname, req.body.languageModel, req.body.acousticModel)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("recognize call failed: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].code || 'failed to translate the file'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({ tid: result[1] })];
                    }
                    return [2];
            }
        });
    });
}
exports.postTranscribe = postTranscribe;
function getModel(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.getLanguageModel()];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("can not get model: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'can not get model info'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                data: result[1]
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.getModel = getModel;
function getAcousticModel(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.getAcousticModel()];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("can not get acosutic model: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'can not get acoustic model info'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                data: result[1]
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.getAcousticModel = getAcousticModel;
function postAudio(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var bufferStream, type, contentType, params, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bufferStream = new stream.PassThrough();
                    bufferStream.end(req.file.buffer);
                    type = req.file.originalname.split('.').pop();
                    if (type === 'zip') {
                        contentType = 'application/zip';
                    }
                    else if (['tgz', 'gz'].indexOf(type) >= 0) {
                        contentType = 'application/gzip';
                    }
                    else {
                        contentType = 'audio/' + type;
                    }
                    params = {
                        customization_id: req.watsonSTT.acousticModelId,
                        content_type: contentType,
                        audio_resource: bufferStream,
                        audio_name: req.body.audioName
                    };
                    return [4, req.watsonSTT.addAudio(params)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to add/update audio: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to add/update audio'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                status: 'added'
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.postAudio = postAudio;
function listAudio(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var audioResources;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.listAudio()];
                case 1:
                    audioResources = _a.sent();
                    if (audioResources[0]) {
                        req.log.error("failed to list audio: " + JSON.stringify(audioResources[0], null, 2));
                        return [2, res.status(500).json({
                                error: audioResources[0].error || 'failed to list audio'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                audio: audioResources[1].audio
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.listAudio = listAudio;
function deleteAudio(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.name) return [3, 2];
                    return [4, req.watsonSTT.deleteAudio(req.params.name)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to delete audio: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to delete audio'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                audioName: result[1],
                                status: 'deleted'
                            })];
                    }
                    return [3, 3];
                case 2: return [2, res.status(400).json({
                        error: 'No audio name specified.'
                    })];
                case 3: return [2];
            }
        });
    });
}
exports.deleteAudio = deleteAudio;
function postCorpus(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.addCorpus(req.body.corpusName, req.body.corpus)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to add/update corpus: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to add/update corpus'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                status: 'added'
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.postCorpus = postCorpus;
function deleteCorpus(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.name) return [3, 2];
                    return [4, req.watsonSTT.deleteCorpus(req.params.name)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to delete corpus: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to delete corpus'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                corpusName: result[1],
                                status: 'deleted'
                            })];
                    }
                    return [3, 3];
                case 2: return [2, res.status(400).json({
                        error: 'No corpus name specified.'
                    })];
                case 3: return [2];
            }
        });
    });
}
exports.deleteCorpus = deleteCorpus;
function getCorpora(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var corpora;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.getCorpora()];
                case 1:
                    corpora = _a.sent();
                    if (corpora[0]) {
                        req.log.error("failed to get corpora: " + JSON.stringify(corpora[0], null, 2));
                        return [2, res.status(500).json({
                                error: corpora[0].error || 'failed to get corpora'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                corpora: corpora[1].corpora
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.getCorpora = getCorpora;
function getWords(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var words;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.listWords()];
                case 1:
                    words = _a.sent();
                    if (words[0]) {
                        req.log.error("failed to get words: " + JSON.stringify(words[0], null, 2));
                        return [2, res.status(500).json({
                                error: words[0].error || 'failed to get words'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                words: words[1].words
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.getWords = getWords;
function addWord(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.addWord(req.body.word, req.body.sounds_like, req.body.display_as)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to add word: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to add the specified word'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                word: req.body.word,
                                status: 'added'
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.addWord = addWord;
function deleteWord(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.name) return [3, 2];
                    return [4, req.watsonSTT.deleteWord(req.params.name)];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to delete word: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to delete the specified word'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                word: req.params.name,
                                status: 'deleted'
                            })];
                    }
                    return [3, 3];
                case 2: return [2, res.status(400).json({
                        error: 'No word name specified.'
                    })];
                case 3: return [2];
            }
        });
    });
}
exports.deleteWord = deleteWord;
function trainModel(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.trainModel()];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to train the model: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to train the model'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                status: 'started'
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.trainModel = trainModel;
function trainAcousticModel(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, req.watsonSTT.trainAcousticModel()];
                case 1:
                    result = _a.sent();
                    if (result[0]) {
                        req.log.error("failed to train acoustic model: " + JSON.stringify(result[0], null, 2));
                        return [2, res.status(500).json({
                                error: result[0].error || 'failed to train acoustic model'
                            })];
                    }
                    else {
                        return [2, res.status(200).json({
                                status: 'started'
                            })];
                    }
                    return [2];
            }
        });
    });
}
exports.trainAcousticModel = trainAcousticModel;
function checkWatsonCredential(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var watsonSTT;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, util_1.WatsonSTT.getInstance(req)];
                case 1:
                    watsonSTT = _a.sent();
                    if (watsonSTT === undefined) {
                        req.log.error('Can not connect to Watson service');
                        next({
                            error: 'Can not connect to Watson service, please check server logs'
                        });
                    }
                    req.watsonSTT = watsonSTT;
                    next();
                    return [2];
            }
        });
    });
}
exports.checkWatsonCredential = checkWatsonCredential;
//# sourceMappingURL=api.js.map