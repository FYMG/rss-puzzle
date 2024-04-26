import { BaseComponent } from '../baseComponent';
import { PuzzleComponent } from '../puzzle/puzzleComponent';
import { IRound } from '../../models/ILevelModel.ts';
declare const fillBoard: (round: IRound, puzzleImg: BaseComponent<HTMLImageElement>, cartonTexture: BaseComponent<HTMLImageElement>, standbyList: BaseComponent, onUpdate: () => void) => {
    rowList: BaseComponent<HTMLElement>[];
    puzzleGrid: PuzzleComponent[][];
};
export default fillBoard;
