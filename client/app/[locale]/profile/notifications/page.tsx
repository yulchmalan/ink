import Container from "@/components/Layout/Container/Container";
import NotificationContent from "./NotificationContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return {
    title: t("notification_title"),
    description: t("notification_desc"),
    openGraph: {
      title: t("notification_title"),
      description: t("notification_desc_opengraph"),
      type: "website",
      url: "https://ink-three.vercel.app/notifications",
    },
    twitter: {
      card: "summary",
      title: t("notification_title"),
      description: t("notification_desc_tw"),
    },
  };
}

export default function NotificationsPage() {
  return (
    <Container>
      <NotificationContent />
    </Container>
  );
}
