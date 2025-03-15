"use client";
import { registerStartUp } from "@/actions/register-action";
import StartupForm from "@/components/app-components/StartUpForm";
import { RocketIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

function RegisterStartUp() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  return (
    <div className="text-white w-full">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
        <RocketIcon size={50} className="text-blue-500" />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">Startup Pub</h1>
          <p className="text-gray-300 text-sm md:text-base">
            Discover and support startups in your area.
          </p>
        </div>
      </div>

      <div className="w-full">
        <StartupForm
        type="create"
          categories={categories}
          onSubmit={registerStartUp}
        />
      </div>
    </div>
  );
}

export default RegisterStartUp;
