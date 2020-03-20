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
var cfenv = require("cfenv");
var fs = require("fs");
var path = require("path");
var SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
function getCfenv() {
    var cfenvOpt = {};
    var serviceName = process.env.STT_SERVICE_NAME ||
        'code-pattern-custom-language-model';
    var service = cfenv.getAppEnv(cfenvOpt).getService(serviceName);
    var servicesFile = path.join(__dirname, '..', 'services.json');
    if (!service && fs.existsSync(servicesFile)) {
        var creds = require(servicesFile);
        return creds.services[serviceName][0];
    }
    else {
        return service;
    }
}
exports.getCfenv = getCfenv;
var WatsonSTT = (function () {
    function WatsonSTT(speech, username, langModelName, langModelId, acousticModelName, acousticModelId, baseModel, speechModels) {
        this.speech = speech;
        this.username = username;
        this.langModelName = langModelName;
        this.langModelId = langModelId;
        this.acousticModelName = acousticModelName;
        this.acousticModelId = acousticModelId;
        this.baseModel = baseModel;
        this.speechModels = speechModels;
    }
    WatsonSTT.getInstance = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var rev, speech, langModelId, speechModels, acousticModelId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rev = req.user._watsonSTT;
                        if (rev && rev instanceof WatsonSTT) {
                            return [2, Promise.resolve(rev)];
                        }
                        if (!req.app.get('stt_service') ||
                            !req.app.get('stt_service').credentials) {
                            req.log.error('Can not get credentials for Watson service');
                            return [2, Promise.resolve(undefined)];
                        }
                        speech = getSTTV1(req.app.get('stt_service').credentials);
                        return [4, getCustomLangModelId(speech, req.user)];
                    case 1:
                        langModelId = _a.sent();
                        return [4, getBaseModels(speech)];
                    case 2:
                        speechModels = _a.sent();
                        if (langModelId[0]) {
                            req.log.error("Custom language model error: " + langModelId[0]);
                            return [2, Promise.resolve(undefined)];
                        }
                        return [4, getCustomAcousticModelId(speech, req.user)];
                    case 3:
                        acousticModelId = _a.sent();
                        if (acousticModelId[0]) {
                            req.log.error("Custom acoustic model error: " + acousticModelId[0]);
                            return [2, Promise.resolve(undefined)];
                        }
                        return [2, Promise.resolve(new WatsonSTT(speech, req.user.username, req.user.langModel, langModelId[1], req.user.acousticModel, acousticModelId[1], req.user.baseModel, speechModels[1]))];
                }
            });
        });
    };
    WatsonSTT.prototype.addCorpus = function (corpusName, corpus) {
        return __awaiter(this, void 0, void 0, function () {
            var addCorpusParams;
            var _this = this;
            return __generator(this, function (_a) {
                addCorpusParams = {
                    customization_id: this.langModelId,
                    corpus_file: Buffer.from(corpus),
                    corpus_name: corpusName,
                    allow_overwrite: true
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.addCorpus(addCorpusParams, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.addWord = function (word, soundsLike, displayAs) {
        return __awaiter(this, void 0, void 0, function () {
            var addWordParams;
            var _this = this;
            return __generator(this, function (_a) {
                addWordParams = {
                    customization_id: this.langModelId,
                    word_name: word,
                    word: word,
                    sounds_like: soundsLike,
                    display_as: displayAs
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.addWord(addWordParams, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.transcribe = function (buff, fileType, name, languageModel, acousticModel) {
        return __awaiter(this, void 0, void 0, function () {
            var recognizeParams, langModelisBaseModel, acousticModelisBaseModel, tf, sstream;
            return __generator(this, function (_a) {
                recognizeParams = {
                    objectMode: true,
                    interim_results: true,
                    content_type: "audio/" + fileType,
                    model: this.baseModel,
                    smart_formatting: true,
                    timestamps: true,
                    word_alternatives_threshold: 0.9
                };
                langModelisBaseModel = this.isBaseModel(languageModel);
                acousticModelisBaseModel = this.isBaseModel(acousticModel);
                if (langModelisBaseModel) {
                    recognizeParams.model = languageModel;
                }
                if (!langModelisBaseModel) {
                    recognizeParams.language_customization_id = this.langModelId;
                }
                if (!acousticModelisBaseModel) {
                    recognizeParams.acoustic_customization_id = this.acousticModelId;
                }
                tf = {
                    tid: tid++,
                    name: name,
                    languageModel: languageModel,
                    acousticModel: acousticModel,
                    ws: null
                };
                addQueue(tf);
                sstream = this.speech.recognizeUsingWebSocket(recognizeParams);
                sstream.on('data', function (event) {
                    if (event.results[0] && tf.ws &&
                        event.results[0].final === true) {
                        var result = event.results[0].alternatives[0];
                        var timestamps = result.timestamps;
                        tf.ws.send(JSON.stringify({ transcript: result.transcript.trim(),
                            start: timestamps[0][1],
                            stop: timestamps[timestamps.length - 1][2]
                        }));
                    }
                });
                sstream.on('error', function (event) {
                    if (tf.ws) {
                        tf.ws.send(JSON.stringify({ error: event.message }));
                    }
                    delQueue(tf);
                });
                sstream.on('close', function () {
                    if (tf.ws) {
                        tf.ws.send(JSON.stringify({ finished: true }));
                    }
                    delQueue(tf);
                });
                return [2, new Promise(function (resolve, reject) {
                        var cursor = 0;
                        var threeMB = 1024 * 1024 * 3;
                        while (true) {
                            var end = cursor + threeMB;
                            if (end > buff.byteLength) {
                                end = buff.byteLength;
                                sstream.end(buff.slice(cursor, end), function () {
                                    resolve([undefined, tf.tid]);
                                });
                                break;
                            }
                            sstream.write(buff.slice(cursor, end));
                            cursor += threeMB;
                        }
                    })];
            });
        });
    };
    WatsonSTT.prototype.getCorpus = function (corpusName) {
        return __awaiter(this, void 0, void 0, function () {
            var getCorpusParams;
            var _this = this;
            return __generator(this, function (_a) {
                getCorpusParams = {
                    customization_id: this.langModelId,
                    corpus_name: corpusName
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.getCorpus(getCorpusParams, function (error, corpus) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, corpus]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.deleteCorpus = function (corpusName) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteCorpusParams;
            var _this = this;
            return __generator(this, function (_a) {
                deleteCorpusParams = {
                    customization_id: this.langModelId,
                    corpus_name: corpusName
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.deleteCorpus(deleteCorpusParams, function (error, corpusName) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, corpusName]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.getCorpora = function () {
        return __awaiter(this, void 0, void 0, function () {
            var getCorporaParams;
            var _this = this;
            return __generator(this, function (_a) {
                getCorporaParams = {
                    customization_id: this.langModelId,
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.listCorpora(getCorporaParams, function (error, corpora) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, corpora]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.trainModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.trainLanguageModel({ customization_id: _this.langModelId }, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.getLanguageModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.getLanguageModel({ customization_id: _this.langModelId }, function (error, languageModel) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, languageModel]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.listWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.listWords({ customization_id: _this.langModelId }, function (error, results) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, results]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.deleteWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteWordParams;
            var _this = this;
            return __generator(this, function (_a) {
                deleteWordParams = {
                    customization_id: this.langModelId,
                    word_name: word
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.deleteWord(deleteWordParams, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.isBaseModel = function (model) {
        var found = false;
        if (this.speechModels.models.find(function (element) {
            return element.name === model;
        })) {
            return found = true;
        }
        return found;
    };
    WatsonSTT.prototype.getAcousticModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.getAcousticModel({ customization_id: _this.acousticModelId }, function (error, acousticModel) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, acousticModel]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.trainAcousticModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var trainAcousticModelParams;
            var _this = this;
            return __generator(this, function (_a) {
                trainAcousticModelParams = {
                    customization_id: this.acousticModelId,
                    custom_language_model_id: this.langModelId
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.trainAcousticModel(trainAcousticModelParams, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.addAudio = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.addAudio(params, function (error) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.listAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listAudioParams;
            var _this = this;
            return __generator(this, function (_a) {
                listAudioParams = {
                    customization_id: this.acousticModelId,
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.listAudio(listAudioParams, function (error, audioResources) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, audioResources]);
                            }
                        });
                    })];
            });
        });
    };
    WatsonSTT.prototype.deleteAudio = function (audioName) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteAudioParams;
            var _this = this;
            return __generator(this, function (_a) {
                deleteAudioParams = {
                    customization_id: this.acousticModelId,
                    audio_name: audioName
                };
                return [2, new Promise(function (resolve, reject) {
                        _this.speech.deleteAudio(deleteAudioParams, function (error, audioName) {
                            if (error) {
                                resolve([error]);
                            }
                            else {
                                resolve([undefined, audioName]);
                            }
                        });
                    })];
            });
        });
    };
    return WatsonSTT;
}());
exports.WatsonSTT = WatsonSTT;
function getSTTV1(credentials) {
    var options = Object.create(credentials);
    if (credentials.apikey) {
        options.iam_apikey = credentials.apikey;
    }
    return new SpeechToTextV1(options);
}
exports.getSTTV1 = getSTTV1;
var models = [];
var acoustics = [];
function getCustomLangModelId(speech, user) {
    var modelName = user.langModel;
    for (var index = 0, len = models.length; index < len; index++) {
        if (models[index].name === modelName) {
            return Promise.resolve([undefined, models[index].id]);
        }
    }
    return new Promise(function (resolve) {
        speech.listLanguageModels(null, function (error, languageModels) {
            if (error) {
                return resolve([error]);
            }
            else {
                var customModels = languageModels.customizations;
                if (customModels) {
                    for (var i = 0, len = customModels.length; i < len; i++) {
                        if (customModels[i].name === modelName) {
                            models.push({
                                name: modelName,
                                id: customModels[i].customization_id
                            });
                            return resolve([undefined, customModels[i].customization_id]);
                        }
                    }
                }
            }
            speech.createLanguageModel({
                name: modelName,
                base_model_name: user.baseModel,
                description: "Custom model for " + user.username,
            }, function (error, languageModel) {
                if (error) {
                    return resolve([error]);
                }
                else {
                    models.push({ name: modelName, id: languageModel.customization_id });
                    return resolve([undefined, languageModel.customization_id]);
                }
            });
        });
    });
}
function getBaseModels(speech) {
    return new Promise(function (resolve, reject) {
        speech.listModels(null, function (error, results) {
            if (error) {
                resolve([error]);
            }
            else {
                resolve([undefined, results]);
            }
        });
    });
}
function getCustomAcousticModelId(speech, user) {
    var modelName = user.acousticModel;
    for (var index = 0, len = acoustics.length; index < len; index++) {
        if (acoustics[index].name === modelName) {
            return Promise.resolve([undefined, acoustics[index].id]);
        }
    }
    return new Promise(function (resolve) {
        speech.listAcousticModels(null, function (error, acousticModels) {
            if (error) {
                return resolve([error]);
            }
            else {
                var customModels = acousticModels.customizations;
                if (customModels) {
                    for (var i = 0, len = customModels.length; i < len; i++) {
                        if (customModels[i].name === modelName) {
                            acoustics.push({
                                name: modelName,
                                id: customModels[i].customization_id
                            });
                            return resolve([undefined, customModels[i].customization_id]);
                        }
                    }
                }
            }
            speech.createAcousticModel({
                name: modelName,
                base_model_name: user.baseModel,
                description: "Custom acoustic model for " + user.username,
            }, function (error, acousticModel) {
                if (error) {
                    return resolve([error]);
                }
                else {
                    acoustics.push({
                        name: modelName,
                        id: acousticModel.customization_id
                    });
                    return resolve([undefined, acousticModel.customization_id]);
                }
            });
        });
    });
}
var queue = {};
var tid = 0;
var addQueue = function (tf) {
    queue[tf.tid] = tf;
};
var delQueue = function (tf) {
    delete queue[tf.tid];
};
exports.wsHandler = function (socket) {
    socket.on('message', function (message) {
        if (typeof (message) === 'string') {
            var json = JSON.parse(message);
            var tf_1 = queue[json.tid];
            if (tf_1) {
                tf_1.ws = socket;
                tf_1.ws.onclose = tf_1.ws.onerror = function () {
                    tf_1.ws = null;
                };
            }
        }
    });
};
//# sourceMappingURL=util.js.map