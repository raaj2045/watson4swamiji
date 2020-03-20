import { WatsonSTT } from '../util';
import { Request, Response, RequestHandler } from 'express';
import { NextFunction } from 'connect';
declare global {
    namespace Express {
        interface Request {
            watsonSTT?: WatsonSTT;
            log?: Console;
        }
    }
}
declare const uploadAudio: RequestHandler;
declare function postTranscribe(req: Request, res: Response): Promise<Response<any>>;
declare function getModel(req: Request, res: Response): Promise<Response<any>>;
declare function getAcousticModel(req: Request, res: Response): Promise<Response<any>>;
declare function postAudio(req: Request, res: Response): Promise<Response<any>>;
declare function listAudio(req: Request, res: Response): Promise<Response<any>>;
declare function deleteAudio(req: Request, res: Response): Promise<Response<any>>;
declare function postCorpus(req: Request, res: Response): Promise<Response<any>>;
declare function deleteCorpus(req: Request, res: Response): Promise<Response<any>>;
declare function getCorpora(req: Request, res: Response): Promise<Response<any>>;
declare function getWords(req: Request, res: Response): Promise<Response<any>>;
declare function addWord(req: Request, res: Response): Promise<Response<any>>;
declare function deleteWord(req: Request, res: Response): Promise<Response<any>>;
declare function trainModel(req: Request, res: Response): Promise<Response<any>>;
declare function trainAcousticModel(req: Request, res: Response): Promise<Response<any>>;
declare function checkWatsonCredential(req: Request, res: Response, next: NextFunction): Promise<void>;
export { uploadAudio, postTranscribe, getModel, getAcousticModel, deleteCorpus, postCorpus, postAudio, listAudio, deleteAudio, getCorpora, getWords, addWord, deleteWord, trainModel, trainAcousticModel, checkWatsonCredential };
