"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RocketIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

function Header() {
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data: session } = useSession();

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
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl py-4 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={cn(
            "relative flex items-center justify-between backdrop-blur-lg rounded-full shadow-lg transition-all duration-300 px-8 py-2 w-full max-w-5xl",
            scrolled ? "bg-black/80 shadow-xl" : "bg-black/50"
          )}
        >
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RocketIcon size={24} className="text-blue-500" />
            </motion.div>
            <span className="text-lg md:text-xl font-bold text-white tracking-wide">
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
                {
                  href: `${session?.user ? "/profile" : "/sign-in"}`,
                  label: `${session?.user ? "Profile" : "Sign In"}`,
                },
              ].map(({ href, label }) => (
                <motion.li
                  key={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white",
                      pathName === href
                        ? "text-white border-b-2 border-blue-500"
                        : "text-gray-300"
                    )}
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
              <Link href={"/profile"}>
                <Avatar>
                  <AvatarImage src="XXXXXXXXXXXXXXXXXXXXXXXXXXXXX" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </ul>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Header;
