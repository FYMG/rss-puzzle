import { BaseComponent, FunctionComponent, IProps } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import style from './playVoiceButton.module.scss';

interface IPlayVoiceButtonComponentProps {
    soundSrc?: string;
}

export class PlayVoiceButtonComponent extends BaseComponent<HTMLButtonElement> {
    private static currentPlaying: HTMLAudioElement | null = null;

    public soundSrc: string;

    constructor(soundSrc: string, props: IProps) {
        super(props);
        this.soundSrc = soundSrc ?? '';
        this.addEventListener('click', () => {
            this.addClass(style['play-voice-button_playing'] ?? '');
            const audioComponent = new Audio(this.soundSrc);
            if (PlayVoiceButtonComponent.currentPlaying) {
                PlayVoiceButtonComponent.currentPlaying.pause();
                PlayVoiceButtonComponent.currentPlaying = null;
            }
            PlayVoiceButtonComponent.currentPlaying = audioComponent;
            audioComponent.onpause = () => {
                this.removeClass(style['play-voice-button_playing'] ?? '');
            };
            audioComponent.play().catch(console.error);
        });
    }
}

const playVoiceButtonComponent: FunctionComponent<
    HTMLButtonElement,
    IPlayVoiceButtonComponentProps,
    PlayVoiceButtonComponent
> = ({ classList, soundSrc, children, ...props }) => {
    return new PlayVoiceButtonComponent(soundSrc ?? '', {
        tag: 'button',
        classList: mergeClassLists(style['play-voice-button'], classList),
        textContent: '🔊',
        ...props,
    });
};

export default playVoiceButtonComponent;
