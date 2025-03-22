"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
  Search,
} from "lucide-react";

// Define the Job type based on the database schema
export interface Job {
  id: string;
  startupId: string;
  title: string;
  description: string;
  requirements?: string;
  salary?: string;
  jobType?: string;
  location: string;
  contactEmail: string;
  postedAt: Date;
  expiresAt?: Date;
  // Include startup information for display
  startup?: {
    name: string;
    logo?: string;
  };
}

interface JobListingsProps {
  initialJobs: Job[];
  jobTypes: string[]; // ['Full-time', 'Part-time', 'Remote', etc.]
  locations: string[]; // Unique locations from jobs
}

function JobListings({ initialJobs, jobTypes, locations }: JobListingsProps) {
  const [jobs, _setJobs] = useState<Job[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || job.jobType === selectedType;
    const matchesLocation =
      selectedLocation === "all" || job.location.includes(selectedLocation);

    return matchesSearch && matchesType && matchesLocation;
  });

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days remaining until expiration
  const getDaysRemaining = (expiresAt?: Date) => {
    if (!expiresAt) return null;

    const today = new Date();
    const expDate = new Date(expiresAt);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  // Get badge color based on job type
  const getJobTypeBadgeColor = (jobType?: string) => {
    switch (jobType?.toLowerCase()) {
      case "full-time":
        return "bg-indigo-600";
      case "part-time":
        return "bg-amber-600";
      case "remote":
        return "bg-emerald-600";
      case "contract":
        return "bg-sky-600";
      case "internship":
        return "bg-violet-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full text-white shadow-xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-[#12141d] to-[#12151f] border-indigo-500/10">
        <CardHeader className="border-b border-white/10 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Available Opportunities
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-8">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="col-span-1 md:col-span-1">
                <div className="relative">
                  <Input
                    placeholder="Search jobs..."
                    className="bg-white/5 border-white/10 focus:border-indigo-400 text-white pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Job Type Select */}
              <div className="col-span-1">
                <Select onValueChange={setSelectedType} value={selectedType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12141d] border-white/10 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select */}
              <div className="col-span-1">
                <Select
                  onValueChange={setSelectedLocation}
                  value={selectedLocation}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12141d] border-white/10 text-white">
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <div className="text-gray-400 mb-6">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "opportunity" : "opportunities"} found
          </div>

          {/* Job Cards */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      {/* Job Card Content */}
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Logo Column */}
                        <div className="w-16 h-16 flex-shrink-0 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                          {job.startup?.logo ? (
                            <img
                              src={job.startup.logo}
                              alt={job.startup?.name || "Company logo"}
                              className="object-contain"
                            />
                          ) : (
                            <BriefcaseIcon className="w-8 h-8 text-indigo-400" />
                          )}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                            <h3 className="text-xl font-bold text-white">
                              {job.title}
                            </h3>
                            <Badge
                              className={`${getJobTypeBadgeColor(
                                job.jobType
                              )} text-white font-medium px-2.5 py-1 text-xs`}
                            >
                              {job.jobType || "Not specified"}
                            </Badge>
                          </div>

                          <div className="text-indigo-300 font-medium mt-1">
                            {job.startup?.name}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="w-4 h-4 text-gray-400" />
                              {job.location}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-2">
                                <DollarSignIcon className="w-4 h-4 text-gray-400" />
                                {job.salary}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              Posted {formatDate(job.postedAt)}
                            </div>
                          </div>

                          <p className="text-gray-300 mt-4 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-white/10">
                            {job.expiresAt && (
                              <span className="text-sm">
                                {getDaysRemaining(job.expiresAt) === 0 ? (
                                  <span className="text-red-400">
                                    Expires today
                                  </span>
                                ) : getDaysRemaining(job.expiresAt) ? (
                                  <span className="text-amber-400">
                                    {getDaysRemaining(job.expiresAt)} days
                                    remaining
                                  </span>
                                ) : (
                                  <span className="text-red-400">Expired</span>
                                )}
                              </span>
                            )}

                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2 sm:mt-0">
                              <a href={`mailto:${job.contactEmail}`}>
                                Apply at {job.contactEmail}
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white/5 rounded-lg border border-white/10">
                <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">
                  No jobs found
                </h3>
                <p className="mt-2 text-gray-400 max-w-md mx-auto">
                  We couldn't find any jobs matching your current filters. Try
                  adjusting your search criteria.
                </p>
                <Button
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedLocation("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default JobListings;
