import { BaseComponent } from '@components/baseComponent.ts';
import { PuzzleComponent } from '@components/puzzle/puzzleComponent';
import style from './puzzle.module.scss';

const applyDragEvents = (
    component: PuzzleComponent,
    standbyList: BaseComponent,
    fieldRow: BaseComponent,
    dragOnCallback?: () => void,
): void => {
    let startX = 0;
    let startY = 0;
    let dragging = false;

    const dragStart = (e: MouseEvent | TouchEvent): void => {
        if (component.disabled) {
            return;
        }
        const node = component.getNode();
        const fantomNode = node.cloneNode(true) as HTMLElement;
        fantomNode?.classList.add(style['puzzle_fantom'] ?? '');
        const nodeStyle = window.getComputedStyle(node);
        let nodeUnderPointer: Element | null;
        const translateX = parseInt(nodeStyle.getPropertyValue('--puzzle-x'), 10);
        const translateY = parseInt(nodeStyle.getPropertyValue('--puzzle-y'), 10);

        startX = 0;
        startY = 0;
        if (e instanceof TouchEvent) {
            startX =
                node.parentElement?.getBoundingClientRect().x ??
                e.touches[0]!.pageX - translateX;
            startY =
                node.parentElement?.getBoundingClientRect().y ??
                e.touches[0]!.pageY - translateY;
        }
        if (e instanceof MouseEvent) {
            startX =
                node.parentElement?.getBoundingClientRect().x ?? e.pageX - translateX;
            startY =
                node.parentElement?.getBoundingClientRect().y ?? e.pageY - translateY;
        }

        let lastX = startX;
        let lastY = startY;

        const dragMove = (eMove: MouseEvent | TouchEvent) => {
            let pageX = 0;
            let clientX = 0;
            let pageY = 0;
            let clientY = 0;
            if (eMove instanceof TouchEvent) {
                pageX = eMove.touches[0]!.pageX;
                clientX = eMove.touches[0]!.clientX;
                pageY = eMove.touches[0]!.pageY;
                clientY = eMove.touches[0]!.clientY;
            }
            if (eMove instanceof MouseEvent) {
                pageX = eMove.pageX;
                clientX = eMove.clientX;
                pageY = eMove.pageY;
                clientY = eMove.clientY;
            }
            if (Math.abs(pageY - startY) < 10 && Math.abs(pageX - startX) < 10) {
                return;
            }
            dragging = true;

            nodeUnderPointer = document.elementFromPoint(clientX, clientY);
            node.style.setProperty('position', `absolute`);
            node.style.setProperty('--puzzle-x', `${pageX - startX}px`);
            node.style.setProperty('--puzzle-y', `${pageY - startY}px`);
            node.style.setProperty('pointer-events', `none`);
            node.style.setProperty('z-index', `2`);

            if (
                (Math.abs(lastX - pageX) < 10 && Math.abs(lastY - pageY) < 10) ||
                nodeUnderPointer?.isEqualNode(fantomNode)
            ) {
                return;
            }
            lastX = pageX;
            lastY = pageY;
            if (
                nodeUnderPointer &&
                (standbyList.isNode(nodeUnderPointer) ||
                    fieldRow.isNode(nodeUnderPointer))
            ) {
                nodeUnderPointer.append(fantomNode);
            } else if (
                nodeUnderPointer &&
                !nodeUnderPointer.isEqualNode(node) &&
                nodeUnderPointer.classList.contains(style['puzzle'] ?? '') &&
                (standbyList.haveChildrenNode(nodeUnderPointer) ||
                    fieldRow.haveChildrenNode(nodeUnderPointer))
            ) {
                const isLeftSide =
                    Math.abs(nodeUnderPointer.getBoundingClientRect().left - pageX) <=
                    nodeUnderPointer.clientWidth / 2;
                if (isLeftSide) {
                    nodeUnderPointer.before(fantomNode);
                } else {
                    nodeUnderPointer.after(fantomNode);
                }
            } else {
                fantomNode.remove();
            }
        };

        const dragEnd = () => {
            document.body.removeEventListener('mousemove', dragMove);
            document.body.removeEventListener('mouseup', dragEnd);
            document.body.removeEventListener('touchmove', dragMove);
            document.body.removeEventListener('touchend', dragEnd);
            if (dragging) {
                if (standbyList.haveChildrenNode(fantomNode)) {
                    standbyList.append(component);
                }
                if (fieldRow.haveChildrenNode(fantomNode)) {
                    fieldRow.append(component);
                }
                fantomNode.replaceWith(node);
                fantomNode.remove();
                node.style.setProperty('--puzzle-x', `${0}px`);
                node.style.setProperty('--puzzle-y', `${0}px`);
                node.style.setProperty('z-index', `0`);
                node.style.setProperty('pointer-events', `auto`);
                node.style.setProperty('position', `relative`);
                dragOnCallback?.();
            }
            dragging = false;
        };

        document.body.addEventListener('touchmove', dragMove);
        document.body.addEventListener('touchend', dragEnd);
        document.body.addEventListener('mousemove', dragMove);
        document.body.addEventListener('mouseup', dragEnd);
    };

    component.addEventListener('touchstart', dragStart);
    component.addEventListener('mousedown', dragStart);
};

export default applyDragEvents;
