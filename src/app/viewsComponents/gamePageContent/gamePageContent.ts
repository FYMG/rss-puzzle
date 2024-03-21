import createComponent from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import { useRouter } from '@services/router';
import boardComponent from '@components/board/boardComponent';
import getLevels, { LevelDifficulty } from '@services/api';
import throwError from '@utils/helpers/throwError';
import Routes from '@utils/consts/routes';
import boardControlComponent from '@components/boardControl/boardControlComponent';
import { useAuthProvider } from '@services/auth';
import statisticModalComponent from '@components/statisticModal/statisticModalComponent';
import style from './gamePageContent.module.scss';

const gamePageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const { route, args, root } = useRouter();
    const { saveData } = useAuthProvider();
    const difficulty = args.difficulty ?? saveData?.difficulty ?? 0;
    let level = args.level ?? saveData?.level ?? 0;
    if (saveData) {
        saveData.level = level;
        saveData.difficulty = difficulty;
    }

    const boardControl = boardControlComponent({
        classList: style['game-field__control'],
    });

    const standbyList = createComponent({
        tag: 'div',
        classList: style['standby-list'],
    });

    const gameFieldWrapper = createComponent({
        tag: 'section',
        classList: mergeClassLists(style['main__content']),
    });

    const statisticButton = createComponent({
        tag: 'button',
        classList: mergeClassLists(
            style['game-field__button'],
            style['game-field__button_hidden'],
        ),
        textContent: 'Результаты',
    });

    const checkRowButton = createComponent<HTMLButtonElement>({
        tag: 'button',
        classList: mergeClassLists(
            style['game-field__button'],
            style['game-field__button_hidden'],
        ),
        textContent: 'check row',
    });

    const levelSelect = createComponent({
        tag: 'select',
        classList: style['game-field__select'],
        id: 'level',
    });

    const levelSelectLabel = createComponent({
        tag: 'label',
        textContent: 'Уровень:',
        children: levelSelect,
    });

    const difficultySelect = createComponent({
        tag: 'select',
        classList: style['game-field__select'],
        id: 'difficulty',
    });

    const difficultySelectLabel = createComponent({
        tag: 'label',
        textContent: 'Сложность:',
        children: difficultySelect,
    });

    const iDontKnowButton = createComponent<HTMLButtonElement>({
        tag: 'button',
        classList: style['game-field__button'],
        textContent: 'Подсказка',
    });

    const controlsBlock = createComponent({
        tag: 'div',
        classList: mergeClassLists(style['game-field__controls-block']),
        children: [
            difficultySelectLabel,
            levelSelectLabel,
            checkRowButton,
            statisticButton,
            iDontKnowButton,
        ],
    });

    Object.keys(LevelDifficulty).forEach((key) => {
        const option = createComponent<HTMLOptionElement>({
            id: `difficulty_${key}`,
            tag: 'option',
            textContent: (Number(key) + 1).toString(),
            value: key,
            selected: difficulty === Number(key),
        });
        difficultySelect.append(option);
    });

    difficultySelect.addEventListener('change', (event) => {
        const value = Number((event.target as HTMLSelectElement).value);
        route(Routes.gamePage, { level, difficulty: value });
    });

    getLevels(difficulty)
        .then((data) => {
            if (data.roundsCount <= level) {
                level = 0;
            }
            const gameField = boardComponent({
                difficulty,
                level,
                data,
                standbyList,
                controlComponent: boardControl,
                onUpdate: ({ isWin, rowIsCorrect, rowIsComplete }) => {
                    checkRowButton.addClass(style['game-field__button_hidden'] ?? '');
                    if (rowIsComplete) {
                        checkRowButton.removeClass(
                            style['game-field__button_hidden'] ?? '',
                        );
                        checkRowButton.getNode().textContent = 'Проверить';
                    }
                    if (rowIsCorrect) {
                        checkRowButton.removeClass(
                            style['game-field__button_hidden'] ?? '',
                        );
                        checkRowButton.getNode().textContent = 'Продолжить';
                        if (isWin) {
                            checkRowButton.getNode().textContent = 'Следуйщий уровень';
                            statisticButton.removeClass(
                                style['game-field__button_hidden'] ?? '',
                            );
                        }
                    }
                },
            });
            Object.keys(data.rounds).forEach((key) => {
                if (saveData) {
                    if (!saveData.levels) {
                        saveData.levels = {};
                    }
                    if (!saveData.levels?.[difficulty]) {
                        saveData.levels[difficulty] = {};
                    }
                    if (!saveData.levels[difficulty]![Number(key)]) {
                        saveData.levels[difficulty]![Number(key)] = {
                            completed: false,
                            words: data.rounds[Number(key)]!.words.map(() => ({
                                hint: false,
                            })),
                        };
                    }
                }

                const emoji = saveData!.levels![difficulty]![Number(key)]!.completed
                    ? '✅'
                    : '';

                const option = createComponent<HTMLOptionElement>({
                    id: `level_${key}`,
                    tag: 'option',
                    textContent: emoji + (Number(key) + 1).toString(),
                    value: key,
                    selected: level === Number(key),
                });
                levelSelect.append(option);
            });

            levelSelect.addEventListener('change', (event) => {
                const value = Number((event.target as HTMLSelectElement).value);
                route(Routes.gamePage, { level: value, difficulty });
            });

            iDontKnowButton.addEventListener('click', () => {
                gameField.iDontKnow();
                if (gameField.isWin) {
                    checkRowButton.removeClass(style['game-field__button_hidden'] ?? '');
                    checkRowButton.getNode().textContent = 'Следуйщий уровень';
                    statisticButton.removeClass(style['game-field__button_hidden'] ?? '');
                }
            });

            statisticButton.addEventListener('click', () => {
                root.append(
                    statisticModalComponent({
                        level,
                        difficulty,
                        data,
                    }),
                );
            });

            checkRowButton.addEventListener('click', () => {
                if (gameField.isWin) {
                    if (level === data.roundsCount - 1 && difficulty === 5) {
                        route(Routes.gamePage, { level: 0, difficulty: 0 });
                        return;
                    }
                    if (level === data.roundsCount - 1) {
                        route(Routes.gamePage, { level: 0, difficulty: difficulty + 1 });
                        return;
                    }
                    route(Routes.gamePage, { level: level + 1, difficulty });
                    return;
                }
                if (gameField.rowIsCorrect) {
                    gameField.goToNextRow();
                    checkRowButton.addClass(style['game-field__button_hidden'] ?? '');
                    return;
                }
                if (gameField.rowIsComplete) {
                    gameField.validate();
                }
            });
            gameFieldWrapper.appendChildren([
                boardControl,
                gameField,
                standbyList,
                controlsBlock,
            ]);
            return data;
        })
        .catch(() => throwError('Level loading error'));

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['main'], classList),
        children: mergeChildrenLists(gameFieldWrapper, children),
        ...props,
    });
};

export default gamePageContent;
