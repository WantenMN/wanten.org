import type { MouseEvent } from "react";

import { copyText } from "@/lib/copy";

export const useCodeCopy = () => {
  const handleMarkdownClick = async (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;

    const headingAnchor = target.closest<HTMLAnchorElement>(".heading-anchor");
    if (headingAnchor) {
      event.preventDefault();

      const id = headingAnchor.getAttribute("href")?.slice(1);
      if (!id) {
        return;
      }

      const heading = document.getElementById(id);
      if (!heading) {
        return;
      }

      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      window.history.replaceState(null, "", `#${id}`);
      heading.scrollIntoView();
      await copyText(url);
      return;
    }

    const button = target.closest<HTMLButtonElement>(".copy-code-button");
    if (!button) {
      return;
    }

    const block = button.closest(".code-block");
    const pre = block?.querySelector("pre");
    const code = pre?.querySelector("code");
    const text = code?.textContent?.trim() ?? "";
    if (!text) {
      return;
    }

    const copied = await copyText(text);
    if (!copied) {
      return;
    }

    button.dataset.state = "copied";
    const activeResetTimer = button.dataset.resetTimer;
    if (activeResetTimer) {
      clearTimeout(Number(activeResetTimer));
    }

    const resetTimer = window.setTimeout(() => {
      button.dataset.state = "idle";
      delete button.dataset.resetTimer;
    }, 1500);

    button.dataset.resetTimer = String(resetTimer);
  };

  return handleMarkdownClick;
};
