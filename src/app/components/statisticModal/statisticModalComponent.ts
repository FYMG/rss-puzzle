import createComponent, { FunctionComponent } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import ILevelModel from '@models/ILevelModel.ts';
import { useAuthProvider } from '@services/auth.ts';
import playVoiceButtonComponent from '@components/playVoiceButton/playVoiceButtonComponent';
import Routes from '@utils/consts/routes';
import { useRouter } from '@services/router';
import style from './statisticModal.module.scss';

interface IStatisticModalProps {
    level: number;
    difficulty: number;
    data: ILevelModel;
}
const statisticModalComponent: FunctionComponent<HTMLElement, IStatisticModalProps> = ({
    level,
    difficulty,
    data,
    classList,
    children,
    ...props
}) => {
    const round = data.rounds[level]!;
    const { saveData } = useAuthProvider();
    const { route } = useRouter();

    const levelsWithOutHits = createComponent({
        tag: 'div',
        classList: style['statistic-modal__levels'],
    });
    const levelsWithHits = createComponent({
        tag: 'div',
        classList: mergeClassLists(
            style['statistic-modal__levels'],
            style['statistic-modal__levels_hint'],
        ),
    });

    const continueButton = createComponent({
        tag: 'button',
        classList: style['statistic-modal__button'],
        textContent: 'Продолжить',
    }).addEventListener('click', () => {
        if (level === data.roundsCount - 1 && difficulty === 5) {
            route(Routes.gamePage, { level: 0, difficulty: 0 });
            return;
        }
        if (level === data.roundsCount - 1) {
            route(Routes.gamePage, { level: 0, difficulty: difficulty + 1 });
            return;
        }
        route(Routes.gamePage, { level: level + 1, difficulty });
    });
    const withHintsTitle = createComponent({
        tag: 'h4',
        classList: mergeClassLists(
            style['statistic-modal__title'],
            style['statistic-modal__title_hidden'],
        ),
        textContent: 'Ряды собранные c подсказкой:',
    });
    const withOutHintsTitle = createComponent({
        tag: 'h4',
        classList: mergeClassLists(
            style['statistic-modal__title'],
            style['statistic-modal__title_hidden'],
        ),
        textContent: 'Ряды собранные без подсказки:',
    });
    const levelsWrapper = createComponent({
        tag: 'div',
        classList: style['statistic-modal__levels-wrapper'],
        children: [withOutHintsTitle, levelsWithOutHits, withHintsTitle, levelsWithHits],
    });

    const miniImage = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: style['statistic-modal__image'],
        src: round.levelData.cutSrc,
    });

    round.words.forEach((word, index) => {
        const hintUsed = saveData?.levels![difficulty]![level]!.words[index]!.hint;
        const levelComponent = createComponent({
            tag: 'div',
            classList: style['statistic-modal__level'],
            children: [
                playVoiceButtonComponent({
                    soundSrc: word.audioExample,
                }),
                createComponent({
                    tag: 'span',
                    classList: style['statistic-modal__level'],
                    textContent: word.textExample,
                }),
            ],
        });
        if (hintUsed) {
            withHintsTitle.removeClass(style['statistic-modal__title_hidden'] ?? '');
            levelsWithHits.appendChildren(levelComponent);
        } else {
            withOutHintsTitle.removeClass(style['statistic-modal__title_hidden'] ?? '');
            levelsWithOutHits.appendChildren(levelComponent);
        }
    });

    const statisticModalContent = createComponent({
        tag: 'div',
        classList: style['statistic-modal__content'],
        children: [
            miniImage,
            createComponent({
                tag: 'h4',
                classList: style['statistic-modal__title'],
                textContent: `${round.levelData.name}, ${round.levelData.author}, ${round.levelData.year}`,
            }),
            levelsWrapper,
            continueButton,
        ],
    });

    const modal = createComponent({
        tag: 'div',
        classList: mergeClassLists(style['statistic-modal'], classList),
        children: [statisticModalContent],
        ...props,
    });

    const closeButton = createComponent({
        tag: 'button',
        classList: style['statistic-modal__close'],
        textContent: 'X',
    }).addEventListener('click', () => {
        modal.destroy();
    });

    statisticModalContent.append(closeButton);

    return modal;
};

export default statisticModalComponent;
