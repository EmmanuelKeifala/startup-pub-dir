"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StartupForm from "@/components/app-components/StartUpForm";

function Edit() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [startupData, setStartupData] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch the startup data and categories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch startup data
        const id = params.id;
        const startupResponse = await fetch(`/api/startups/${id}`);

        if (!startupResponse.ok) {
          throw new Error("Failed to fetch startup data");
        }

        const startupResult = await startupResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesResult = await categoriesResponse.json();

        setStartupData(startupResult.startup);
        setCategories(categoriesResult.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading startup data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Transform API data to match form structure if needed
  const prepareFormData = (data: any) => {
    if (!data) return null;

    return {
      name: data.name || "",
      categoryId: data.categoryId || "",
      description: data.description || "",
      location: data.location || "",
      website: data.website || "",
      contact: {
        phone: data.phone || "",
        email: data.email || "",
        social: data.social || "",
      },
      logo: data.logo || "",
      video: data.video || "",
      companyColors: data.companyColors || "",
    };
  };

  const handleSubmit = async (formData: any) => {
    // TODO: infer the proper type
    try {
      const startupId = params.id;
      const response = await fetch(`/api/startups/${startupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update startup");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error updating startup:", error);
      return { success: false, error: error?.message };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-blue-500 w-12 h-12" />
      </div>
    );
  }

  if (!startupData) {
    return (
      <Card
        className="w-full text-white"
        style={{
          background: "linear-gradient(180deg, #12141d 0%, #12151f 100%)",
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-red-400">
            Startup Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>The startup you are trying to edit could not be found.</p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/startups")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Startups
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">
        Edit Startup Profile
      </h1>
      <StartupForm
        categories={categories}
        onSubmit={handleSubmit}
        defaultValues={prepareFormData(startupData)}
        // isEditing={true}
      />
    </div>
  );
}

export default Edit;
