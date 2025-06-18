import { Metadata } from "next";
import dynamic from "next/dynamic";
import ProfileSettingsContent from "./SettingsContent";

export const metadata: Metadata = {
  title: "Налаштування профілю | Ink",
  description:
    "Керуй своїм профілем на Ink: зміни нікнейм, опис, аватар або банер. Видалення акаунту також доступне.",
};

export default function ProfileSettingsPage() {
  return <ProfileSettingsContent />;
}
