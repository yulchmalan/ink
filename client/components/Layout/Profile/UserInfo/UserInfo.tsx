"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./user-info.module.scss";
import Tabs from "../../Tabs/Tabs";
import Banner from "../Banner/Banner";
import Info from "@/assets/icons/Info";
import profileTabs from "@/components/Layout/Tabs/ProfileTabs";
import Pfp from "../Pfp/Pfp";

export const UserInfo = ({
  user,
}: {
  user: { _id: string; username: string; email: string };
}) => {
  const { user: currentUser } = useAuth();

  //перевірка чи це залогований юзер (поки не юзаю, але лишаю)
  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className={styles.container}>
      <Banner userId={user._id} />
      {/* <p>ID: {user._id}</p> */}
      {/* <p>Email: {user.email}</p> */}
      <div className={styles.infoWrapper}>
        <Pfp userId={user._id} />
        <h1 className={styles.name}>
          <Info />
          {user.username}
        </h1>
      </div>
      <Tabs type="profile" tabs={profileTabs} />
    </div>
  );
};
