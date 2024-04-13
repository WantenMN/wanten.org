import { ReactNode } from "react";

import Footer from "./footer";
import Navigation from "./navigation";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <div className="flex w-full max-w-4xl flex-1 flex-col rounded rounded-b-none border-zinc-200 bg-white p-4 sm:m-4 sm:mb-0 sm:border sm:border-b-0">
          <Navigation />
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Container;
