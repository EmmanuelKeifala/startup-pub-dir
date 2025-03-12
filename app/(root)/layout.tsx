import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <span>Header</span>
      </div>

      <div className="mt-20 pb-02">{children}</div>
    </main>
  );
};

export default Layout;
