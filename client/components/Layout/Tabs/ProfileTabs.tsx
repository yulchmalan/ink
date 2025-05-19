"use client";

import { generateReadingMenu } from "@/data/sideMenus/readingMenu";
import sortMenu from "@/data/sideMenus/sortMenu";
import friendsMenu from "@/data/sideMenus/friendsMenu";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import styles from "@/components/Layout/Profile/UserInfo/user-info.module.scss";
import TabGrid from "../Grid/TabGrid";
import type { User } from "@/types/user";

const profileTabs = (user: User) => [
  {
    title: "Закладки",
    content: (
      <TabGrid
        sidebar={
          <Wrapper className={styles.sideWrapper}>
            {generateReadingMenu(user.lists ?? []).map((section, idx) => (
              <SideMenu
                key={idx}
                data={section}
                onSelect={(v) => console.log("Сортування:", v)}
              />
            ))}
          </Wrapper>
        }
      >
        закладки
      </TabGrid>
    ),
  },
  {
    title: "Коментарі",
    content: (
      <TabGrid
        sidebar={
          <Wrapper className={styles.sideWrapper}>
            <SideMenu
              data={sortMenu}
              onSelect={(v) => console.log("Сортування:", v)}
            />
          </Wrapper>
        }
      >
        Коментарі
      </TabGrid>
    ),
  },
  {
    title: "Колекції",
    content: (
      <TabGrid
        sidebar={
          <Wrapper className={styles.sideWrapper}>
            <SideMenu
              data={sortMenu}
              onSelect={(v) => console.log("Сортування:", v)}
            />
          </Wrapper>
        }
      >
        Колекції
      </TabGrid>
    ),
  },
  {
    title: "Друзі",
    content: (
      <TabGrid
        sidebar={
          <Wrapper className={styles.sideWrapper}>
            <SideMenu
              data={friendsMenu}
              onSelect={(v) => console.log("Обране:", v)}
            />
          </Wrapper>
        }
      >
        Друзі
      </TabGrid>
    ),
  },
];

export default profileTabs;
