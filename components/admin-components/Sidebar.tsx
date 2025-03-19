"use client";
import { adminSideBarLinks } from "@/contants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { RocketIcon } from "lucide-react";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  const sidebarLink = adminSideBarLinks(
    session?.user?.role === "admin" || false
  );

  return (
    <div className="flex flex-col justify-between h-full py-6 px-4 bg-white border-r border-gray-100 shadow-sm">
      {/* Logo and Branding Section */}
      <div>
        <div className="flex items-center gap-3">
          <Link
            className="flex flex-col md:flex-row gap-3 items-center justify-center"
            href={"/"}
          >
            <RocketIcon
              size={50}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-dark-400">
                Startup Pub
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links Section */}
        <div className="mt-10 flex flex-col gap-2">
          {sidebarLink.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isSelected
                      ? "bg-primary-admin text-white shadow-md"
                      : "hover:bg-gray-50 text-dark-400"
                  )}
                >
                  <div className="relative size-5">
                    <link.icon
                      size={20}
                      className={cn(
                        "transition-colors",
                        isSelected ? "text-white" : "text-gray-500"
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-white" : "text-dark-400"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-3 mt-auto bg-gray-50 rounded-lg">
        <Avatar>
          <AvatarFallback className="bg-amber-100 text-amber-800">
            {getInitials(session?.user?.fullName || "IN")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-400 text-sm">
            {session?.user?.fullName}
          </p>
          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
