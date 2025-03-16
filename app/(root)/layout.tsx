import { ReactNode } from "react";
import { Header } from "@/components/app-components/index";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header />
      </div>

      <div className="mt-20 pb-02">{children}</div>
    </main>
  );
};

export default Layout;
