"use client";

import { useState } from "react";
import styles from "./details.module.scss";
import { format } from "date-fns";
import { useTranslations } from "use-intl";
import { User } from "@/types/user";
import Info from "@/assets/icons/Info";
import GenreStats from "./GenreStats/GenreStats";
import StatTag from "./Stats/StatTag";
import ProgressBar from "@/components/UI/ProgressBar/ProgressBar";
import LevelProgress from "./LevelProgress/LevelProgress";
import Button from "@/components/UI/Buttons/StandartButton/Button";

interface Props {
  user: User;
}

export default function UserInfoModal({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("User");

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
              <h2>Досвід</h2>
              <LevelProgress totalExp={user.exp}></LevelProgress>
            </section>
            <section>
              <h2>Статистика за жанрами</h2>
              <GenreStats />
            </section>
            <section>
              <h2>Статистика</h2>
              <div className={styles.stats}>
                <StatTag value={0} label="Створено тайтлів"></StatTag>
                <StatTag value={0} label="Додано матеріалів"></StatTag>
                <StatTag value={0} label="Додано коментарів"></StatTag>
              </div>
            </section>
            <section>
              <h2>Про себе</h2>
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
