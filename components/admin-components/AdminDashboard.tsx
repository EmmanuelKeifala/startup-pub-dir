"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock10Icon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Review {
  user: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
  profilePicture?: string;
}

interface AggregatedStats {
  totalStartups: number;
  totalReviews: number;
  averageRating: number;
  totalViews: number;
  pendingApprovals: number;
}

interface AggregatedTrafficTrends {
  totalViewsThisMonth: number;
  averageIncreasePercentage: number;
  totalUsersLeftWithoutReview: number;
  averageDecreasePercentage: number;
}

interface AggregatedHistoricalData {
  month: string;
  totalViews: number;
  totalReviews: number;
  averageRating: number;
}

interface AggregatedSentimentAnalysis {
  totalPositive: number;
  totalNegative: number;
  totalNeutral: number;
}

interface AggregatedPerformanceMetrics {
  trafficTrends: AggregatedTrafficTrends;
  commonKeywords: string[];
  historicalData: AggregatedHistoricalData[];
  sentimentAnalysis: AggregatedSentimentAnalysis;
}

export interface AdminDashboardData {
  stats: AggregatedStats;
  latestReviews: Review[];
  performanceMetrics: AggregatedPerformanceMetrics;
}

interface AdminDashboardProps {
  adminData: AdminDashboardData;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminData }) => {
  const { stats, performanceMetrics } = adminData;
  const ratingPercentage = (stats.averageRating / 5) * 100;

  // Data for the sentiment pie chart
  const sentimentData = [
    {
      name: "Positive",
      value: performanceMetrics.sentimentAnalysis.totalPositive,
    },
    {
      name: "Negative",
      value: performanceMetrics.sentimentAnalysis.totalNegative,
    },
    {
      name: "Neutral",
      value: performanceMetrics.sentimentAnalysis.totalNeutral,
    },
  ];

  const COLORS = ["#10b981", "#ef4444", "#6b7280"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">
          Track and manage all startups' performance metrics
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Startups Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Startups
            </CardTitle>
            <Star className="text-yellow-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStartups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Startups Pending
            </CardTitle>
            <Clock10Icon className="text-yellow-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>

        {/* Average Rating Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Rating
            </CardTitle>
            <Star className="text-yellow-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating.toFixed(1)}
            </div>
            <Progress className="h-2 mt-2" value={ratingPercentage} />
          </CardContent>
        </Card>

        {/* Total Views Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Views
            </CardTitle>
            <Eye className="text-blue-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />+
              {performanceMetrics.trafficTrends.averageIncreasePercentage}% this
              month
            </div>
          </CardContent>
        </Card>

        {/* Total Reviews Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Reviews
            </CardTitle>
            <MessageSquare className="text-green-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((stats.totalReviews / stats.totalViews) * 100).toFixed(1)}%
              conversion rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphs and Analysis */}
      <div className="mb-8">
        <Tabs defaultValue="traffic">
          <TabsList className="mb-4">
            <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
            <TabsTrigger value="reviews">Review Analytics</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          </TabsList>

          {/* Traffic Analysis Tab */}
          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Trends</CardTitle>
                <CardDescription>
                  Historical view and total page views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceMetrics.historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="totalViews"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        name="Views"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Month Views
                  </p>
                  <p className="text-lg font-bold">
                    {performanceMetrics.trafficTrends.totalViewsThisMonth.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Non-reviewers
                  </p>
                  <p className="text-lg font-bold">
                    {performanceMetrics.trafficTrends.totalUsersLeftWithoutReview.toLocaleString()}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Review Analytics Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Review Metrics</CardTitle>
                <CardDescription>
                  Review count and average rating over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceMetrics.historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 5]}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="totalReviews"
                        stroke="#10b981"
                        name="Review Count"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="averageRating"
                        stroke="#eab308"
                        name="Average Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis Tab */}
          <TabsContent value="sentiment">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Positive, Negative, and Neutral feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="flex flex-wrap gap-2 w-full">
                  {performanceMetrics.commonKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
