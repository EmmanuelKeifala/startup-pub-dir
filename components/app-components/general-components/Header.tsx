"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RocketIcon } from "lucide-react";

function Header() {
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);
      setVisible(currentScrollY < lastScrollY || currentScrollY < 100);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-7xl py-4 flex justify-center items-center">
        <div
          className={cn(
            "relative flex items-center justify-between backdrop-blur-lg rounded-full shadow-lg transition-all duration-300 px-8 py-2 w-full max-w-5xl",
            scrolled ? "bg-black/70" : "bg-black/40"
          )}
        >
          <Link href="/" className="flex items-center gap-2">
            <RocketIcon size={24} className="text-blue-500" />
            <span className="text-lg md:text-xl font-bold text-white">
              Startup Pub
            </span>
          </Link>

          <nav className="flex-1 flex justify-end">
            <ul className="flex flex-row items-center gap-6">
              {[
                { href: "/startUps", label: "StartUps" },
                { href: "/explore", label: "Explore" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white",
                      pathName === href ? "text-white" : "text-gray-300"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
