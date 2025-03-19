import {
  Home,
  Users,
  Building,
  CheckCircle,
  Settings,
  Eye,
  FileText,
} from "lucide-react";

export const adminSideBarLinks = (isSuperAdmin: boolean) => {
  const commonLinks = [
    {
      icon: Home,
      route: "/admin",
      text: "Home",
    },
  ];

  const startupOwnerLinks = [
    {
      icon: Building,
      route: "/admin/my-startup",
      text: "My Startup",
    },
  ];

  const superAdminLinks = [
    {
      icon: CheckCircle,
      route: "/admin/approvals",
      text: "Startup Approvals",
    },
    {
      icon: FileText,
      route: "/admin/logs",
      text: "Activity Logs",
    },
    {
      icon: Eye,
      route: "/admin/reviews",
      text: "Moderate Reviews",
    },
    {
      icon: Settings,
      route: "/admin/settings",
      text: "App Settings",
    },
  ];

  return isSuperAdmin
    ? [...commonLinks, ...superAdminLinks]
    : [...commonLinks, ...startupOwnerLinks];
};
