export type Startup = {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  logo: string;
  video: string;
  companyColors: string;
  status: "pending" | "approved" | "rejected";
  rating: number;
  categoryId: string;
  categoryName: string; //
};
