"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Globe,
  Zap,
  Link as LinkIcon,
  BarChart2,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AdminDashboardData } from "@/components/admin-components/AdminDashboard";
import { fetchAdminDashboardData } from "@/actions/startup-dashboard-data";

function AboutUs() {
  const [stats, setStats] = useState<AdminDashboardData>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAdminDashboardData();

      setStats(response);
    };

    fetchData();
  }, []);
  const accentColor = "#6366F1";
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accentColor}22 0%, #12141d 50%, #12151f 100%)`,
    borderLeft: `3px solid ${accentColor}`,
  };

  return (
    <div className="min-h-screen  text-white pb-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
            Empowering Startups In Sierra Leone And Beyond
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Building the most comprehensive public directory for innovative
            startups and connecting them with the resources they need to thrive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
              <Link href="/startUps">Browse Directory</Link>
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-500 hover:bg-white/5 hover:text-white px-6 py-3 rounded-lg font-medium"
            >
              <Link href="/register">Submit Your Startup</Link>
            </Button>
          </div>
        </motion.div>
      </section>
      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div
          className="rounded-xl shadow-xl overflow-hidden backdrop-blur-sm p-8"
          style={gradientStyle}
        >
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  At Startup Public Directory, we&lsquo;re on a mission to
                  democratize visibility for innovative startups in sierra
                  leone, regardless of their funding status or location.
                </p>
                <p>
                  We believe that great ideas deserve to be seen, and that
                  connecting startups with the right resources, investors, and
                  collaborators can accelerate innovation and drive positive
                  change in every industry.
                </p>
                <p>
                  Our platform serves as a bridge between ambitious founders and
                  the opportunities they need to scale their vision and impact.
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/5 rounded-xl p-6 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-5 rounded-lg">
                    <Users className="h-10 w-10 text-indigo-400 mb-3" />
                    <h3 className="font-medium text-xl mb-2">Visibility</h3>
                    <p className="text-gray-400">
                      Providing exposure to innovative startups from all corners
                      of the Sierra Leone
                    </p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-lg">
                    <LinkIcon className="h-10 w-10 text-indigo-400 mb-3" />
                    <h3 className="font-medium text-xl mb-2">Connection</h3>
                    <p className="text-gray-400">
                      Fostering meaningful relationships between startups and
                      resources
                    </p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-lg">
                    <Globe className="h-10 w-10 text-indigo-400 mb-3" />
                    <h3 className="font-medium text-xl mb-2">Diversity</h3>
                    <p className="text-gray-400">
                      Celebrating innovations from diverse backgrounds
                    </p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-lg">
                    <HeartHandshake className="h-10 w-10 text-indigo-400 mb-3" />
                    <h3 className="font-medium text-xl mb-2">Support</h3>
                    <p className="text-gray-400">
                      Providing tools and resources for startup growth and
                      success
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <Search className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Discover</h3>
            <p className="text-gray-300 mb-4">
              Browse our curated directory of innovative startups from around
              Sierra Leone, filtered by industry, location, or funding stage.
            </p>
            <Link
              href="/startUps"
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              Explore Directory
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <p className="text-gray-300 mb-4">
              Reach out directly to startups, share reviews, and connect with
              founders to explore collaboration opportunities.
            </p>
            <Link
              href="/sign-up"
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <BarChart2 className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Grow</h3>
            <p className="text-gray-300 mb-4">
              Submit your own startup, showcase your innovation, and gain
              visibility with potential investors, partners, and customers.
            </p>
            <Link
              href="/register"
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors group"
            >
              Submit Startup
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
          Our Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Startup Listing */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <Users className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Startup Listing</h3>
            <p className="text-gray-300 mb-4">
              Comprehensive public directory showcasing innovative startups with
              detailed profiles, including industry, location, funding stage,
              and key metrics.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Detailed startup profiles</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Advanced search and filtering</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Verified founder information</span>
              </li>
            </ul>
          </div>

          {/* Performance Tracking */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <BarChart2 className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Performance Tracking</h3>
            <p className="text-gray-300 mb-4">
              Real-time analytics and metrics to help startups track their
              visibility, engagement, and growth within the ecosystem.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Profile view analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Engagement metrics</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Growth tracking over time</span>
              </li>
            </ul>
          </div>

          {/* Review System */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <HeartHandshake className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Review System</h3>
            <p className="text-gray-300 mb-4">
              Transparent feedback mechanism allowing users to share experiences
              and ratings about startups they've interacted with.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Verified user reviews</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Multi-criteria rating system</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Founder response capability</span>
              </li>
            </ul>
          </div>

          {/* Job Listings */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Job Listings</h3>
            <p className="text-gray-300 mb-4">
              Dedicated job board connecting talented professionals with
              exciting opportunities at innovative startups.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Startup-specific job board</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Targeted talent matching</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Application tracking</span>
              </li>
            </ul>
          </div>

          {/* Service Listing */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <LinkIcon className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">Service Listing</h3>
            <p className="text-gray-300 mb-4">
              Curated directory of services specifically tailored to help
              startups grow, from legal to marketing and technical support.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Verified service providers</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Startup-friendly pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Specialized startup services</span>
              </li>
            </ul>
          </div>

          {/* Coming Soon Feature */}
          <div
            className="rounded-xl shadow-xl p-6 backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-indigo-600/20 mb-6">
              <Globe className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4">And More Coming Soon</h3>
            <p className="text-gray-300 mb-4">
              We're constantly innovating to bring you more features that
              support startup growth and ecosystem development.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Investor matching</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Funding opportunities</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">✓</span>
                <span>Community events</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div
          className="rounded-xl shadow-xl overflow-hidden backdrop-blur-sm p-8"
          style={gradientStyle}
        >
          <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
            Making An Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                {stats?.stats?.totalStartups}
              </div>
              <p className="text-gray-300">Startups Listed</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-400 mb-2">1</div>
              <p className="text-gray-300">Countries Represented</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                {stats?.performanceMetrics.trafficTrends.totalViewsThisMonth}
              </div>
              <p className="text-gray-300">Monthly Visitors</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                {stats?.stats.totalReviews}
              </div>
              <p className="text-gray-300">Successful Connections</p>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Join Us Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-[#6366F1] rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Whether you&lsquo;re a startup founder looking for visibility, an
            investor seeking opportunities, or an enthusiast wanting to discover
            innovation, we welcome you to our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
              <Link href="/register">Submit Your Startup</Link>
            </Button>
            <Button
              variant="outline"
              className="border-white text-black hover:bg-white/20 px-6 py-3 rounded-lg font-medium"
            >
              <Link href="/startUps">Explore Directory</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default AboutUs;
