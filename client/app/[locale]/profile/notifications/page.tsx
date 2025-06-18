import Container from "@/components/Layout/Container/Container";
import NotificationContent from "./NotificationContent";

export const metadata = {
  title: "Сповіщення | Ink",
  description:
    "Переглядайте нові сповіщення: відповіді на коментарі, запити в друзі та іншу активність, що стосується вас на платформі Ink.",
  openGraph: {
    title: "Сповіщення | Ink",
    description:
      "Будьте в курсі подій: відповіді, запити в друзі та підтвердження — усе у вашій стрічці сповіщень на Ink.",
    type: "website",
    url: "https://ink-three.vercel.app/notifications",
  },
  twitter: {
    card: "summary",
    title: "Сповіщення | Ink",
    description:
      "Дізнавайтеся, хто відповів вам, додав у друзі або відреагував на ваші дії. Усі сповіщення — в одному місці.",
  },
};

export default function NotificationsPage() {
  return (
    <Container>
      <NotificationContent />
    </Container>
  );
}
