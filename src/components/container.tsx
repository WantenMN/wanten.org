import { ReactNode } from "react";

import Footer from "./footer";
import Navigation from "./navigation";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center">
      <div className="mt-8 w-full max-w-2xl">
        <Card className="p-4">
          <Navigation />
          <Separator />
          <main>{children}</main>
        </Card>
        <Footer />
      </div>
    </div>
  );
};

export default Container;
