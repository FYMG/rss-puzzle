import { BaseComponent, FunctionComponent, IProps } from '../baseComponent';
interface IPlayVoiceButtonComponentProps {
    soundSrc?: string;
}
export declare class PlayVoiceButtonComponent extends BaseComponent<HTMLButtonElement> {
    private static currentPlaying;
    soundSrc: string;
    constructor(soundSrc: string, props: IProps);
}
declare const playVoiceButtonComponent: FunctionComponent<HTMLButtonElement, IPlayVoiceButtonComponentProps, PlayVoiceButtonComponent>;
export default playVoiceButtonComponent;
