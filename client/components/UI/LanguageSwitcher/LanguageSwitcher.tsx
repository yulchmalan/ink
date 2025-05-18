"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { useTranslations } from "use-intl";

const LanguageSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations("UI");

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <>
      <label>{t("langSwitch")}</label>
      <select
        defaultValue={localActive}
        disabled={isPending}
        onChange={onSelectChange}
      >
        <option value="en">{t("english")}</option>
        <option value="uk">{t("ukrainian")}</option>
        <option value="pl">{t("polish")}</option>
      </select>
    </>
  );
};

export default LanguageSwitcher;
