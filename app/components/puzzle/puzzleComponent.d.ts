import { BaseComponent, FunctionComponent, IProps } from '../baseComponent';
export declare class PuzzleComponent extends BaseComponent {
    word: string;
    private readonly baseSrc;
    private readonly additionalSrc;
    disabled: boolean;
    imageComponent: BaseComponent<HTMLImageElement>;
    constructor(word: string, baseSrc: string, additionalSrc: string, imageComponent: BaseComponent<HTMLImageElement>, props: IProps, disabled?: boolean);
    validate(word: string): boolean;
    removeValidation(): void;
    useBaseSrc(): void;
    useAdditionalSrc(): void;
}
export interface IPuzzleComponentProps {
    baseDataImg: string;
    additionalDataImg: string;
    word: string;
    fieldRow: BaseComponent;
    standbyList: BaseComponent;
    onUpdate?: () => void;
}
declare const puzzleComponent: FunctionComponent<HTMLElement, IPuzzleComponentProps, PuzzleComponent>;
export default puzzleComponent;
