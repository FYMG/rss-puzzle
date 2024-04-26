import createComponent, {
    BaseComponent,
    FunctionComponent,
    IProps,
} from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';

import applyDragEvents from '@components/puzzle/puzzelComponentEvents';
import style from './puzzle.module.scss';

export class PuzzleComponent extends BaseComponent {
    public word: string;

    private readonly baseSrc: string;

    private readonly additionalSrc: string;

    public disabled: boolean;

    public imageComponent: BaseComponent<HTMLImageElement>;

    constructor(
        word: string,
        baseSrc: string,
        additionalSrc: string,
        imageComponent: BaseComponent<HTMLImageElement>,
        props: IProps,
        disabled = false,
    ) {
        super(props);
        this.word = word;
        this.baseSrc = baseSrc;
        this.additionalSrc = additionalSrc;
        this.imageComponent = imageComponent;
        this.disabled = disabled;
    }

    public validate(word: string) {
        this.removeValidation();
        if (this.word === word) {
            this.node.classList.add(style['puzzle_valid-good'] ?? '');
        } else {
            this.node.classList.add(style['puzzle_valid-bad'] ?? '');
        }

        return this.word === word;
    }

    public removeValidation() {
        this.node.classList.remove(style['puzzle_valid-bad'] ?? '');
        this.node.classList.remove(style['puzzle_valid-good'] ?? '');
    }

    public useBaseSrc() {
        this.imageComponent.getNode().src = this.baseSrc;
    }

    public useAdditionalSrc() {
        this.imageComponent.getNode().src = this.additionalSrc;
    }
}

export interface IPuzzleComponentProps {
    baseDataImg: string;
    additionalDataImg: string;
    word: string;
    fieldRow: BaseComponent;
    standbyList: BaseComponent;
    onUpdate?: () => void;
}

const puzzleComponent: FunctionComponent<
    HTMLElement,
    IPuzzleComponentProps,
    PuzzleComponent
> = ({
    baseDataImg,
    additionalDataImg,
    onUpdate,
    word,
    fieldRow,
    standbyList,
    classList,
    children,
    ...props
}) => {
    const puzzleText = createComponent<HTMLElement>({
        tag: 'span',
        classList: style['puzzle__text'],
        textContent: word,
    });

    const puzzleTextWrapper = createComponent<HTMLElement>({
        tag: 'div',
        classList: style['puzzle__text-wrapper'],
        children: [puzzleText],
    });

    const puzzleImg = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: mergeClassLists(style['puzzle__img'], classList),
        children,
        src: baseDataImg,
    });
    const puzzle = new PuzzleComponent(word, baseDataImg, additionalDataImg, puzzleImg, {
        tag: 'div',
        classList: style['puzzle'],
        children: mergeChildrenLists(puzzleImg, puzzleTextWrapper, children),
        draggable: false,
        ...props,
    }).addEventListener('click', () => {
        if (puzzle.disabled) {
            return;
        }
        if (fieldRow.haveChildren(puzzle)) {
            standbyList.append(puzzle);
        } else {
            fieldRow.append(puzzle);
        }
        onUpdate?.();
    });
    applyDragEvents(puzzle, standbyList, fieldRow, onUpdate);

    return puzzle;
};
export default puzzleComponent;
