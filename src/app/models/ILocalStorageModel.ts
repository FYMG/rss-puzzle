export interface IUser {
    name: string;
    surname: string;
    saveDataId: PropertyKey;
}

export interface ISession {
    isAuth: boolean;
    userId: PropertyKey | null;
}

export type ISaveData = Record<PropertyKey, Record<PropertyKey, string>>;

export default interface ILocalStorageModel {
    [key: PropertyKey]: unknown;
    saveData: ISaveData;
    session: ISession;
    users: Record<PropertyKey, IUser>;
    totalUser: number;
}
