"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./user-info.module.scss";
import Tabs from "../../Tabs/Tabs";
import { ReactNode } from "react";
import Banner from "../Banner/Banner";
import Info from "@/assets/icons/Info";
import sortMenu from "@/data/sideMenus/sortMenu";
import friendsMenu from "@/data/sideMenus/friendsMenu";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import ReadingMenu from "@/data/sideMenus/readingMenu";
import Wrapper from "../../Wrapper/Wrapper";
import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import profileTabs from "@/components/Layout/Tabs/ProfileTabs";

export const UserInfo = ({
  user,
}: // tabs,
{
  user: { _id: string; username: string; email: string };
  // tabs?: { title: string; content: ReactNode }[];
}) => {
  const { user: currentUser } = useAuth();

  //перевірка чи це залогований юзер (поки не юзаю, але лишаю)
  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className={styles.container}>
      <Banner
        bannerUrl={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/banners/${user._id}.jpg`}
      ></Banner>
      {/* <p>ID: {user._id}</p> */}
      {/* <p>Email: {user.email}</p> */}
      <div className={styles.infoWrapper}>
        <img
          src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/avatars/${user._id}.jpg`}
          alt="Avatar"
          className={styles.pfp}
        />

        <h1 className={styles.name}>
          <Info />
          {user.username}
        </h1>
      </div>
      <Tabs type="profile" tabs={profileTabs} />
    </div>
  );
};
