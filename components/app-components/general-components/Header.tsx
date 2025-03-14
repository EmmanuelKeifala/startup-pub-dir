"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

function Header() {
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if scrolled
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && visible && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY && !visible) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, visible]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-7xl py-8 flex justify-center items-center">
        <div
          className={cn(
            "relative flex items-center justify-center backdrop-blur-md rounded-full transition-all duration-300",
            scrolled
              ? "bg-black/60 shadow-lg px-16 py-4"
              : "bg-black/40 px-14 py-3"
          )}
        >
          <Link href="/" className="absolute left-6">
            <Image
              src={"/logo.png"}
              alt="startup-pub-dir"
              width={40}
              height={40}
              className="transition-transform hover:scale-105"
            />
          </Link>

          <nav className="flex-1 flex justify-center">
            <ul className="flex flex-row items-center gap-14">
              <li>
                <Link
                  href="/startUps"
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white",
                    pathName === "/startUps" ? "text-white" : "text-gray-300"
                  )}
                >
                  StartUps
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white",
                    pathName === "/explore" ? "text-white" : "text-gray-300"
                  )}
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white",
                    pathName === "/about" ? "text-white" : "text-gray-300"
                  )}
                >
                  About
                </Link>
              </li>

              <Link
                href="/contact"
                className="text-sm font-medium tracking-wide text-gray-300 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
