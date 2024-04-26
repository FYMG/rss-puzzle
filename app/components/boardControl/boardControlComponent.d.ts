import { BaseComponent, FunctionComponent, IProps } from '../baseComponent';
import { PlayVoiceButtonComponent } from '../playVoiceButton/playVoiceButtonComponent';
export declare class BoardControlComponent extends BaseComponent {
    private translation;
    private text;
    private audio;
    private showPuzzleComponent;
    constructor(playAudioComponent: PlayVoiceButtonComponent, translationComponent: BaseComponent, showPuzzleComponent: BaseComponent, props: IProps);
    setAudioSrc(audioSrc: string): void;
    makeVisible(): void;
    makeHidden(): void;
    setTranslation(translation: string): void;
    setShowPuzzleHandler(callback: () => void): void;
}
declare const boardControlComponent: FunctionComponent<HTMLElement, IProps, BoardControlComponent>;
export default boardControlComponent;
