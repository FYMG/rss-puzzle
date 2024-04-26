import { IUser } from '../app/models/ILocalStorageModel';
import ISaveDataModel from '../app/models/ISaveDataModel.ts';
export declare enum AuthAction {
    login = "login",
    logout = "logout",
    signup = "signup"
}
export declare enum AuthMessage {
    userAlreadyExist = "User already exist",
    incorrectFormat = "Incorrect format",
    allOk = "All ok",
    userNotExist = "User not exist"
}
export interface IAuthResult {
    success: boolean;
    action: AuthAction;
    messages: AuthMessage[];
}
export declare const useAuthProvider: () => {
    isAuth: boolean;
    singUp: (name: string, surname: string, callback: (reason: IAuthResult) => void) => void;
    logout: (callback: (reason: IAuthResult) => void) => void;
    login: (name: string, surname: string, callback: (reason: IAuthResult) => void) => void;
    user: IUser | undefined;
    saveData: ISaveDataModel | undefined;
    isInitialized: boolean;
};
export declare const createAuthProvider: () => {
    isAuth: boolean;
    singUp: (name: string, surname: string, callback: (reason: IAuthResult) => void) => void;
    logout: (callback: (reason: IAuthResult) => void) => void;
    login: (name: string, surname: string, callback: (reason: IAuthResult) => void) => void;
    user: IUser | undefined;
    saveData: ISaveDataModel | undefined;
    isInitialized: boolean;
};
