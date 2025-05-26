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
import SearchOverlay from "@/components/Layout/SearchOverlay/SearchOverlay";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import LanguageSwitcher from "@/components/UI/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Nav");
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
          aria-label={t("menu")}
          icon={<Menu />}
          onClick={toggleNav}
          className={styles.mobileIcon}
        />
        <SimpleIconBtn
          aria-label={t("search")}
          icon={<Search />}
          onClick={() => setIsSearchOpen(true)}
          className={styles.mobileIcon}
        />
        <div className={styles.navFlex}>
          <Logo className={styles.logo} />
          <ul className={styles.navList}>
            <li
              onClick={() => {
                startTransition(() => {
                  router.push("/");
                });
                setIsNavActive(false);
              }}
            >
              <span>{t("mainpage")}</span>
            </li>
            <li
              onClick={() => {
                startTransition(() => {
                  router.push("/catalog");
                });
                setIsNavActive(false);
              }}
            >
              <span>{t("catalog")}</span>
            </li>
            <li
              onClick={() => {
                startTransition(() => {
                  router.push("/contacts");
                });
                setIsNavActive(false);
              }}
            >
              <span>{t("contacts")}</span>
            </li>
          </ul>
          <div className={styles.endFlex}>
            <SimpleIconBtn
              aria-label={t("search")}
              onClick={() => setIsSearchOpen(true)}
              icon={<Search />}
              className={styles.desktopIcon}
            />
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
                      startTransition(() => {
                        router.push(`/profile/${user._id}`);
                      });
                    } else {
                      startTransition(() => {
                        router.push("/register");
                      });
                    }
                    setIsNavActive(false);
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
                    <Settings />
                    Налаштування
                  </li>
                )}

                <li>
                  <LanguageSwitcher />
                </li>

                <li>
                  <ThemeToggle />
                </li>

                {isLoggedIn && (
                  <li onClick={logout} className={styles.exit}>
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
      {isSearchOpen && (
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </nav>
  );
}
