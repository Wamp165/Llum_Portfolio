import { API_URL } from "../config";
import type { CategoryNavItem } from "../components/Navbar";

export interface PublicUser {
  id: number;
  name: string;
  homeBanner?: string | null;
  bio?: string | null;
  profilePicture?: string | null;
  contactEmail?: string | null;
  instagram?: string | null;
  substack?: string | null;
  location?: string | null;
}

export interface PublicBootstrapData {
  user: PublicUser;
  categories: CategoryNavItem[];
}

export async function fetchPublicData(): Promise<PublicBootstrapData> {
  const [userRes, categoriesRes] = await Promise.all([
    fetch(`${API_URL}/public/user`),
    fetch(`${API_URL}/public/categories`),
  ]);

  if (!userRes.ok) throw new Error("Failed to load user");
  if (!categoriesRes.ok) throw new Error("Failed to load categories");

  return {
    user: await userRes.json(),
    categories: await categoriesRes.json(),
  };
}
