"use client";

import Logo from "@/components/UI/Buttons/Logo/Logo";
import Container from "../Container/Container";
import styles from "./navbar.module.scss";
import React, { useState } from "react";
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

export default function Navbar() {
  const [isNavActive, setIsNavActive] = useState(false);
  const toggleNav = () => setIsNavActive(!isNavActive);
  const t = useTranslations("Navigation");
  const logged = true;

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
            {logged && <SimpleIconBtn icon={<PlusCircle />} />}
            {logged && <SimpleIconBtn icon={<Settings />} />}
            <div className={styles.searchIcon}>
              <SimpleIconBtn icon={<Search />} />
            </div>
            {logged && <SimpleIconBtn icon={<Bell />} />}
            {!logged && (
              <Button>
                <Log />
                {t("login")}
              </Button>
            )}
            {logged && (
              <div className={styles.PfpContainer}>
                <AvatarButton href="/profile" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}
