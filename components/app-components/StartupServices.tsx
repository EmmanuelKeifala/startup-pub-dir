"use client";
import { motion } from "framer-motion";
import { DollarSign, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export type Service = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

interface StartupServicesProps {
  services: Service[];
  startupId: string;
  isOwner: boolean;
  accentColor?: string;
}

export function StartupServices({
  services,
  startupId,
  isOwner,
  accentColor = "#6366F1",
}: StartupServicesProps) {
  const [expandedServices, setExpandedServices] = useState<
    Record<string, boolean>
  >({});

  const gradientStyle = {
    background: `linear-gradient(135deg, ${accentColor}22 0%, #12141d 50%, #12151f 100%)`,
    borderLeft: `3px solid ${accentColor}`,
  };

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
      style={gradientStyle}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center">
            <DollarSign className="mr-2 text-white/70" />
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Services Offered
            </span>
          </h3>
          {isOwner && (
            <Link href={`/register/add-service/${startupId}`}>
              <Button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </Link>
          )}
        </div>

        {services.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p>No services listed yet</p>
            {isOwner && (
              <Link href={`/register/add-service/${startupId}`}>
                <Button className="mt-4" variant="ghost">
                  Add Your First Service
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg text-white">
                      {service.name}
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                    onClick={() => toggleServiceExpand(service.id)}
                  >
                    {expandedServices[service.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {expandedServices[service.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <p className="text-gray-300">{service.description}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
