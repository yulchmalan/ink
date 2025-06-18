"use client";

import { useState } from "react";
import styles from "./details.module.scss";
import { format } from "date-fns";
import { useTranslations } from "use-intl";
import { User } from "@/types/user";
import Info from "@/assets/icons/Info";
import GenreStats from "./GenreStats/GenreStats";
import StatTag from "./Stats/StatTag";
import LevelProgress from "./LevelProgress/LevelProgress";
import Button from "@/components/UI/Buttons/StandartButton/Button";

interface Props {
  user: User;
}

export default function UserInfoModal({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Profile");

  const bio = user.bio || "";
  const joined = user.createdAt
    ? format(new Date(user.createdAt), "dd.MM.yyyy")
    : "-";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={styles.infoButton}
        aria-label="User details"
      >
        <Info />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <section>
              <h2>{t("exp")}</h2>
              <LevelProgress totalExp={user.exp}></LevelProgress>
            </section>
            <section>
              <h2>{t("genre_stats")}</h2>
              <GenreStats />
            </section>
            <section>
              <h2>{t("about_me")}</h2>
              <div className={styles.info}>
                <div>
                  <h3>{t("bio")}:</h3>
                  <p>{bio || t("noBio")}</p>
                </div>
                <div>
                  <h3>{t("joined")}:</h3>
                  <p>{joined}</p>
                </div>
              </div>
            </section>
            <Button
              variant="secondary"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
