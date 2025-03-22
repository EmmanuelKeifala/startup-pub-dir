"use client";
import React, { useRef, useState, FC } from "react";
import {
  SearchIcon,
  CheckIcon,
  XIcon,
  MoreHorizontalIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import db from "@/database/drizzle";
import { startups } from "@/database/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

type StartupStatus = "pending" | "approved" | "rejected";

interface Startup {
  id: string;
  name: string;
  categoryName: string;
  description: string;
  location: string;
  rating: number;
  email: string;
  status: StartupStatus;
}

interface StartupTableProps {
  data: Startup[];
  type: "pending" | "approved" | "rejected" | "all";
}

const StartupTable: FC<StartupTableProps> = ({ data, type }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchColumn, setSearchColumn] = useState<string>("name");
  const tableRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  const validData = Array.isArray(data) ? data : [];

  const filteredData = validData.filter((item) => {
    if (!searchText) return true;

    const searchValue = item[searchColumn as keyof Startup];
    if (typeof searchValue === "string") {
      return searchValue.toLowerCase().includes(searchText.toLowerCase());
    }
    return false;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleApprove = async (startup: Startup): Promise<void> => {
    try {
      await db
        .update(startups)
        .set({
          status: "approved",
        })
        .where(eq(startups.id, startup.id));

      toast.success(`Startup ${startup.name} approved!`);
    } catch (error) {
      console.error("Error approving startup:", error);
      toast.error("Failed to approve startup. Please try again.");
    }
  };

  const handleReject = async (startup: Startup): Promise<void> => {
    try {
      await db
        .update(startups)
        .set({
          status: "rejected",
        })
        .where(eq(startups.id, startup.id));

      toast.success(`Startup ${startup.name} rejected!`);
    } catch (error) {
      console.error("Error rejecting startup:", error);
      toast.error("Failed to reject startup. Please try again.");
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const starChar = "★";
    const emptyStarChar = "☆";

    let stars = starChar.repeat(fullStars);
    if (decimal >= 0.5) stars += "½";
    const remaining = 5 - Math.ceil(rating);
    if (remaining > 0) stars += emptyStarChar.repeat(remaining);

    return (
      <span className="text-amber-500 text-base">
        {stars}{" "}
        <span className="text-gray-500 text-sm">({rating.toFixed(1)})</span>
      </span>
    );
  };

  const getStatusBadge = (status: StartupStatus) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status];

    return (
      <Badge className={`${config.color} px-3 py-1 rounded-full`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div
      className="max-w-6xl mx-auto rounded-xl shadow-md border border-gray-200 overflow-hidden"
      ref={tableRef}
    >
      <div className="bg-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === "pending"
              ? "Pending Startups"
              : type === "approved"
              ? "Approved Startups"
              : type === "rejected"
              ? "Rejected Startups"
              : "All Startups"}
          </h2>
          <div className="w-full md:w-auto flex items-center gap-2">
            <select
              className="bg-white border border-gray-300 rounded-lg text-gray-700 px-3 py-2"
              onChange={(e) => setSearchColumn(e.target.value)}
              value={searchColumn}
            >
              <option value="name">Name</option>
              <option value="categoryName">Category</option>
              <option value="location">Location</option>
              <option value="email">Email</option>
            </select>
            <div className="relative flex-1 md:w-64">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search by ${searchColumn}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 bg-white border-gray-300 text-gray-700 w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Category</TableHead>
                <TableHead className="text-gray-700">Description</TableHead>
                <TableHead className="text-gray-700">Location</TableHead>
                <TableHead className="text-gray-700">Rating</TableHead>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((startup) => (
                  <TableRow
                    key={startup.id}
                    className={
                      startup.status === "approved"
                        ? "bg-green-50 hover:bg-green-100"
                        : startup.status === "rejected"
                        ? "bg-red-50 hover:bg-red-100"
                        : "hover:bg-gray-50"
                    }
                  >
                    <TableCell className="text-gray-800 font-medium">
                      <div className="flex items-center space-x-3">
                        <span>{startup.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                        {startup.categoryName}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs text-gray-700">
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="block truncate w-40">
                            {startup.description}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-lg bg-white text-gray-800">
                          {startup.description}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center space-x-1">
                        <span className="text-base">📍</span>
                        <span>{startup.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRatingStars(startup.rating)}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${startup.email}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {startup.email}
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(startup.status)}</TableCell>
                    <TableCell>
                      {type === "pending" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-800"
                            >
                              <MoreHorizontalIcon className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white text-gray-800 border-gray-200">
                            <DropdownMenuItem className="focus:bg-gray-100">
                              <Link
                                href={`/startup/${startup.id}`}
                                className="flex items-center"
                              >
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {startup.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="focus:bg-gray-100"
                                  onClick={() => handleApprove(startup)}
                                >
                                  <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="focus:bg-gray-100"
                                  onClick={() => handleReject(startup)}
                                >
                                  <XIcon className="mr-2 h-4 w-4 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          asChild
                        >
                          <Link href={`/startup/${startup.id}`}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="text-gray-400 text-3xl mb-4">📊</div>
                      <div className="text-gray-700 text-xl mb-2 font-semibold">
                        No data available
                      </div>
                      <p className="text-gray-500">
                        No startup data found. Please add some startups or
                        adjust your search.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-4 text-gray-700">
            <div>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  className={
                    currentPage === index + 1
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupTable;
