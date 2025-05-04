"use client";

import Logo from "@/components/UI/Buttons/Logo/Logo";
import Container from "../Container/Container";
import styles from "./navbar.module.scss";
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import SimpleIconBtn from "@/components/UI/Buttons/SimpleIcon/SimpleIconBtn";
import PlusCircle from "@/assets/icons/PlusCircle";
import Log from "@/assets/icons/Log";
import Search from "@/assets/icons/Search";
import Bell from "@/assets/icons/Bell";
import Settings from "@/assets/icons/Settings";
import AvatarButton from "@/components/UI/Buttons/AvatarButton/AvatarButton";
import Menu from "@/assets/icons/Menu";
import { useTranslations } from "use-intl";
import User from "@/assets/icons/User";

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navigation");
  const logged = true;

  const toggleNav = () => setIsNavActive(!isNavActive);

  const toggleSettings = () => {
    if (window.innerWidth >= 890) {
      setIsSettingsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        settingsRef.current &&
        !settingsRef.current.contains(target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(target)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className={clsx(styles.navbar, { [styles.navActive]: isNavActive })}>
      <Container className={styles.container}>
        <SimpleIconBtn
          icon={<Menu />}
          onClick={toggleNav}
          className={styles.mobileIcon}
        />
        <SimpleIconBtn icon={<Search />} className={styles.mobileIcon} />
        <div className={styles.navFlex}>
          <Logo className={styles.logo} />
          <ul className={styles.navList}>
            <li>
              <a href="">{t("mainpage")}</a>
            </li>
            <li>
              <a href="">{t("catalog")}</a>
            </li>
            <li>
              <a href="">{t("contacts")}</a>
            </li>
          </ul>
          <div className={styles.endFlex}>
            <div className={styles.PfpContainer} ref={avatarBtnRef}>
              <AvatarButton onClick={toggleSettings} />
            </div>

            <div
              ref={settingsRef}
              className={clsx(styles.settings, {
                [styles.active]: isSettingsOpen,
              })}
            >
              <ul>
                <li>
                  {!logged && <p>Гість</p>}
                  {logged && (
                    <>
                      <p>Профіль</p>
                      <SimpleIconBtn icon={<User />} />
                    </>
                  )}
                </li>
                <li>
                  <div className={styles.searchIcon}>
                    Пошук
                    <SimpleIconBtn icon={<Search />} />
                  </div>
                </li>
                {logged && (
                  <li>
                    Додати
                    <SimpleIconBtn icon={<PlusCircle />} />
                  </li>
                )}
                {logged && (
                  <li>
                    Налаштування
                    <SimpleIconBtn icon={<Settings />} />
                  </li>
                )}
                {logged && (
                  <li>
                    Повідомлення
                    <SimpleIconBtn icon={<Bell />} />
                  </li>
                )}
                {!logged && (
                  <li>
                    <Button className={styles.fullWidth}>
                      {t("login")}
                      <Log />
                    </Button>
                  </li>
                )}
                {!logged && (
                  <li>
                    <Button variant="secondary" className={styles.fullWidth}>
                      {t("reg")}
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
