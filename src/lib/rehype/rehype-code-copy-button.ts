type HtmlNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
};

const isElementNode = (node: HtmlNode, tagName?: string) => {
  if (node.type !== "element") {
    return false;
  }

  if (!tagName) {
    return true;
  }

  return node.tagName === tagName;
};

const hasClassName = (node: HtmlNode, className: string) => {
  if (!node.properties) {
    return false;
  }

  const classes = node.properties.className;
  return Array.isArray(classes) && classes.includes(className);
};

const createCopyButtonNode = (): HtmlNode => {
  return {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      className: ["copy-code-button"],
      "data-state": "idle",
      "aria-label": "Copy code",
      title: "Copy code",
    },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          className: ["copy-code-icon", "copy-code-icon-copy"],
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
        },
        children: [
          {
            type: "element",
            tagName: "rect",
            properties: {
              x: "9",
              y: "9",
              width: "13",
              height: "13",
              rx: "2",
              ry: "2",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
            },
            children: [],
          },
        ],
      },
      {
        type: "element",
        tagName: "svg",
        properties: {
          className: ["copy-code-icon", "copy-code-icon-check"],
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "M20 6 9 17l-5-5",
            },
            children: [],
          },
        ],
      },
    ],
  };
};

const createCodeBlockNode = (preNode: HtmlNode): HtmlNode => {
  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["code-block"],
    },
    children: [createCopyButtonNode(), preNode],
  };
};

export const rehypeCodeCopyButton = () => {
  return (tree: HtmlNode) => {
    const visitNode = (node: HtmlNode) => {
      if (!Array.isArray(node.children)) {
        return;
      }

      node.children = node.children.map((child) => {
        if (isElementNode(child, "div") && hasClassName(child, "code-block")) {
          return child;
        }

        if (!isElementNode(child, "pre")) {
          visitNode(child);
          return child;
        }

        const preChildren = Array.isArray(child.children) ? child.children : [];
        const hasCode = preChildren.some((preChild) =>
          isElementNode(preChild, "code")
        );

        if (!hasCode) {
          return child;
        }

        return createCodeBlockNode(child);
      });
    };

    visitNode(tree);
  };
};
