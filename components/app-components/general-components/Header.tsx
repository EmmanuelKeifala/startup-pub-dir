"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
function Header() {
  const pathName = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/" className=" text-white">
        <Image
          src={"/logo.png"}
          alt="startup-pub-dir"
          width={100}
          height={100}
        />
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
