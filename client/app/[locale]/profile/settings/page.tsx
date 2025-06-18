import { Metadata } from "next";
import dynamic from "next/dynamic";
import ProfileSettingsContent from "./SettingsContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Profile");

  return {
    title: t("settings_title"),
    description: t("settings_desc"),
  };
}

export default function ProfileSettingsPage() {
  return <ProfileSettingsContent />;
}
