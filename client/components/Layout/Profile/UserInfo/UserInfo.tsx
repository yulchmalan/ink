"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./user-info.module.scss";
import Tabs from "../../Tabs/Tabs";
import Banner from "../Banner/Banner";
import Info from "@/assets/icons/Info";
import profileTabs from "@/components/Layout/Tabs/ProfileTabs";
import Pfp from "../Pfp/Pfp";
import Details from "../Details/Details";
import type { User } from "@/types/user";
import AddFriendButton from "../Friends/AddFriendButton/AddFriendButton";

export const UserInfo = ({ user }: { user: User }) => {
  const { user: currentUser } = useAuth();

  //перевірка чи це залогований юзер (поки не юзаю, але лишаю)
  const isCurrentUser = currentUser?._id === user._id;

  return (
    <div className={styles.container}>
      <Banner userId={user._id} />
      <div className={styles.infoWrapper}>
        {user.friends && <AddFriendButton profileUserId={user._id} />}
        <Pfp userId={user._id} />
        <h1 className={styles.name}>
          <Details user={user} />
          <span className={styles.nickname}>{user.username}</span>
        </h1>
      </div>
      <Tabs type="profile" tabs={profileTabs(user)} />
    </div>
  );
};
