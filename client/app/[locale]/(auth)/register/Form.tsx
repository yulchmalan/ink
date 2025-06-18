"use client";

import Input from "@/components/Form/Input/Input";
import SubmitBtn from "@/components/Form/SubmitBtn/SubmitBtn";
import React, { useState } from "react";
import styles from "./form.module.scss";
import Github from "@/assets/icons/Github";
import Google from "@/assets/icons/Google";
import Discord from "@/assets/icons/Discord";
import { useCallbackUrl } from "@/hooks/useCallbackUrl";
import { useTranslations } from "next-intl";

const Form = () => {
  const t = useTranslations("Registration");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { redirect, socialSignIn } = useCallbackUrl();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setError(t("error_password_mismatch"));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                token
                user {
                  _id
                  email
                  username
                }
              }
            }
          `,
          variables: {
            input: {
              email: form.email,
              password: form.password,
              username: form.username,
            },
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        const error = json.errors[0];
        const code = error.extensions?.code;

        switch (code) {
          case "EMAIL_EXISTS":
            setError(t("error_email_exists"));
            break;
          default:
            setError(t("error_generic") + ": " + error.message);
        }
      } else {
        localStorage.setItem("token", json.data.registerUser.token);
        redirect();
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(t("error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        name="email"
        label={t("email")}
        required
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        label={t("password")}
        required
        value={form.password}
        onChange={handleChange}
      />
      <Input
        name="confirmPassword"
        type="password"
        label={t("confirm_password")}
        required
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <Input
        name="username"
        label={t("username")}
        required
        value={form.username}
        onChange={handleChange}
      />

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.center}>{t("or_social")}</p>
      <div className={styles.socials}>
        <button
          onClick={() => socialSignIn("github")}
          type="button"
          className={styles.social}
        >
          <Github />
        </button>
        <button
          onClick={() => socialSignIn("google")}
          type="button"
          className={styles.social}
        >
          <Google />
        </button>
        <button
          onClick={() => socialSignIn("discord")}
          type="button"
          className={styles.social}
        >
          <Discord />
        </button>
      </div>

      <SubmitBtn disabled={isLoading}>
        {isLoading ? t("loading") : t("register")}
      </SubmitBtn>
    </form>
  );
};

export default Form;
