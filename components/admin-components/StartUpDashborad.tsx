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

interface Review {
  user: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
  profilePicture?: string;
}

interface Stats {
  totalReviews: number;
  averageRating: number;
  totalViews: number;
  pendingApprovals: number;
}

interface TrafficTrends {
  viewsThisMonth: number;
  increasePercentage: number;
  usersLeftWithoutReview: number;
  decreasePercentage: number;
}

interface HistoricalData {
  month: string;
  views: number;
  reviews: number;
  rating: number;
}

interface SentimentAnalysis {
  category: string;
  positive: number;
  negative: number;
}

interface PerformanceMetrics {
  trafficTrends: TrafficTrends;
  commonKeywords: string[];
  historicalData: HistoricalData[];
  sentimentAnalysis: SentimentAnalysis[];
}

export interface StartupData {
  stats: Stats;
  latestReviews: Review[];
  performanceMetrics: PerformanceMetrics;
}

interface StartupDashboardProps {
  startupData: StartupData;
  startupName?: string;
  onEditProfile?: () => void;
  onUpdateLogo?: () => void;
  onUploadVideo?: () => void;
}

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  Edit,
  Upload,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const StartupDashboard: React.FC<StartupDashboardProps> = ({
  startupData,
  startupName = "Your Startup",
  onEditProfile = () => console.log("Edit profile clicked"),
  onUpdateLogo = () => console.log("Update logo clicked"),
  onUploadVideo = () => console.log("Upload video clicked"),
}) => {
  const { stats, latestReviews, performanceMetrics } = startupData;
  const ratingPercentage = (stats.averageRating / 5) * 100;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {startupName} Dashboard
        </h1>
        <p className="text-gray-500">
          Track and manage your startup's performance metrics
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Rating
            </CardTitle>
            <Star className="text-yellow-500 h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <Progress className="h-2 mt-2" value={ratingPercentage} />
          </CardContent>
        </Card>

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
              {performanceMetrics.trafficTrends.increasePercentage}% this month
            </div>
          </CardContent>
        </Card>

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
                        dataKey="views"
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
                    {performanceMetrics.trafficTrends.viewsThisMonth.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Non-reviewers
                  </p>
                  <p className="text-lg font-bold">
                    {performanceMetrics.trafficTrends.usersLeftWithoutReview.toLocaleString()}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

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
                        dataKey="reviews"
                        stroke="#10b981"
                        name="Review Count"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rating"
                        stroke="#eab308"
                        name="Average Rating"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                  Positive vs. Negative feedback by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceMetrics.sentimentAnalysis}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="positive"
                        stackId="a"
                        fill="#10b981"
                        name="Positive %"
                      />
                      <Bar
                        dataKey="negative"
                        stackId="a"
                        fill="#ef4444"
                        name="Negative %"
                      />
                    </BarChart>
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

      {/* Latest Reviews Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Latest Reviews</CardTitle>
          <CardDescription>
            Most recent feedback from your users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {latestReviews.map((review, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {/* {review.user.charAt(0)} */}
                    </div>
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
                {review.reply && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your reply:</span>{" "}
                      {review.reply}
                    </p>
                  </div>
                )}
                {!review.reply && (
                  <div className="mt-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Reply to this review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t flex justify-between">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View all {stats.totalReviews} reviews
          </button>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <ThumbsUp className="h-4 w-4" /> Most helpful
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" /> Needs attention
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Startup Profile</CardTitle>
          <CardDescription>
            Update your startup information and marketing assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Startup Info</span>
            </button>
            <button
              onClick={onUpdateLogo}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
            >
              <Upload className="h-5 w-5" />
              <span>Update Logo</span>
            </button>
            <button
              onClick={onUploadVideo}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all"
            >
              <Upload className="h-5 w-5" />
              <span>Upload New Video</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupDashboard;
