import { ReactNode } from "react";

import Footer from "./footer";
import Navigation from "./navigation";
import { Separator } from "./ui/separator";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-xl flex-col rounded p-4">
        <Navigation />
        <Separator />
        <main className="min-h-screen flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;
