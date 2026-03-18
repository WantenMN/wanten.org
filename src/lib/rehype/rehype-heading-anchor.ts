type HtmlNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
};

const HEADING_TAGS = new Set(["h2", "h3", "h4", "h5", "h6"]);

const isElementNode = (node: HtmlNode, tagName?: string) => {
  if (node.type !== "element") {
    return false;
  }

  if (!tagName) {
    return true;
  }

  return node.tagName === tagName;
};

const getTextContent = (node: HtmlNode): string => {
  if (node.type === "text") {
    return node.value ?? "";
  }

  if (!Array.isArray(node.children)) {
    return "";
  }

  return node.children.map((child) => getTextContent(child)).join("");
};

const slugify = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "section";
};

const toClassNameList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
};

const createAnchorNode = (id: string): HtmlNode => {
  return {
    type: "element",
    tagName: "a",
    properties: {
      className: ["heading-anchor"],
      href: `#${id}`,
      "aria-label": "Jump to section",
    },
    children: [
      {
        type: "text",
        value: "#",
      },
    ],
  };
};

const createHeadingContentNode = (children: HtmlNode[]): HtmlNode => {
  return {
    type: "element",
    tagName: "span",
    properties: {
      className: ["heading-content"],
    },
    children,
  };
};

export const rehypeHeadingAnchor = () => {
  return (tree: HtmlNode) => {
    const slugCounts = new Map<string, number>();

    const visitNode = (node: HtmlNode) => {
      if (!Array.isArray(node.children)) {
        return;
      }

      node.children.forEach((child) => {
        if (
          isElementNode(child) &&
          child.tagName &&
          HEADING_TAGS.has(child.tagName)
        ) {
          const headingText = getTextContent(child);
          const baseSlug = slugify(headingText);
          const count = slugCounts.get(baseSlug) ?? 0;
          const id = count === 0 ? baseSlug : `${baseSlug}-${count}`;
          slugCounts.set(baseSlug, count + 1);

          const currentProperties = child.properties ?? {};
          const currentClassNames = toClassNameList(currentProperties.className);
          child.properties = {
            ...currentProperties,
            id,
            className: [...currentClassNames, "heading-with-anchor"],
          };

          const currentChildren = Array.isArray(child.children)
            ? child.children
            : [];
          child.children = [
            createHeadingContentNode(currentChildren),
            createAnchorNode(id),
          ];
        }

        visitNode(child);
      });
    };

    visitNode(tree);
  };
};
