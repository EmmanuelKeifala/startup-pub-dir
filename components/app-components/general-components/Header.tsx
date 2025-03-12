"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
function Header() {
  const pathName = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/" className=" text-white">
        {/* TODO: add an actual icon here */}
        StartUp Public Directory
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/startUps"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathName === "/startUps" ? "text-light-200" : "text-light-100"
            )}
          >
            StartUps
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
