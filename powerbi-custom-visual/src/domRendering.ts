/**
 * Build DOM nodes from VitaNova's presentation templates without assigning
 * innerHTML/outerHTML. All interpolated business labels must be escaped by
 * appRuntime.ts:q() before they are included in a template.
 * Scripts parsed using DOMParser remain inert.
 */
export function renderMarkup(target: Element, markup: string): void {
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    const nodes = Array.from(parsed.body.childNodes).map((node) =>
        document.importNode(node, true));
    target.replaceChildren(...nodes);
}
