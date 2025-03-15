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
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerStartUpSchema } from "@/lib/validations";
import FileUpload from "./FileUpload";

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

// Field prefixes for better user guidance
const FIELD_PREFIXES = {
  website: "https://",
  "contact.phone": "+232",
  "contact.social": "https://",
  video: "https://",
};

// Define the type for our form values
type StartupFormValues = z.infer<typeof registerStartUpSchema>;

// Default values for the form
const defaultValues: StartupFormValues = {
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
  rating: 0,
  logo: "",
  video: "",
  companyColors: "",
  status: "pending",
};

interface StartupFormProps {
  categories: { id: string; name: string }[];
  onSubmit: any;
}

function StartupForm({ categories, onSubmit }: StartupFormProps) {
  const router = useRouter();
  const [companyColors, setCompanyColors] = useState<string[]>([""]);

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(registerStartUpSchema),
    defaultValues,
  });

  const handleSubmit = async (data: StartupFormValues) => {
    // Handle prefixes for URL and phone fields
    const formattedData = {
      ...data,
      website:
        data.website && !data.website.startsWith(FIELD_PREFIXES.website)
          ? `${FIELD_PREFIXES.website}${data.website}`
          : data.website,
      contact: {
        ...data.contact,
        phone:
          data.contact.phone &&
          !data.contact.phone.startsWith(FIELD_PREFIXES["contact.phone"])
            ? `${FIELD_PREFIXES["contact.phone"]}${data.contact.phone}`
            : data.contact.phone,
        social:
          data.contact.social &&
          !data.contact.social.startsWith(FIELD_PREFIXES["contact.social"])
            ? `${FIELD_PREFIXES["contact.social"]}${data.contact.social}`
            : data.contact.social,
      },
      video:
        data.video && !data.video.startsWith(FIELD_PREFIXES.video)
          ? `${FIELD_PREFIXES.video}${data.video}`
          : data.video,
    };

    console.log(formattedData);
    const result = await onSubmit(formattedData);

    if (result?.success) {
      toast.success("Startup has been successfully added");
      router.push("/startups");
    } else {
      console.log(result?.error);
      toast.error(result?.error || "Something went wrong");
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

  // Handle input masks for fields with prefixes
  const stripPrefix = (value: string, prefix: string) => {
    return value.startsWith(prefix) ? value.substring(prefix.length) : value;
  };

  return (
    <Card
      className="w-full text-white"
      style={{
        background: "linear-gradient(180deg, #12141d 0%, #12151f 100%)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Add New Startup
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
                          className="form-input"
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
                        <SelectTrigger className="form-input">
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
                          className="form-input"
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
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            {FIELD_PREFIXES.website}
                          </div>
                          <Input
                            type="url"
                            className="form-input pl-20"
                            placeholder="example.com"
                            value={stripPrefix(
                              field.value as string,
                              FIELD_PREFIXES.website
                            )}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
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
                          className="form-input min-h-28"
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
                          className="form-input"
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
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            {FIELD_PREFIXES["contact.phone"]}
                          </div>
                          <Input
                            className="form-input pl-14"
                            placeholder="555-123-4567"
                            value={stripPrefix(
                              field.value as string,
                              FIELD_PREFIXES["contact.phone"]
                            )}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
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
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            {FIELD_PREFIXES["contact.social"]}
                          </div>
                          <Input
                            className="form-input pl-20"
                            placeholder="twitter.com/yourstartup"
                            value={stripPrefix(
                              field.value as string,
                              FIELD_PREFIXES["contact.social"]
                            )}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
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
                            variant="dark"
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
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              {FIELD_PREFIXES.video}
                            </div>
                            <Input
                              type="url"
                              placeholder="youtube.com/watch?v=..."
                              className="form-input pl-20"
                              value={stripPrefix(
                                field.value as string,
                                FIELD_PREFIXES.video
                              )}
                              onChange={(e) => field.onChange(e.target.value)}
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
                                  className="form-input flex-1"
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addColorField}
                              className=" text-black text-base"
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

            {/* Hidden Admin Fields */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="form-btn w-32">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default StartupForm;
