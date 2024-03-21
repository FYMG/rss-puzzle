import createComponent, {
    BaseComponent,
    FunctionComponent,
} from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import { PuzzleComponent } from '@components/puzzle/puzzleComponent';

import ILevelModel, { IRound } from '@models/ILevelModel';
import throwError from '@utils/helpers/throwError';

import texture from '@assets/puzzle-texture.jpg';
import waitImages from '@utils/helpers/waitImages';
import fillBoard from '@components/board/fillBoard';
import arrayShuffle from '@utils/helpers/arrayShuffle';
import loaderComponent from '@components/loader/loaderComponent';
import { BoardControlComponent } from '@components/boardControl/boardControlComponent';
import { useAuthProvider } from '@services/auth.ts';
import style from './board.module.scss';

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

class BoardComponent extends BaseComponent {
    public iDontKnow: () => void = () => {};

    public isWin = false;

    public rowIsCorrect = false;

    public rowIsComplete = false;

    public validate: () => void = () => {};

    public goToNextRow: () => void = () => {};
}

const boardComponent: FunctionComponent<
    HTMLElement,
    IBoardComponentProps,
    BoardComponent
> = ({
    difficulty,
    controlComponent,
    imgSrc,
    level,
    data,
    classList,
    children,
    standbyList,
    onUpdate,
    ...props
}) => {
    if (!data.rounds[level]) {
        throwError('level not found');
    }
    const { saveData } = useAuthProvider();
    const loader = loaderComponent({
        classList: style['board__loader'],
    });
    const round = data.rounds[level]!;
    let rowElements: BaseComponent[] = [];
    let puzzleGrid: PuzzleComponent[][] = [];
    let currentRow = 0;

    const puzzleImg = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: style['board__img'],
        src: round.levelData.imageSrc,
        crossOrigin: 'anonymous',
    });

    const boardText = createComponent<HTMLParagraphElement>({
        tag: 'p',
        classList: style['board__text'],
        textContent: `${round.levelData.name}, ${round.levelData.author}, ${round.levelData.year}`,
    });

    const cartonTexture = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: mergeClassLists(style['board__img']),
        src: texture,
        crossOrigin: 'anonymous',
    });

    const puzzleWrapper = createComponent<HTMLElement>({
        tag: 'div',
        classList: style['board__puzzle-wrapper'],
    });

    const board = new BoardComponent({
        tag: 'div',
        classList: mergeClassLists(style['board'], style['board_loading'], classList),
        children: mergeChildrenLists(
            loader,
            puzzleImg,
            boardText,
            cartonTexture,
            puzzleWrapper,
            children,
        ),
        draggable: false,
        ...props,
    });

    const usePuzzleSrc = (): void => {
        const showPuzzle: boolean = saveData?.showPuzzle ?? false;
        if (showPuzzle) {
            (puzzleGrid?.[currentRow] ?? []).forEach((item) => item.useAdditionalSrc());
        } else {
            (puzzleGrid?.[currentRow] ?? []).forEach((item) => item.useBaseSrc());
        }
    };
    controlComponent.setShowPuzzleHandler(usePuzzleSrc);

    const nextRow = (currRow: number) => {
        controlComponent.setTranslation(round.words[currRow]?.textExampleTranslate ?? '');
        controlComponent.setAudioSrc(round.words[currRow]?.audioExample ?? '');
        rowElements[currentRow]?.addClass(style['board__row_current'] ?? '');
        rowElements.forEach((row) => {
            row.getNode().classList.remove(style['board__row_hidden'] ?? '');
        });
        puzzleGrid?.slice(0, currRow).forEach((row) =>
            row.forEach((item) => {
                item.disabled = true;
                item.useAdditionalSrc();
            }),
        );
        rowElements.slice(currRow + 1, rowElements.length).forEach((row) => {
            if (style['board__row_hidden']) {
                row.getNode().classList.add(style['board__row_hidden']);
            }
        });
        standbyList.appendChildren(arrayShuffle(puzzleGrid?.[currRow] ?? []));
        usePuzzleSrc();
    };

    const goToNextRow = () => {
        puzzleGrid[currentRow]?.forEach((item) => item.removeValidation());
        board.isWin = currentRow === rowElements.length - 1;
        if (board.isWin) {
            saveData!.levels![difficulty]![Number(level)]!.completed = true;
            controlComponent.makeVisible();
            boardText.getNode().style.display = 'block';
            puzzleWrapper.destroy();
            puzzleImg.getNode().style.opacity = '1';
            console.log('U WIN!!!!!!!11!!');
            return;
        }
        controlComponent.makeHidden();
        currentRow += 1;
        nextRow(currentRow);
    };

    const onUpdateHandler = () => {
        const currentItems = Array.from(
            rowElements[currentRow]?.getNode().children ?? [],
        );
        const currenRightAnswer = round.words[currentRow]?.textExample ?? '';
        puzzleGrid[currentRow]?.forEach((item) => item.removeValidation());

        const currentText = currentItems.map((item) => item.textContent);
        const validate = () => {
            puzzleGrid[currentRow]?.forEach((item, i) => {
                item.validate(currentText[i] ?? '');
            });
        };

        const rowIsCorrect = currentText.join(' ') === currenRightAnswer;
        const rowIsComplete = currentText.length === currenRightAnswer.split(' ').length;

        controlComponent.makeHidden();
        if (rowIsCorrect) {
            controlComponent.makeVisible();
        }

        board.rowIsComplete = rowIsComplete;
        board.rowIsCorrect = rowIsCorrect;
        board.validate = validate;
        board.goToNextRow = goToNextRow;

        const rowLength = currentText.length;
        onUpdate?.({
            iDontKnow: board.iDontKnow.bind(board),
            isWin: board.isWin,
            rowIsCorrect,
            rowIsComplete,
            round,
            rowLength,
            goToNextRow,
            validate,
        });
    };

    board.iDontKnow = function () {
        rowElements[currentRow]?.appendChildren(puzzleGrid[currentRow] ?? []);
        saveData!.levels![difficulty]![Number(level)]!.words[currentRow]!.hint = true;
        goToNextRow();
        onUpdateHandler();
    };

    board.componentDidMount(() => {
        waitImages([cartonTexture.getNode(), puzzleImg.getNode()], () => {
            const { rowList: list, puzzleGrid: grid } = fillBoard(
                round,
                puzzleImg,
                cartonTexture,
                standbyList,
                onUpdateHandler,
            );
            puzzleGrid = grid;
            rowElements = list;
            puzzleWrapper.appendChildren(rowElements);
            loader?.destroy();
            cartonTexture.destroy();
            nextRow(currentRow);
            board.removeClass(style['board_loading'] ?? '');
        });
    });
    return board;
};

export default boardComponent;
