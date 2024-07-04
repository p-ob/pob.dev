import { parseHTML } from "linkedom";

function generateId(element, slugify, ids = []) {
	let id;
  let result = (id = slugify(element.textContent).replace(/[&,+()$~%.'":*?!<>{}]/g, ""));
  let i = 0;
  while (ids.includes(result)) {
    result = `${id}-${++i}`;
  }

  ids.push(result);
  return result;
}

function computeHeadingLevelFromElement(element) {
  if (element.tagName.length === 2 && element.tagName.startsWith("H")) {
    return parseInt(element.tagName[1]);
  }
  return -1;
}

function buildHeadingTree(elements, currentHeadingLevel, slugify, ids = []) {
  const tree = [];
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const headingLevel = computeHeadingLevelFromElement(element);
    if (headingLevel === -1) {
      continue;
    }
    if (headingLevel === currentHeadingLevel) {
      const id = generateId(element, slugify, ids);
      element.setAttribute("id", id);
      tree.push({
        id,
        title: element.textContent,
        href: `#${id}`,
        items: buildHeadingTree(elements.slice(i + 1), headingLevel + 1, slugify, ids),
      });
    } else if (headingLevel < currentHeadingLevel) {
      break;
    }
  }

  return tree;
}

function appendNavigationLinks(container, navigationTree, document) {
	for (const item of navigationTree) {
		const li = document.createElement("li");
		const a = document.createElement("a");
		a.textContent = item.title;
		a.href = item.href;
		a.id = item.id;
		li.appendChild(a);
		if (item.items.length > 0) {
			const ol = document.createElement("ol");
			appendNavigationLinks(ol, item.items, document);
			li.appendChild(ol);
		}
		container.appendChild(li);
	}
}

export function TableOfContentsPlugin(eleventyConfig, options) {
  const parent = options.parent ?? "body";

  eleventyConfig.addTransform("tableOfContents", (rawContent, outputPath) => {
    if (outputPath && !outputPath.endsWith(".html")) {
      return rawContent;
    }

		const { document } = parseHTML(rawContent);
		const parentEl = document.querySelector(parent);
		if (!parentEl) {
			return rawContent;
		}

		const headingElements = document.querySelectorAll("h2, h3, h4, h5, h6");
		const headingTree = buildHeadingTree(headingElements, 2, eleventyConfig.javascriptFunctions.slug);

		if (headingTree.length === 0) {
			parentEl.remove();
			return document.toString();
		}

		const toc = document.createElement("ol");
		appendNavigationLinks(toc, headingTree, document);
		parentEl.appendChild(toc);
		return document.toString();
  });
}
