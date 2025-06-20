"use client";

import Logo from "@/components/UI/Buttons/Logo/Logo";
import Container from "../Container/Container";
import styles from "./navbar.module.scss";
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import SimpleIconBtn from "@/components/UI/Buttons/SimpleIcon/SimpleIconBtn";
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
import Dots from "@/assets/icons/Dots";

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

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?._id) return;

    const fetchUnread = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          query {
            notifications(userId: "${user._id}") {
              read
            }
          }
        `,
        }),
      });

      const json = await res.json();
      const all = json.data?.notifications || [];
      const unread = all.filter((n: { read: boolean }) => !n.read).length;
      setUnreadCount(unread);
    };

    fetchUnread();
  }, [user?._id]);

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
              {isLoggedIn && user ? (
                <AvatarButton imgSrc={user._id} onClick={toggleSettings} />
              ) : (
                <SimpleIconBtn
                  aria-label="Menu"
                  icon={<Dots />}
                  onClick={toggleSettings}
                />
              )}
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
                        toggleSettings();
                      });
                    } else {
                      startTransition(() => {
                        router.push("/register");
                        toggleSettings();
                      });
                    }
                    setIsNavActive(false);
                  }}
                >
                  {!isLoggedIn && (
                    <>
                      <span></span>
                      <p>{t("guest")}</p>
                    </>
                  )}
                  {isLoggedIn && user && (
                    <>
                      <User />
                      <p>{user.username}</p>
                    </>
                  )}
                </li>

                {isLoggedIn && user && (
                  <li
                    onClick={() => {
                      startTransition(() => {
                        router.push("/profile/settings");
                        toggleSettings();
                      });
                      setIsSettingsOpen(false);
                      setIsNavActive(false);
                    }}
                  >
                    <Settings />
                    {t("settings")}
                  </li>
                )}

                {isLoggedIn && user && (
                  <li
                    onClick={() => {
                      startTransition(() => {
                        router.push("/profile/notifications");
                        toggleSettings();
                      });
                      setIsSettingsOpen(false);
                      setIsNavActive(false);
                    }}
                  >
                    <Bell />
                    {unreadCount > 0 && (
                      <span className={styles.badge}>{unreadCount}</span>
                    )}
                    {t("notifications")}
                  </li>
                )}

                <li>
                  <LanguageSwitcher />
                </li>

                <li>
                  <ThemeToggle />
                </li>

                {isLoggedIn && (
                  <li
                    onClick={() => {
                      logout();
                      toggleSettings();
                    }}
                    className={styles.exit}
                  >
                    <LogOut />
                    {t("logout")}
                  </li>
                )}
                {!isLoggedIn && (
                  <li className={styles.listItemBtn}>
                    <Link href="/login" className={styles.fullWidth}>
                      <Button
                        className={styles.fullWidth}
                        onClick={() => {
                          setIsNavActive(false);
                          toggleSettings();
                        }}
                      >
                        {t("login")}
                        <Log />
                      </Button>
                    </Link>
                  </li>
                )}
                {!isLoggedIn && (
                  <li className={styles.listItemBtn}>
                    <Link href="/register" className={styles.fullWidth}>
                      <Button
                        variant="secondary"
                        className={styles.fullWidth}
                        onClick={() => {
                          setIsNavActive(false);
                          toggleSettings();
                        }}
                      >
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
