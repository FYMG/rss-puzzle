import createComponent, {
    BaseComponent,
    FunctionComponent,
    IProps,
} from '@components/baseComponent';
import MergeClassLists from '@utils/helpers/mergeClassLists';

import { useAuthProvider } from '@services/auth.ts';
import playVoiceButtonComponent, {
    PlayVoiceButtonComponent,
} from '@components/playVoiceButton/playVoiceButtonComponent';
import style from './boardControl.module.scss';

export class BoardControlComponent extends BaseComponent {
    private translation;

    private text = '';

    private audio: PlayVoiceButtonComponent;

    private showPuzzleComponent: BaseComponent;

    constructor(
        playAudioComponent: PlayVoiceButtonComponent,
        translationComponent: BaseComponent,
        showPuzzleComponent: BaseComponent,
        props: IProps,
    ) {
        super(props);
        this.showPuzzleComponent = showPuzzleComponent;
        this.audio = playAudioComponent;
        this.translation = translationComponent;
    }

    setAudioSrc(audioSrc: string) {
        this.audio.soundSrc = audioSrc;
    }

    makeVisible() {
        this.audio
            .getNode()
            .classList.remove(style['board-control__audio-translate_hidden'] ?? '');
        this.translation
            .getNode()
            .classList.remove(style['board-control__translation_hidden'] ?? '');
    }

    makeHidden() {
        const { saveData } = useAuthProvider();
        const showAudioTranslate = saveData?.audioOn ?? true;
        const showTextTranslate = saveData?.translateTextOn ?? true;

        if (!showAudioTranslate) {
            this.audio
                .getNode()
                .classList.add(style['board-control__audio-translate_hidden'] ?? '');
        }
        if (!showTextTranslate) {
            this.translation
                .getNode()
                .classList.add(style['board-control__translation_hidden'] ?? '');
        }
    }

    setTranslation(translation: string) {
        this.text = translation;
        this.translation.getNode().textContent = this.text;
    }

    setShowPuzzleHandler(callback: () => void) {
        const clickHandler = () => {
            const { saveData } = useAuthProvider();
            if (saveData) {
                saveData.showPuzzle = !(saveData?.showPuzzle ?? false);
                callback();
            }
        };
        this.showPuzzleComponent.addEventListener('click', clickHandler);
    }
}

const boardControlComponent: FunctionComponent<
    HTMLElement,
    IProps,
    BoardControlComponent
> = ({ classList, ...props }) => {
    const { saveData } = useAuthProvider();
    let showAudioTranslate = saveData?.audioOn ?? true;
    let showTextTranslate = saveData?.translateTextOn ?? true;

    const translation = createComponent<HTMLSpanElement>({
        tag: 'span',
        classList: style['board-control__translation'],
    }).componentDidMount(() => {
        if (!showTextTranslate) {
            translation.addClass(style['board-control__translation_hidden'] ?? '');
        }
    });

    const audioTranslate = playVoiceButtonComponent({
        classList: style['board-control__audio-translate'],
    }).componentDidMount(() => {
        if (!showAudioTranslate) {
            audioTranslate.addClass(style['board-control__audio-translate_hidden'] ?? '');
        }
    });

    const audioHide = createComponent({
        tag: 'button',
        classList: MergeClassLists(
            style['board-control__button'],
            style['board-control__audio-hide'],
        ),
        textContent: '🔊',
    })
        .addEventListener('click', () => {
            showAudioTranslate = !showAudioTranslate;
            saveData!.audioOn = showAudioTranslate;

            if (!showAudioTranslate) {
                audioTranslate.addClass(
                    style['board-control__audio-translate_hidden'] ?? '',
                );
                audioHide.removeClass(style['board-control__button_active'] ?? '');
            } else {
                audioTranslate.removeClass(
                    style['board-control__audio-translate_hidden'] ?? '',
                );
                audioHide.addClass(style['board-control__button_active'] ?? '');
            }
        })
        .componentDidMount(() => {
            if (showAudioTranslate) {
                audioHide.addClass(style['board-control__button_active'] ?? '');
            }
        });

    const translationBlock = createComponent({
        tag: 'div',
        classList: style['board-control__translation-block'],
    });

    const translationHide = createComponent({
        tag: 'button',
        classList: MergeClassLists(
            style['board-control__button'],
            style['board-control__translation-hide'],
        ),
        textContent: '🖹',
    })
        .addEventListener('click', () => {
            showTextTranslate = !showTextTranslate;
            saveData!.translateTextOn = showTextTranslate;

            if (showTextTranslate) {
                translation.removeClass(style['board-control__translation_hidden'] ?? '');
                translationHide.addClass(style['board-control__button_active'] ?? '');
            } else {
                translation.addClass(style['board-control__translation_hidden'] ?? '');
                translationHide.removeClass(style['board-control__button_active'] ?? '');
            }
        })
        .componentDidMount(() => {
            if (showTextTranslate) {
                translationHide.addClass(style['board-control__button_active'] ?? '');
            }
        });

    const showPuzzle = createComponent<HTMLButtonElement>({
        tag: 'button',
        textContent: '🖼️',
        classList: MergeClassLists(style['board-control__button']),
    });
    const hideControlBlock = createComponent({
        tag: 'div',
        classList: style['board-control__hide-block'],
        children: [audioHide, translationHide, showPuzzle],
    });

    translationBlock.appendChildren([translation, audioTranslate]);

    return new BoardControlComponent(audioTranslate, translation, showPuzzle, {
        children: [translationBlock, hideControlBlock],
        classList: MergeClassLists(style['board-control'], classList),
        ...props,
    });
};

export default boardControlComponent;
