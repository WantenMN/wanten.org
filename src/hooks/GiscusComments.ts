import { useEffect } from "react";
import { useTheme } from "next-themes";

const GiscusComments = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.setAttribute("data-repo", "WantenMN/wanten.org");
    script.setAttribute("data-repo-id", "R_kgDOLmluLw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOLmluL84Ceq21");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [theme]);
};

export default GiscusComments;
