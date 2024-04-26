import { BaseComponent } from '../baseComponent.ts';
import { PuzzleComponent } from './puzzleComponent';
declare const applyDragEvents: (component: PuzzleComponent, standbyList: BaseComponent, fieldRow: BaseComponent, dragOnCallback?: () => void) => void;
export default applyDragEvents;
