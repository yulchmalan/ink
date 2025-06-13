"use client";

import { generateReadingMenu } from "@/data/sideMenus/readingMenu";
import sortMenu from "@/data/sideMenus/sortMenu";
// import friendsMenu from "@/data/sideMenus/friendsMenu";
import { generateFriendsMenu } from "@/data/sideMenus/friendsMenu";

import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import styles from "@/components/Layout/Profile/UserInfo/user-info.module.scss";
import TabGrid from "../Grid/TabGrid";
import type { User } from "@/types/user";
import BookMarks from "../Profile/Bookmarks/Bookmarks";
import { useState } from "react";
import Comment from "../Profile/Comments/Comment";
import ProfileComments from "../Profile/Comments/ProfileComments/ProfileComments";
import ProfileCollections from "../Profile/Collections/ProfileCollections";
import ProfileFriends from "../Profile/Friends/ProfileFriends";
import FriendCard from "../Profile/Friends/FriendCard/FriendCard";
import { useAuth } from "@/contexts/AuthContext";
import ProfileReviews from "../Profile/Reviews/ProfileReview";

const profileTabs = (user: User) => {
  const { user: currentUser } = useAuth();

  const [controls, setControls] = useState({
    sortBy: "read-date",
    sortOrder: "desc" as "asc" | "desc",
    selectedList: "all",
    view: "grid" as "grid" | "row",
  });

  const handleControlChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setControls((prev) => ({ ...prev, sortOrder: value }));
    } else if (value === "grid" || value === "row") {
      setControls((prev) => ({ ...prev, view: value }));
    } else if (
      [
        "all",
        "reading",
        "planned",
        "completed",
        "dropped",
        "favorite",
      ].includes(value)
    ) {
      setControls((prev) => ({ ...prev, selectedList: value || "all" }));
    } else if (["title", "added", "updated", "read-date"].includes(value)) {
      setControls((prev) => ({ ...prev, sortBy: value }));
    }
  };

  const defaultCommentControls = {
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  };

  const [commentControls, setCommentControls] = useState(
    defaultCommentControls
  );

  const handleCommentControlChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setCommentControls((prev) => {
        const updated = {
          ...prev,
          sortOrder:
            prev.sortOrder === value ? defaultCommentControls.sortOrder : value,
        };
        return updated;
      });
    } else if (value === "rating" || value === "date") {
      setCommentControls((prev) => {
        const updated = {
          ...prev,
          sortBy: prev.sortBy === value ? defaultCommentControls.sortBy : value,
        };
        return updated;
      });
    } else {
      setCommentControls(defaultCommentControls);
    }
  };

  const defaultCollectionControls = {
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  };

  const [collectionControls, setCollectionControls] = useState(
    defaultCollectionControls
  );

  const defaultReviewControls = {
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  };

  const [reviewControls, setReviewControls] = useState(defaultReviewControls);

  const handleReviewControlChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setReviewControls((prev) => ({
        ...prev,
        sortOrder:
          prev.sortOrder === value ? defaultReviewControls.sortOrder : value,
      }));
    } else if (value === "rating" || value === "date") {
      setReviewControls((prev) => ({
        ...prev,
        sortBy: prev.sortBy === value ? defaultReviewControls.sortBy : value,
      }));
    } else {
      setReviewControls(defaultReviewControls);
    }
  };

  const handleCollectionControlChange = (value: string) => {
    if (value === "asc" || value === "desc") {
      setCollectionControls((prev) => ({
        ...prev,
        sortOrder:
          prev.sortOrder === value
            ? defaultCollectionControls.sortOrder
            : value,
      }));
    } else if (value === "rating" || value === "date") {
      setCollectionControls((prev) => ({
        ...prev,
        sortBy:
          prev.sortBy === value ? defaultCollectionControls.sortBy : value,
      }));
    } else {
      setCollectionControls(defaultCollectionControls);
    }
  };

  const [friendsFilter, setFriendsFilter] = useState<
    "ACCEPTED" | "RECEIVED" | "PENDING"
  >("ACCEPTED");

  return [
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
                  selected={
                    section.type === "list"
                      ? controls.selectedList
                      : section.type === "radio"
                      ? controls.sortBy
                      : section.type === "icon"
                      ? controls.view
                      : undefined
                  }
                  selectedSecondary={
                    section.type === "radio" &&
                    section.secondary?.type === "radio"
                      ? controls.sortOrder
                      : undefined
                  }
                  onSelect={handleControlChange}
                />
              ))}
            </Wrapper>
          }
        >
          <BookMarks
            user={user}
            sortBy={controls.sortBy}
            sortOrder={controls.sortOrder}
            list={controls.selectedList}
            style={controls.view}
          />
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
                selected={commentControls.sortBy}
                selectedSecondary={commentControls.sortOrder}
                onSelect={handleCommentControlChange}
              />
            </Wrapper>
          }
        >
          <ProfileComments
            user={user}
            sortBy={commentControls.sortBy}
            sortOrder={commentControls.sortOrder}
          />
        </TabGrid>
      ),
    },
    {
      title: "Рецензії",
      content: (
        <TabGrid
          sidebar={
            <Wrapper className={styles.sideWrapper}>
              <SideMenu
                data={sortMenu}
                selected={reviewControls.sortBy}
                selectedSecondary={reviewControls.sortOrder}
                onSelect={handleReviewControlChange}
              />
            </Wrapper>
          }
        >
          <ProfileReviews
            user={user}
            sortBy={reviewControls.sortBy}
            sortOrder={reviewControls.sortOrder}
          />
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
                selected={collectionControls.sortBy}
                selectedSecondary={collectionControls.sortOrder}
                onSelect={handleCollectionControlChange}
              />
            </Wrapper>
          }
        >
          <ProfileCollections
            user={user}
            sortBy={
              collectionControls.sortBy === "rating" ? "RATING" : "CREATED_AT"
            }
            sortOrder={collectionControls.sortOrder}
          />
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
                data={generateFriendsMenu(user.friends ?? [])}
                selected={friendsFilter}
                onSelect={(v) => setFriendsFilter(v as any)}
              />
            </Wrapper>
          }
        >
          <ProfileFriends
            user={user}
            selfId={currentUser?._id ?? ""}
            mode={friendsFilter}
          />
        </TabGrid>
      ),
    },
  ];
};

export default profileTabs;
