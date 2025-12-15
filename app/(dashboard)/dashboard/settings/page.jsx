import { getCurrentUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";

/**
 * Settings Page
 * Displays user account information and preferences
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsClient user={user} />;
}


