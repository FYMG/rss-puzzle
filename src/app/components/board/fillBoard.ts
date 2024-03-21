import createComponent, { BaseComponent } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import style from '@components/board/board.module.scss';
import puzzleComponent, { PuzzleComponent } from '@components/puzzle/puzzleComponent';
import drawPuzzle from '@utils/helpers/drawPuzzle';
import { IRound } from '@models/ILevelModel.ts';

const fillBoard = (
    round: IRound,
    puzzleImg: BaseComponent<HTMLImageElement>,
    cartonTexture: BaseComponent<HTMLImageElement>,
    standbyList: BaseComponent,
    onUpdate: () => void,
) => {
    const rows = round.words.length;
    const rowList: BaseComponent[] = [];
    const puzzleGrid: PuzzleComponent[][] = [];

    round.words.forEach((word, row) => {
        const rowElem = createComponent<HTMLElement>({
            tag: 'div',
            classList: mergeClassLists(style['board__row'], style['board__row_current']),
        });
        rowList.push(rowElem);
        const puzzleList: PuzzleComponent[] = [];
        word.textExample.split(' ').forEach((item, col, array) => {
            const { canvas, extra } = drawPuzzle(
                col,
                row,
                rows,
                word.textExample,
                puzzleImg.getNode(),
            );

            const cartonCanvas = drawPuzzle(
                col,
                row,
                rows,
                word.textExample,
                cartonTexture.getNode(),
            );
            const puzzle = puzzleComponent({
                baseDataImg: cartonCanvas.canvas.toDataURL('image/png'),
                additionalDataImg: canvas.toDataURL('image/png'),
                word: item,
                fieldRow: rowElem,
                standbyList,
                style: {
                    width: `${canvas.width - (array.length - 1 !== col ? extra : 0) + 0.5}px`,
                    height: `${canvas.height}px`,
                },
                onUpdate,
            });

            rowElem.getNode().style.height = `${canvas.height}px`;
            puzzleList.push(puzzle);
        });
        puzzleGrid.push([...puzzleList]);

        rowElem.appendChildren(puzzleList);
    });
    return { rowList, puzzleGrid };
};

export default fillBoard;
