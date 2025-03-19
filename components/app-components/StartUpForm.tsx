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
import { Loader } from "lucide-react";

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
    <Card
      className={`${
        type === "create" ? "w-full text-white" : "w-full text-black"
      }`}
      style={{
        background: `${
          type === "create"
            ? "linear-gradient(180deg, #12141d 0%, #12151f 100%)"
            : ""
        }`,
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {type === "create"
            ? "Add New Startup"
            : "Update your start up profile"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Basic Information Section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FIELD_NAMES.name}</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
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
                      <FormLabel>{FIELD_NAMES.categoryId}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <FormLabel>{FIELD_NAMES.location}</FormLabel>
                      <FormControl>
                        <Input
                          required
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
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
                      <FormLabel>{FIELD_NAMES.website}</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FIELD_NAMES.description}</FormLabel>
                      <FormControl>
                        <Textarea
                          required
                          className={` min-h-28 ${
                            type === "create"
                              ? "text-white form-input "
                              : "text-black"
                          }`}
                          placeholder="Describe your startup..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FIELD_NAMES["contact.email"]}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
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
                      <FormLabel>{FIELD_NAMES["contact.phone"]}</FormLabel>
                      <FormControl>
                        <Input
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
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
                      <FormLabel>{FIELD_NAMES["contact.social"]}</FormLabel>
                      <FormControl>
                        <Input
                          className={` ${
                            type === "create"
                              ? "text-white form-input"
                              : "text-black"
                          }`}
                          placeholder="https://twitter.com/yourstartup"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Link to primary social media profile
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Media & Brand Section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Media & Brand</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{FIELD_NAMES.logo}</FormLabel>
                      <FormControl>
                        <div className="h-32 w-full">
                          <FileUpload
                            type="image"
                            accept="image/*"
                            placeholder="Upload Logo"
                            folder="logos"
                            variant={type === "create" ? "dark" : "light"}
                            onFileChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{FIELD_NAMES.video}</FormLabel>
                        <FormControl>
                          <div className="h-32 w-full">
                            <FileUpload
                              type="video"
                              accept="video/*"
                              placeholder="Upload Logo"
                              folder="videos"
                              variant={type === "create" ? "dark" : "light"}
                              onFileChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Link to a video introducing your startup
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {/* Color Picker */}
                  <FormField
                    control={form.control}
                    name="companyColors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{FIELD_NAMES.companyColors}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {companyColors.map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="color"
                                  value={color || "#000000"}
                                  onChange={(e) =>
                                    updateColor(index, e.target.value)
                                  }
                                  className="h-8 w-12 rounded cursor-pointer"
                                />
                                <Input
                                  value={color || ""}
                                  onChange={(e) =>
                                    updateColor(index, e.target.value)
                                  }
                                  placeholder="#RRGGBB"
                                  className={`flex-1 ${
                                    type === "create"
                                      ? "text-white form-input "
                                      : "text-black"
                                  }`}
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addColorField}
                              className="text-black text-base"
                            >
                              + Add Another Color
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Select your brand colors
                        </FormDescription>
                        {/* Hidden input that holds the comma-separated color values */}
                        <input type="hidden" {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="form-btn w-32 cursor-pointer">
                {!isLoading ? "Submit" : <Loader className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default StartupForm;
