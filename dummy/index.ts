export interface Startup {
  id: number;
  name: string;
  category: string;
  description: string;
  location: string;
  website?: string;
  contact: {
    phone?: string;
    email?: string;
    social?: string;
  };
  rating: number;
  reviews: string[];
  logo: string;
  video: string;
  colors: {
    primaryColor: string;
    secondaryColor: string;
  };
}

const startupsDummy: Startup[] = [
  {
    id: 1,
    name: "SaloneTech Solutions",
    category: "Technology",
    description:
      "A software development company specializing in mobile and web applications.",
    location: "Freetown, Sierra Leone",
    website: "https://salonetech.com",
    contact: {
      phone: "+232 78 123 456",
      email: "info@salonetech.com",
      social: "https://twitter.com/salonetech",
    },
    rating: 4.8,
    reviews: [
      "Great service and fast delivery!",
      "Highly recommended for startups.",
    ],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=VYOjWnS4cMY",
    colors: {
      primaryColor: "#007BFF", // Blue
      secondaryColor: "#0056b3", // Darker Blue
    },
  },
  {
    id: 2,
    name: "Green Agro",
    category: "Agriculture",
    description:
      "A startup focused on sustainable farming and organic food production.",
    location: "Bo, Sierra Leone",
    website: "https://greenagro.sl",
    contact: {
      phone: "+232 79 987 654",
      email: "contact@greenagro.sl",
    },
    rating: 4.5,
    reviews: ["Fresh and organic products!", "Great for local farmers."],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    colors: {
      primaryColor: "#28A745", // Green
      secondaryColor: "#218838", // Darker Green
    },
  },
  {
    id: 3,
    name: "LionPay",
    category: "Fintech",
    description:
      "A mobile payment solution making transactions easier for businesses and individuals.",
    location: "Freetown, Sierra Leone",
    website: "https://lionpay.com",
    contact: {
      phone: "+232 76 555 111",
      email: "support@lionpay.com",
    },
    rating: 4.7,
    reviews: [
      "Secure and fast payments!",
      "Best mobile wallet in Sierra Leone.",
    ],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    colors: {
      primaryColor: "#FFC107", // Yellow
      secondaryColor: "#E0A800", // Darker Yellow
    },
  },
  {
    id: 4,
    name: "SolarAfrica Energy",
    category: "Renewable Energy",
    description:
      "Providing affordable solar energy solutions for homes and businesses.",
    location: "Kenema, Sierra Leone",
    website: "https://solarafrica.sl",
    contact: {
      phone: "+232 88 222 333",
      email: "info@solarafrica.sl",
    },
    rating: 4.6,
    reviews: ["Reliable solar panels!", "Saved me money on electricity bills."],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    colors: {
      primaryColor: "#FD7E14", // Orange
      secondaryColor: "#D65A00", // Darker Orange
    },
  },
  {
    id: 5,
    name: "HealthFirst Clinics",
    category: "Healthcare",
    description:
      "Affordable healthcare services with a network of clinics across Sierra Leone.",
    location: "Makeni, Sierra Leone",
    website: "https://healthfirst.sl",
    contact: {
      phone: "+232 77 999 888",
      email: "info@healthfirst.sl",
    },
    rating: 4.9,
    reviews: ["Professional doctors!", "Best medical services in town."],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=0GVLnyTdqkg",
    colors: {
      primaryColor: "#17A2B8", // Cyan
      secondaryColor: "#117A8B", // Darker Cyan
    },
  },
  {
    id: 6,
    name: "Sierra Logistics",
    category: "Transportation",
    description:
      "Efficient logistics and delivery services for businesses across Sierra Leone.",
    location: "Freetown, Sierra Leone",
    website: "https://sierra-logistics.com",
    contact: {
      phone: "+232 75 333 222",
      email: "info@sierra-logistics.com",
    },
    rating: 4.3,
    reviews: [
      "Fast delivery and good customer service!",
      "Reliable for business logistics.",
    ],
    logo: "https://placehold.co/400x600.png",
    video: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    colors: {
      primaryColor: "#6C757D", // Gray
      secondaryColor: "#343A40", // Darker Gray
    },
  },
];

export default startupsDummy;
