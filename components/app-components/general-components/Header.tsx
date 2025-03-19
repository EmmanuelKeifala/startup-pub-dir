"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn, getInitials } from "@/lib/utils";
import { RocketIcon, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session, update } = useSession();
  const pathName = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathName]);

  const navItems = [
    { href: "/startUps", label: "StartUps" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    {
      href: "/register",
      label: session?.user?.role === "startup_owner" && "Register",
    },
    {
      href: "/admin",
      label:
        session?.user?.role !== "admin" ? "Manage Startups" : "Manage Startup",
    },
    {
      href: "/sign-in",
      label: !session?.user?.role && "Sign In",
    },
  ].filter((item) => item.label);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className={cn(
            "relative flex items-center justify-between backdrop-blur-lg rounded-full shadow-lg transition-all duration-300 px-4 sm:px-8 py-2 w-full max-w-5xl",
            scrolled
              ? "bg-black/80 shadow-xl"
              : "bg-gradient-to-r from-black/50 to-blue-900/30"
          )}
        >
          <Link href="/" className="flex items-center gap-2 sm:gap-3 z-10">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <RocketIcon size={24} className="text-blue-500" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md -z-10"
              />
            </motion.div>
            <span className="text-lg md:text-xl font-bold text-white tracking-wide">
              Startup Pub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-end">
            <ul className="flex flex-row items-center gap-6">
              {navItems.map(({ href, label }) => (
                <motion.li
                  key={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white relative group",
                      pathName === href ? "text-white" : "text-gray-300"
                    )}
                  >
                    {label}
                    <motion.span
                      className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300",
                        pathName === href ? "w-full" : "w-0"
                      )}
                    />
                  </Link>
                </motion.li>
              ))}
              {session && (
                <>
                  <Link href={"/profile"}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar className="border-2 border-blue-500/50 hover:border-blue-500 transition-all duration-300">
                        <AvatarImage src={`${session?.user.profilePicture}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800">
                          {getInitials(session?.user.fullName as string)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Link>
                  <motion.li
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2 text-sm font-medium tracking-wide text-gray-300 transition-colors duration-200 hover:text-white"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-200 hover:text-white transition-colors z-10"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-black/90 backdrop-blur-lg shadow-lg overflow-hidden md:hidden"
              >
                <div className="px-4 py-6">
                  <nav>
                    <ul className="flex flex-col gap-4">
                      {navItems.map(({ href, label }) => (
                        <motion.li
                          key={href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={href}
                            className={cn(
                              "block text-sm font-medium tracking-wide py-2 px-4 rounded-md transition-colors duration-200 hover:bg-blue-900/30",
                              pathName === href
                                ? "text-white bg-blue-800/30 border-l-2 border-blue-500"
                                : "text-gray-300"
                            )}
                          >
                            {label}
                          </Link>
                        </motion.li>
                      ))}
                      {session && (
                        <>
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 text-sm font-medium tracking-wide text-gray-300 py-2 px-4 rounded-md transition-colors duration-200 hover:bg-blue-900/30"
                            >
                              <Avatar className="h-6 w-6 border border-blue-500/50">
                                <AvatarImage
                                  src={`${session?.user.profilePicture}`}
                                />
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-blue-800">
                                  {getInitials(
                                    session?.user.fullName as string
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span>Profile</span>
                            </Link>
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                          >
                            <button
                              onClick={handleLogOut}
                              className="flex w-full items-center gap-3 text-sm font-medium tracking-wide text-gray-300 py-2 px-4 rounded-md transition-colors duration-200 hover:bg-blue-900/30"
                            >
                              <LogOut size={16} />
                              <span>Logout</span>
                            </button>
                          </motion.li>
                        </>
                      )}
                    </ul>
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Header;
