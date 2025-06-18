"use client";

import Input from "@/components/Form/Input/Input";
import SubmitBtn from "@/components/Form/SubmitBtn/SubmitBtn";
import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./form.module.scss";
import { useAuth } from "@/contexts/AuthContext";
import Github from "@/assets/icons/Github";
import Discord from "@/assets/icons/Discord";
import Google from "@/assets/icons/Google";
import { useCallbackUrl } from "@/hooks/useCallbackUrl";
import { useTranslations } from "next-intl";

const Form = () => {
  const t = useTranslations("Login");
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const { redirect, socialSignIn } = useCallbackUrl();

  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(false);
  const captchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const html = document.documentElement;
    setTheme(html.classList.contains("dark") ? "dark" : "light");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!recaptchaToken || recaptchaToken.trim() === "") {
      setError(t("error_no_captcha"));
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
            mutation Login($input: LoginInput!, $recaptchaToken: String!) {
              loginUser(input: $input, recaptchaToken: $recaptchaToken) {
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
            },
            recaptchaToken: recaptchaToken!,
          },
        }),
      });

      const text = await res.text();
      const json = JSON.parse(text);

      captchaRef.current?.reset();
      setRecaptchaToken(null);

      if (json.errors) {
        const message = json.errors[0].message;
        const code = json.errors[0].extensions?.code;

        if (code === "RECAPTCHA_FAILED") {
          setError(t("error_captcha_failed"));
        } else if (message === "User not found") {
          setError(t("error_user_not_found"));
        } else if (message === "Invalid credentials") {
          setError(t("error_invalid_credentials"));
        } else {
          setError(t("error_unknown") + ": " + message);
        }
      } else {
        localStorage.setItem("token", json.data.loginUser.token);
        login(json.data.loginUser.token);
        redirect();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || t("error_network"));
      captchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          name="email"
          label="Email"
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

        <ReCAPTCHA
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={handleCaptchaChange}
          theme={theme}
          className={styles.center}
        />

        {error && <p className={styles.error}>{error}</p>}
        <SubmitBtn disabled={isLoading}>
          {isLoading ? t("loading") : t("login")}
        </SubmitBtn>
      </form>

      <p className={styles.center}>{t("or_social")}</p>
      <div className={styles.socials}>
        <button
          onClick={() => socialSignIn("github")}
          className={styles.social}
        >
          <Github />
        </button>
        <button
          onClick={() => socialSignIn("google")}
          className={styles.social}
        >
          <Google />
        </button>
        <button
          onClick={() => socialSignIn("discord")}
          className={styles.social}
        >
          <Discord />
        </button>
      </div>
    </>
  );
};

export default Form;
