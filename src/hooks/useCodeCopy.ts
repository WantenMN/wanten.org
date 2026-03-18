import type { MouseEvent } from "react";

import { copyText } from "@/lib/copy";

const COPY_RESET_MS = 1500;

export const useCodeCopy = () => {
  const handleMarkdownClick = async (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
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
    }, COPY_RESET_MS);

    button.dataset.resetTimer = String(resetTimer);
  };

  return handleMarkdownClick;
};
