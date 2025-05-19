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
import LogOut from "@/assets/icons/LogOut";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Navigation");
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

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
            <li
              onClick={() => {
                router.push("/");
              }}
            >
              <span>{t("mainpage")}</span>
            </li>
            <li
              onClick={() => {
                router.push("/catalog");
              }}
            >
              <span>{t("catalog")}</span>
            </li>
            <li
              onClick={() => {
                router.push("/contacts");
              }}
            >
              <span>{t("contacts")}</span>
            </li>
          </ul>
          <div className={styles.endFlex}>
            <SimpleIconBtn icon={<Search />} className={styles.desktopIcon} />
            <div className={styles.PfpContainer} ref={avatarBtnRef}>
              <AvatarButton
                {...(isLoggedIn && user
                  ? {
                      imgSrc: `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/avatars/${user._id}.jpg`,
                    }
                  : {})}
                onClick={toggleSettings}
              />
            </div>
            <div
              ref={settingsRef}
              className={clsx(styles.settings, {
                [styles.active]: isSettingsOpen,
              })}
            >
              <ul>
                <li
                  onClick={() => {
                    if (isLoggedIn && user) {
                      router.push(`/profile/${user._id}`);
                    } else {
                      router.push("/register");
                    }
                  }}
                >
                  {!isLoggedIn && (
                    <>
                      <span></span>
                      <p>Гість</p>
                    </>
                  )}
                  {isLoggedIn && user && (
                    <>
                      <User />
                      <p>{user.username}</p>
                    </>
                  )}
                </li>
                {isLoggedIn && (
                  <li>
                    <PlusCircle />
                    Додати
                  </li>
                )}
                {isLoggedIn && (
                  <li>
                    <Settings />
                    Налаштування
                  </li>
                )}
                {isLoggedIn && (
                  <li>
                    <Bell />
                    Повідомлення
                  </li>
                )}
                {isLoggedIn && (
                  <li onClick={logout}>
                    <LogOut />
                    Вийти
                  </li>
                )}
                {!isLoggedIn && (
                  <li className={styles.listItemBtn}>
                    <Link href="/login" className={styles.fullWidth}>
                      <Button className={styles.fullWidth}>
                        {t("login")}
                        <Log />
                      </Button>
                    </Link>
                  </li>
                )}
                {!isLoggedIn && (
                  <li className={styles.listItemBtn}>
                    <Link href="/register" className={styles.fullWidth}>
                      <Button variant="secondary" className={styles.fullWidth}>
                        {t("reg")}
                      </Button>
                    </Link>
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
