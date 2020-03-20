/// <reference types="node" />
import { Request } from 'express';
import SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
import * as STTDef from 'ibm-watson/speech-to-text/v1-generated';
import * as WebSocket from 'ws';
export interface User {
    username: string;
    langModel: string;
    acousticModel: string;
    baseModel: string;
}
export declare function getCfenv(): any;
export interface STTError {
    code?: string;
    error?: string;
    msg?: string;
}
export declare class WatsonSTT {
    readonly speech: SpeechToTextV1;
    readonly username: string;
    readonly langModelName: string;
    readonly langModelId: string;
    readonly acousticModelName: string;
    readonly acousticModelId: string;
    readonly baseModel: string;
    readonly speechModels: STTDef.SpeechModels;
    private constructor();
    static getInstance(req: Request): Promise<WatsonSTT>;
    addCorpus(corpusName: string, corpus: string): Promise<[STTError]>;
    addWord(word: string, soundsLike?: string[], displayAs?: string): Promise<[STTError]>;
    transcribe(buff: Buffer, fileType: string, name: string, languageModel: string, acousticModel: string): Promise<[STTError, number?]>;
    getCorpus(corpusName: string): Promise<[STTError, STTDef.Corpus?]>;
    deleteCorpus(corpusName: string): Promise<[STTError, string?]>;
    getCorpora(): Promise<[STTError, STTDef.Corpora?]>;
    trainModel(): Promise<[STTError]>;
    getLanguageModel(): Promise<[STTError, STTDef.LanguageModel?]>;
    listWords(): Promise<[STTError, STTDef.Words?]>;
    deleteWord(word: string): Promise<[STTError]>;
    isBaseModel(model: string): boolean;
    getAcousticModel(): Promise<[STTError, STTDef.AcousticModel?]>;
    trainAcousticModel(): Promise<[STTError]>;
    addAudio(params: STTDef.AddAudioParams): Promise<[STTError]>;
    listAudio(): Promise<[STTError, STTDef.AudioResources?]>;
    deleteAudio(audioName: string): Promise<[STTError, string?]>;
}
export declare function getSTTV1(credentials: STTCredential): SpeechToTextV1;
export declare type STTCredential = STTCredentialUserPass | STTCredentialAPIKey;
export interface STTCredentialUserPass {
    username: string;
    password: string;
    url: string;
}
export interface STTCredentialAPIKey {
    apikey: string;
    url: string;
}
export declare let wsHandler: (socket: WebSocket) => void;
