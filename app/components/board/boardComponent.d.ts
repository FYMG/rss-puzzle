import { BaseComponent, FunctionComponent } from '../baseComponent';
import ILevelModel, { IRound } from '../../models/ILevelModel';
import { BoardControlComponent } from '../boardControl/boardControlComponent';
interface OnUpdateProps {
    isWin: boolean;
    rowIsCorrect: boolean;
    rowIsComplete: boolean;
    round: IRound;
    rowLength: number;
    goToNextRow: () => void;
    validate: () => void;
    iDontKnow: () => void;
}
export interface IBoardComponentProps {
    difficulty: number;
    level: number;
    data: ILevelModel;
    standbyList: BaseComponent;
    controlComponent: BoardControlComponent;
    onUpdate?: (props: OnUpdateProps) => void;
    loader?: BaseComponent;
}
declare class BoardComponent extends BaseComponent {
    iDontKnow: () => void;
    isWin: boolean;
    rowIsCorrect: boolean;
    rowIsComplete: boolean;
    validate: () => void;
    goToNextRow: () => void;
}
declare const boardComponent: FunctionComponent<HTMLElement, IBoardComponentProps, BoardComponent>;
export default boardComponent;
