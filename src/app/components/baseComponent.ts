import removeDuplicates from '@utils/helpers/removeDuplicates.ts';

export type IProps<T extends HTMLElement = HTMLElement> = Partial<
Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
    tag?: keyof HTMLElementTagNameMap;
    classList?: TClassList;
    textContent?: string;
    children?: TChildren;
};

export type TClassList = string[] | string;
export type TChildren = (BaseComponent | string)[] | string | BaseComponent | undefined;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
    protected node: T;

    props: IProps<T>;

    protected children: BaseComponent[] = [];

    protected parent: BaseComponent | null = null;

    constructor(props: IProps<T>) {
        this.props = props;
        this.node = this.createNode(props);
    }

    rerender() {
        const { tag, classList, textContent, children, ...props } = this.props;
        this.node = Object.assign(this.node, props);
        if (classList) this.applyClassList(this.node, classList);
        if (textContent) this.node.textContent = textContent;
        if (children) this.children = this.appendChildrenToNode(this.node, children);
        this.children = removeDuplicates(this.children).filter((child) =>
            this.isChild(child),
        );
        this.children.forEach((child) => child.rerender());
    }

    protected createNode({
        tag,
        classList,
        textContent,
        children,
        ...props
    }: IProps<T>): T {
        this.props = { tag, classList, textContent, children, ...props } as IProps<T>;
        let node = document.createElement(tag ?? 'div') as T;
        node = Object.assign(node, props);
        if (classList) this.applyClassList(node, classList);
        if (textContent) node.textContent = textContent;
        if (children) this.children = this.appendChildrenToNode(node, children);
        this.children = removeDuplicates(this.children).filter((child) =>
            this.isChild(child),
        );
        return node;
    }

    isChild(child: BaseComponent): boolean {
        return child.parent === this;
    }

    public appendChildren(children: NonNullable<TChildren>): this {
        if (Array.isArray(children)) {
            children.forEach((child) => this.append(child));
        } else this.append(children);
        return this;
    }

    public append(child: BaseComponent | string): this {
        const addedNode = this.appendToNode(this.node, child);
        if (addedNode) this.children.push(addedNode);
        this.children = removeDuplicates(this.children).filter((child) =>
            this.isChild(child),
        );
        return this;
    }

    public addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): this {
        this.node.addEventListener(type, listener, options);
        return this;
    }

    log(): this {
        console.log(this);
        return this;
    }

    public getNode(): T {
        return this.node;
    }

    public getChildren(): BaseComponent[] {
        return this.children;
    }

    public addClass(classNameClassName: string): void {
        this.node.classList.add(classNameClassName);
    }

    public toggleClass(classSurname: string): void {
        this.node.classList.toggle(classSurname);
    }

    public removeClass(className: string): void {
        this.node.classList.remove(className);
    }

    public destroy(): void {
        this.children.forEach((child) => child.destroy());
        this.node.remove();
    }

    private applyClassList(node: T, classList: TClassList): void {
        if (typeof classList === 'string') node.classList.add(classList);
        else node.classList.add(...classList);
    }

    private appendChildrenToNode(
        node: T,
        children: NonNullable<TChildren>,
    ): BaseComponent[] | [] {
        const result: BaseComponent[] = [];
        if (Array.isArray(children))
            children.forEach((child) => {
                const addedNode = this.appendToNode(node, child);
                if (addedNode) result.push(addedNode);
            });
        else {
            const addedNode = this.appendToNode(node, children);
            if (addedNode !== undefined) result.push(addedNode);
        }
        return result;
    }

    private appendToNode(
        node: T,
        child: BaseComponent | string,
    ): BaseComponent | undefined {
        if (typeof child === 'string') {
            node.append(document.createTextNode(child));
            return;
        }
        child.setParent(this);
        node.append(child.node);
        return child;
    }

    private setParent(parent: BaseComponent): void {
        this.parent = parent;
    }
}

export type FunctionComponent<
    ElementType extends HTMLElement = HTMLElement,
    AdditionalProps = NonNullable<unknown>,
> = (props: IProps<ElementType> & AdditionalProps) => BaseComponent<ElementType>;
const createComponent = <ElementType extends HTMLElement = HTMLElement>(
    props: IProps<ElementType>,
) => new BaseComponent<ElementType>(props);
export default createComponent;
