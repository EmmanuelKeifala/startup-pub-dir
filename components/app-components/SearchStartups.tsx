"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import StartUpList from "./StartUpList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { searchStartupsAction } from "@/actions/search";
import { eq } from "drizzle-orm";
import db from "@/database/drizzle";
import { startups } from "@/database/schema";

// Define types for our data and props
interface Startup {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  logo: string | null;
  video: string | null;
  companyColors: string | null;
  status: "pending" | "approved" | "rejected";
  rating: number | null;
  categoryId: string | null;
  categoryName: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface SearchFilters {
  categoryId?: string;
  location?: string;
  minRating?: number;
}

interface Props {
  defaultValues: Startup[];
}

const SearchStartups = ({ defaultValues }: Props) => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    categoryId: "",
    location: "",
    minRating: "",
  });
  const [results, setResults] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const displayedStartups = useMemo(() => {
    return results.length > 0 ? results : defaultValues;
  }, [results, defaultValues]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;

      return (params: typeof searchParams) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (
            !params.query &&
            !params.categoryId &&
            !params.location &&
            !params.minRating
          ) {
            setResults([]);
            return;
          }

          setLoading(true);
          try {
            const filters: SearchFilters = {
              ...(params.categoryId &&
                params.categoryId !== "all" && {
                  categoryId: params.categoryId,
                }),
              ...(params.location &&
                params.location !== "all" && { location: params.location }),
              ...(params.minRating &&
                params.minRating !== "any" && {
                  minRating: Number(params.minRating),
                }),
            };
            const data = await searchStartupsAction(params.query, filters);
            setResults(data);
          } catch (error) {
            console.error("Error searching startups:", error);
          } finally {
            setLoading(false);
          }
        }, 300);
      };
    })(),
    []
  );

  const handleInputChange = (
    field: keyof typeof searchParams,
    value: string
  ) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
  };

  // Load categories and locations on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesResponse = await fetch("/api/categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

        const locationsResult = await db
          .select({ location: startups.location })
          .from(startups);
        //   .where(eq(startups.status, "approved")); TODO: later when the admin is ready this will be ready

        const uniqueLocations = Array.from(
          new Set(locationsResult.map((item) => item.location).filter(Boolean))
        ).sort();

        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setCategories([
          { id: "1", name: "Fintech" },
          { id: "2", name: "Healthcare" },
          { id: "3", name: "E-commerce" },
          { id: "4", name: "AI/ML" },
          { id: "5", name: "SaaS" },
        ]);
      }
      setIsInitialRender(false);
    };

    loadInitialData();

    return () => {};
  }, []);

  useEffect(() => {
    if (!isInitialRender) {
      debouncedSearch(searchParams);
    }
  }, [searchParams, debouncedSearch, isInitialRender]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debouncedSearch(searchParams);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const clearFilters = () => {
    setSearchParams({
      query: "",
      categoryId: "",
      location: "",
      minRating: "",
    });
    setResults([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-bebas-neue text-3xl sm:text-4xl text-light-100">
          Discover Startups
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Find innovative startups across various industries and locations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search bar */}
        <div className="relative flex min-h-14 w-full items-center rounded-xl bg-dark-300 px-4 shadow-sm transition-all">
          <Search className="h-5 w-5 text-light-100 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Search innovative startups..."
            value={searchParams.query}
            onChange={(e) => handleInputChange("query", e.target.value)}
            className="w-full border-none font-bold placeholder:font-normal text-white placeholder:text-light-100 focus-visible:ring-0 focus-visible:shadow-none bg-transparent py-3 pl-2"
            aria-label="Search startups"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={toggleFilters}
            className="flex items-center gap-2 text-light-100 transition-colors flex-shrink-0"
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            <Filter className="h-5 w-5" />
            <span className="hidden md:inline">
              {showFilters ? "Hide" : "Show"} Filters
            </span>
          </Button>
        </div>

        <div
          id="filters-panel"
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Card className="bg-dark-300 border-none shadow-md">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-light-100"
                  >
                    Category
                  </Label>
                  <Select
                    value={searchParams.categoryId}
                    onValueChange={(value) =>
                      handleInputChange("categoryId", value)
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="w-full bg-dark-400 border-none text-white"
                    >
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 border-dark-500 text-white max-h-72">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-light-100"
                  >
                    Location
                  </Label>
                  <Select
                    value={searchParams.location}
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger
                      id="location"
                      className="w-full bg-dark-400 border-none text-white"
                    >
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 border-dark-500 text-white max-h-72">
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="rating"
                    className="text-sm font-medium text-light-100"
                  >
                    Minimum Rating
                  </Label>
                  <Select
                    value={searchParams.minRating}
                    onValueChange={(value) =>
                      handleInputChange("minRating", value)
                    }
                  >
                    <SelectTrigger
                      id="rating"
                      className="w-full bg-dark-400 border-none text-white"
                    >
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 border-dark-500 text-white">
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="1">1+ Stars</SelectItem>
                      <SelectItem value="2">2+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className=" border-light-100 hover:bg-dark-400"
                >
                  Clear All
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {!showFilters && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search
            </Button>
          </div>
        )}
      </form>

      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-light-100">Searching for startups...</p>
          </div>
        ) : (
          <StartUpList
            containerClassName="fade-in"
            startups={displayedStartups}
            title={results.length > 0 ? "Search Results" : "Featured Startups"}
          />
        )}

        {!loading && results.length === 0 && searchParams.query && (
          <div className="text-center py-8">
            <p className="text-light-100 text-lg">
              No startups found matching your criteria.
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStartups;
