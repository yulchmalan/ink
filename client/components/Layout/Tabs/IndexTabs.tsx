import UpdateCard from "@/components/UI/Cards/UpdateCard/UpdateCard";
import Tabs from "./Tabs";
import cover from "../../../assets/cover.png";
import { useTranslations } from "next-intl";

const MyTabsPage = () => {
  const t = useTranslations("Tabs");
  const tabs = [
    {
      title: t("AllUpdates"),
      content: (
        <>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Квіти для Елджернона"
            desc="Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
        </>
      ),
    },
    {
      title: t("MyUpdates"),
      content: (
        <>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
          <UpdateCard
            href="blabla"
            title="Не Квіти для Елджернона"
            desc="не Наукова фантастика - Роман"
            coverUrl={cover.src}
            views={11200}
            saves={2000}
          ></UpdateCard>
        </>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
};

export default MyTabsPage;
