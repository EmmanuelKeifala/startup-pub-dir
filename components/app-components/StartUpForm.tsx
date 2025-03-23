"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerStartUpSchema } from "@/lib/validations";
import FileUpload from "./FileUpload";
import { Loader, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const FIELD_NAMES = {
  name: "Startup Name",
  categoryId: "Category",
  description: "Description",
  location: "Location",
  website: "Website",
  "contact.phone": "Phone Number",
  "contact.email": "Email",
  "contact.social": "Social Media",
  logo: "Company Logo",
  video: "Introduction Video",
  companyColors: "Company Colors",
  status: "Status",
};

// Define the type for our form values
type StartupFormValues = z.infer<typeof registerStartUpSchema>;

// Define the return type for the onSubmit function
interface SubmitResult {
  success: boolean;
  error?: string;
}

interface StartupFormProps {
  categories: { id: string; name: string }[];
  onSubmit: (data: StartupFormValues) => Promise<SubmitResult>;
  defaultValues?: Partial<StartupFormValues>;
  type?: "create" | "update";
}

function StartupForm({
  categories,
  onSubmit,
  defaultValues,
  type = "create",
}: StartupFormProps) {
  const router = useRouter();
  const [companyColors, setCompanyColors] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(registerStartUpSchema),
    defaultValues,
  });

  const handleSubmit = async (data: StartupFormValues) => {
    try {
      setIsLoading(true);
      const result = await onSubmit(data);
      if (result?.success) {
        if (type === "create") {
          toast.success("Startup has been successfully added");
          //  TODO: push the user to the startup they have just created
        } else {
          router.push(`/`);
          toast.success("Startup has been successfully updated");
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log(result?.error);
        toast.error(result?.error || "Something went wrong");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle company colors
  const addColorField = () => {
    setCompanyColors([...companyColors, ""]);
  };

  const updateColor = (index: number, value: string) => {
    const updatedColors = [...companyColors];
    updatedColors[index] = value;
    setCompanyColors(updatedColors);

    // Update the form value with comma-separated colors
    form.setValue("companyColors", updatedColors.filter(Boolean).join(", "));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-xl overflow-hidden bg-white">
        <CardHeader className="border-b border-gray-200 pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            {type === "create"
              ? "Add Your Startup to Our Directory"
              : "Update Your Startup Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-10"
            >
              {/* Basic Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.name}
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="Your startup name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.categoryId}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-300 text-gray-900">
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.location}
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="City, Country"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.website}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="https://example.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.description}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            required
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900 min-h-32"
                            placeholder="Describe your startup's mission, vision, and unique value proposition..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Contact Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES["contact.email"]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="contact@yourstartup.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES["contact.phone"]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="+232 555-123-4567"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.social"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES["contact.social"]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                            placeholder="https://twitter.com/yourstartup"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500 text-xs">
                          Link to your primary social media profile
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Media & Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Media & Brand
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.logo}
                        </FormLabel>
                        <FormControl>
                          <div className="h-40 w-full bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            <FileUpload
                              type="image"
                              accept="image/*"
                              placeholder="Upload Logo"
                              folder="logos"
                              variant="light"
                              onFileChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-500 text-xs mt-2">
                          Upload a high-quality logo (PNG or SVG recommended)
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.video}
                        </FormLabel>
                        <FormControl>
                          <div className="h-40 w-full bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            <FileUpload
                              type="video"
                              accept="video/*"
                              placeholder="Upload Video"
                              folder="videos"
                              variant="light"
                              onFileChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-500 text-xs mt-2">
                          Share a short video introducing your startup (2
                          minutes max)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8">
                  <FormField
                    control={form.control}
                    name="companyColors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">
                          {FIELD_NAMES.companyColors}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {companyColors.map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                              >
                                <input
                                  type="color"
                                  value={color || "#6366F1"}
                                  onChange={(e) =>
                                    updateColor(index, e.target.value)
                                  }
                                  className="h-10 w-14 rounded cursor-pointer border-0"
                                />
                                <Input
                                  value={color || ""}
                                  onChange={(e) =>
                                    updateColor(index, e.target.value)
                                  }
                                  placeholder="#RRGGBB"
                                  className="flex-1 bg-gray-50 border-gray-300 focus:border-indigo-500 text-gray-900"
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              onClick={addColorField}
                              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Add Brand Color
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-500 text-xs mt-2">
                          Select your brand colors to help us personalize your
                          profile
                        </FormDescription>
                        {/* Hidden input that holds the comma-separated color values */}
                        <input type="hidden" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex justify-end mt-10 pt-6 border-t border-gray-200"
              >
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-lg font-medium text-base flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>Submit Startup</>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StartupForm;
