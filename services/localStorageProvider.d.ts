import ILocalStorageModel from '../app/models/ILocalStorageModel';
export declare const useLocalStorageProvider: () => {
    state: ILocalStorageModel;
    isInitialized: boolean;
};
export declare const createLocalStorageProvider: () => {
    state: ILocalStorageModel;
    isInitialized: boolean;
};
