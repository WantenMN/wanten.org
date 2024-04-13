import { ReactNode } from "react";

import Footer from "./footer";
import Navigation from "./navigation";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex min-h-[104vh] w-full max-w-4xl flex-col rounded border-zinc-200 bg-white p-4 sm:m-4 sm:border">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;
