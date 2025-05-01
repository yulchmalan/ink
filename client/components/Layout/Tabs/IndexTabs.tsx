import UpdateCard from "@/components/UI/Cards/UpdateCard/UpdateCard";
import Tabs from "./Tabs";
import cover from "../../../assets/cover.png";

const MyTabsPage = () => {
  const tabs = [
    {
      title: "Всі оновлення",
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
        </>
      ),
    },
    {
      title: "Мої оновлення",
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
