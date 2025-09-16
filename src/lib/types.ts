export type TechCategory =
  | "frontend"
  | "backend"
  | "data"
  | "mobile"
  | "devops"
  | "testing"
  | "collaboration"
  | "database"
  | "language";

export type Tech = {
  slug: string;
  name: string;
  category: TechCategory;
  description: string;
  tags: string[];
  homepage?: string;
  repo?: string;
  docs?: string;
  license?: string;
  version?: string;
  logoUrl?: string;
  resources?: { title: string; url: string }[];
};

export type Collection = {
  slug: string;
  title: string;
  description?: string;
  techSlugs: string[];
};


export type CompanyCategory =
  | "social"
  | "mobility"
  | "fashion"
  | "travel"
  | "foodtech"
  | "ecommerce"
  | "healthcare"
  | "finance"
  | "work"
  | "ai"
  | "education"
  | "media"
  | "others";

export type Company = {
  name: string;
  category: CompanyCategory;
  region?: string;
  logoUrl?: string;
  techSlugs: string[];
};


