import {
  Home,
  Building,
  CheckCircle,
  Check,
  BriefcaseBusiness,
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
    {
      icon: BriefcaseBusiness,
      route: "/admin/add-jobs",
      text: "StartUp Jobs",
    },
  ];

  const superAdminLinks = [
    {
      icon: CheckCircle,
      route: "/admin/approvals",
      text: "Startup Approvals",
    },
    {
      icon: Check,
      route: "/admin/startups",
      text: "All StartUps",
    },
  ];

  return isSuperAdmin
    ? [...commonLinks, ...superAdminLinks]
    : [...commonLinks, ...startupOwnerLinks];
};
