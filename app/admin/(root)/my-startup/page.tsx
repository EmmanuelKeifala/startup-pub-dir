"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StartupForm from "@/components/app-components/StartUpForm";
import { getUserStartUp } from "@/actions/helper-actions";
import { useSession } from "next-auth/react";

// Define types for the startup data
interface Startup {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  social: string;
  logo: string;
  video: string;
  companyColors: string;
}

interface Category {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  categoryId: string;
  description: string;
  location: string;
  website: string;
  contact: {
    phone: string;
    email: string;
    social: string;
  };
  logo: string;
  video: string;
  companyColors: string;
}

function MyStartUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [startupData, setStartupData] = useState<Startup | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [startupId, setStartUpId] = useState<string>("");
  const { data: session } = useSession();

  // Fetch the startup data and categories when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userStartUp = await getUserStartUp({
          params: {
            id: session?.user.id as string,
          },
        });

        setStartUpId(userStartUp?.id as string);
        // Fetch startup data
        const startupResponse = await fetch(`/api/startups/${userStartUp?.id}`);

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
  }, []);

  // Transform API data to match form structure
  const prepareFormData = (data: Startup | null): FormData => {
    if (!data) {
      // Return default values if data is null
      return {
        name: "",
        categoryId: "",
        description: "",
        location: "",
        website: "",
        contact: {
          phone: "",
          email: "",
          social: "",
        },
        logo: "",
        video: "",
        companyColors: "",
      };
    }

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

  const handleSubmit = async (
    formData: FormData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
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
    } catch (error: unknown) {
      console.error("Error updating startup:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-light-100">Loading edit page...</p>
      </div>
    );
  }

  if (!startupData) {
    return (
      <Card className="w-full text-white">
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
    <div className="container">
      <div className="flex items-center gap-4">
        <ArrowLeft
          size={50}
          className="text-white cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <span className="text-3xl font-bold text-white mb-8">
          Edit Startup Profile
        </span>
      </div>
      <StartupForm
        type="update"
        categories={categories}
        onSubmit={handleSubmit}
        defaultValues={prepareFormData(startupData)}
        // isEditing={true}
      />
    </div>
  );
}

export default MyStartUp;
