import ILevelModel from '../app/models/ILevelModel';
export declare const LevelDifficulty: Record<number, string>;
declare const getLevels: (difficulty: keyof typeof LevelDifficulty) => Promise<ILevelModel>;
export default getLevels;
