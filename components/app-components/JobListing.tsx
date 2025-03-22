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
interface Job {
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
  initialJobs?: Job[];
  jobTypes?: string[]; // ['Full-time', 'Part-time', 'Remote', etc.]
  locations?: string[]; // Unique locations from jobs
}

// Dummy data for testing
const DUMMY_JOBS: Job[] = [
  {
    id: "1",
    startupId: "101",
    title: "Senior Frontend Developer",
    description:
      "We're looking for a skilled frontend developer to join our team. You'll be responsible for building modern, responsive web applications using React, Next.js, and TypeScript. Experience with UI/UX design is a plus.",
    requirements:
      "5+ years of experience with React, TypeScript, and modern frontend frameworks. Strong understanding of web performance optimization and accessibility.",
    salary: "$120,000 - $150,000/year",
    jobType: "Full-time",
    location: "San Francisco, CA",
    contactEmail: "jobs@techstartup.com",
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
    startup: {
      name: "TechVision AI",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "2",
    startupId: "102",
    title: "Growth Marketing Manager",
    description:
      "Join our marketing team to drive user acquisition and retention strategies. You'll develop and execute marketing campaigns across multiple channels, analyze performance data, and optimize for growth.",
    requirements:
      "3+ years of experience in growth marketing or performance marketing roles. Proficiency with analytics tools and A/B testing methodologies.",
    salary: "$90,000 - $110,000/year",
    jobType: "Remote",
    location: "Remote",
    contactEmail: "careers@growthstartup.io",
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    expiresAt: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
    startup: {
      name: "GrowthMetrics",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "3",
    startupId: "103",
    title: "Backend Engineer",
    description:
      "We need a skilled backend engineer to help us build scalable and performant APIs. You'll work with Node.js, PostgreSQL, and AWS to design and implement robust backend systems.",
    requirements:
      "Experience with Node.js, Express, PostgreSQL, and AWS. Knowledge of microservices architecture and containerization.",
    salary: "$130,000 - $160,000/year",
    jobType: "Full-time",
    location: "New York, NY",
    contactEmail: "hiring@backendtech.dev",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // 27 days from now
    startup: {
      name: "ServerStack",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "4",
    startupId: "104",
    title: "Product Designer",
    description:
      "Help shape the future of our product! We're looking for a talented product designer to create intuitive and engaging user experiences for our SaaS platform.",
    requirements:
      "Portfolio showcasing UX/UI design work. Proficiency with Figma or similar design tools. Experience with design systems.",
    salary: "$95,000 - $120,000/year",
    jobType: "Part-time",
    location: "Austin, TX",
    contactEmail: "design@productcompany.com",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    startup: {
      name: "DesignFlow",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "5",
    startupId: "105",
    title: "DevOps Engineer",
    description:
      "Join our infrastructure team to build and maintain our cloud-based systems. You'll work with Kubernetes, Terraform, and CI/CD pipelines to ensure reliability and scalability.",
    requirements:
      "Experience with Kubernetes, Terraform, AWS/GCP, and CI/CD pipelines. Knowledge of monitoring and observability tools.",
    salary: "$125,000 - $155,000/year",
    jobType: "Contract",
    location: "Remote",
    contactEmail: "ops@cloudstartup.net",
    postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    startup: {
      name: "CloudOps",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "6",
    startupId: "106",
    title: "Data Scientist",
    description:
      "We're seeking a data scientist to help us extract insights from our large datasets. You'll build machine learning models, conduct statistical analyses, and communicate insights to stakeholders.",
    requirements:
      "Strong background in statistics and machine learning. Proficiency with Python, pandas, scikit-learn, and SQL.",
    salary: "$110,000 - $140,000/year",
    jobType: "Full-time",
    location: "Boston, MA",
    contactEmail: "data@analyticsstartup.ai",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    expiresAt: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days from now
    startup: {
      name: "DataSynth",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "7",
    startupId: "107",
    title: "Customer Success Manager",
    description:
      "Help our customers achieve their goals! You'll be responsible for onboarding, training, and ensuring customer satisfaction and retention.",
    requirements:
      "3+ years in customer success or account management roles. Excellent communication skills. Experience with CRM software.",
    salary: "$80,000 - $100,000/year",
    jobType: "Full-time",
    location: "Chicago, IL",
    contactEmail: "success@customerfirst.co",
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    startup: {
      name: "CustomerFirst",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "8",
    startupId: "108",
    title: "Mobile Developer (iOS)",
    description:
      "Join our mobile team to build and maintain our iOS application. You'll work with Swift and UIKit to create beautiful and functional mobile experiences.",
    requirements:
      "Experience with Swift, UIKit, and iOS development. Knowledge of mobile design patterns and Apple's Human Interface Guidelines.",
    salary: "$115,000 - $145,000/year",
    jobType: "Remote",
    location: "Remote",
    contactEmail: "ios@mobileapp.dev",
    postedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    startup: {
      name: "AppFusion",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "9",
    startupId: "109",
    title: "Content Marketing Specialist",
    description:
      "Create compelling content that drives engagement and conversions. You'll develop blog posts, whitepapers, case studies, and other content to support our marketing efforts.",
    requirements:
      "Strong writing skills. Experience with SEO and content strategy. Ability to translate technical concepts into accessible content.",
    salary: "$70,000 - $90,000/year",
    jobType: "Part-time",
    location: "Denver, CO",
    contactEmail: "content@marketingstartup.com",
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    expiresAt: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), // 26 days from now
    startup: {
      name: "ContentPro",
      logo: "/api/placeholder/80/80",
    },
  },
  {
    id: "10",
    startupId: "110",
    title: "Blockchain Developer",
    description:
      "Help us build the future of decentralized finance. You'll work with Ethereum, Solidity, and Web3 technologies to develop secure and efficient smart contracts.",
    requirements:
      "Experience with Solidity, Ethereum, and Web3.js. Understanding of blockchain concepts and DeFi protocols.",
    salary: "$140,000 - $180,000/year",
    jobType: "Full-time",
    location: "Miami, FL",
    contactEmail: "blockchain@defiplatform.io",
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    expiresAt: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000), // Expires today
    startup: {
      name: "ChainWorks",
      logo: "/api/placeholder/80/80",
    },
  },
];

// Extract unique job types and locations from dummy data
const DUMMY_JOB_TYPES = Array.from(
  new Set(DUMMY_JOBS.map((job) => job.jobType || ""))
).filter(Boolean);
const DUMMY_LOCATIONS = Array.from(
  new Set(DUMMY_JOBS.map((job) => job.location))
).filter(Boolean);

function JobListings({
  initialJobs = DUMMY_JOBS,
  jobTypes = DUMMY_JOB_TYPES,
  locations = DUMMY_LOCATIONS,
}: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
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
                              View Details
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
