import { useEffect } from "react";

const useLazyLoadCSS = (href: string) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => console.log("Stylesheet loaded");
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [href]);
};

export default useLazyLoadCSS;
