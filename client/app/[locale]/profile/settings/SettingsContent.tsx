"use client";

import { useState, useEffect, DragEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Form/Input/Input";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import styles from "./settings.module.scss";
import clsx from "clsx";
import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import fallbackPfp from "@/assets/pfp.svg";
import fallbackBanner from "@/assets/banner.png";
import { useS3Image } from "@/hooks/useS3Image";
import { useTranslations } from "next-intl";

export default function ProfileSettingsContent() {
  const t = useTranslations("Profile");
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    avatar?: string;
    banner?: string;
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const MIN_BANNER_WIDTH = 1200;
  const MIN_BANNER_HEIGHT = 400;

  const resolvedAvatarUrl = useS3Image(
    "avatars",
    user?._id ?? "",
    fallbackPfp.src
  );
  const resolvedBannerUrl = useS3Image(
    "banners",
    user?._id ?? "",
    fallbackBanner.src
  );

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || "");
      setAvatarPreview(resolvedAvatarUrl);
      setBannerPreview(resolvedBannerUrl);
    }
  }, [user]);

  const validateImageDimensions = (
    file: File,
    minWidth: number,
    minHeight: number
  ): Promise<{ valid: boolean; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({
          valid: img.width >= minWidth && img.height >= minHeight,
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Failed to convert to WebP");
          },
          "image/webp",
          0.9
        );
      };

      img.onerror = reject;
    });
  };

  const upload = async (file: File, folder: "avatars" | "banners") => {
    const webpBlob = await convertToWebP(file);

    const res = await fetch("/api/s3url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        folder,
        fileName: `${user!._id}.webp`,
        fileType: "image/webp",
      }),
    });

    const { uploadUrl } = await res.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "image/webp",
      },
      body: webpBlob,
    });
  };

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = t("empty_nickname");
    }

    if (errors.avatar || errors.banner) {
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!user?._id) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: `
        mutation {
          updateUser(id: "${user._id}", edits: {
            username: """${username.trim()}""",
            bio: """${bio.trim()}"""
          }) {
            _id
          }
        }
      `,
      }),
    });

    if (avatarFile && !errors.avatar) await upload(avatarFile, "avatars");
    if (bannerFile && !errors.banner) await upload(bannerFile, "banners");

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    if (!user?._id) return;
    setDeleting(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: `
          mutation {
            deleteUser(id: "${user._id}")
          }
        `,
        }),
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(t("delete_failed"), err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    type: "avatar" | "banner"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type]: t("invalid_image_type"),
      }));
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(url);
      setErrors((prev) => ({ ...prev, avatar: undefined }));
    } else {
      const { valid, width, height } = await validateImageDimensions(
        file,
        MIN_BANNER_WIDTH,
        MIN_BANNER_HEIGHT
      );

      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          banner: t("banner_too_small", {
            width: MIN_BANNER_WIDTH,
            height: MIN_BANNER_HEIGHT,
            currentWidth: width,
            currentHeight: height,
          }),
        }));
        return;
      }

      setBannerFile(file);
      setBannerPreview(url);
      setErrors((prev) => ({ ...prev, banner: undefined }));
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type]: t("invalid_image_type"),
      }));
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "avatar") {
      setAvatarFile(file);
      setAvatarPreview(url);
      setErrors((prev) => ({ ...prev, avatar: undefined }));
    } else {
      const { valid, width, height } = await validateImageDimensions(
        file,
        MIN_BANNER_WIDTH,
        MIN_BANNER_HEIGHT
      );
      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          banner: t("banner_too_small", {
            width: MIN_BANNER_WIDTH,
            height: MIN_BANNER_HEIGHT,
            currentWidth: width,
            currentHeight: height,
          }),
        }));
        return;
      }
      setBannerFile(file);
      setBannerPreview(url);
      setErrors((prev) => ({ ...prev, banner: undefined }));
    }
  };

  return (
    <>
      <Container className={styles.container}>
        <h1>{t("profile_settings")}</h1>

        <Wrapper className={styles.info}>
          <label className={styles.label}>{t("nickname")}</label>
          <Input
            placeholder={t("nickname")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className={styles.label}>{t("about")}</label>
          <textarea
            className={styles.textarea}
            placeholder={t("about")}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </Wrapper>

        <Wrapper>
          <label className={styles.label}>{t("pfp")}</label>
          <div className={styles.imageRow}>
            <div
              className={styles.dropzone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "avatar")}
            >
              <p>{t("drag_pfp")}</p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => handleFileChange(e, "avatar")}
              />
            </div>

            {avatarPreview && (
              <div className={clsx(styles.preview, styles.avatarPreview)}>
                <img src={resolvedAvatarUrl} alt="Avatar preview" />
              </div>
            )}
          </div>
          {errors.avatar && <p className={styles.error}>{errors.avatar}</p>}
        </Wrapper>
        <Wrapper>
          <label className={styles.label}>{t("banner")}</label>
          <div className={styles.imageRow}>
            <div
              className={styles.dropzone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, "banner")}
            >
              <p>{t("drag_banner")}</p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => handleFileChange(e, "banner")}
              />
            </div>

            {bannerPreview && (
              <div className={clsx(styles.preview, styles.bannerPreview)}>
                <img src={resolvedBannerUrl} alt="Banner preview" />
              </div>
            )}
          </div>
          {errors.banner && <p className={styles.error}>{errors.banner}</p>}
        </Wrapper>
        <Wrapper className={styles.actions}>
          <Button onClick={handleSave}>{t("save")}</Button>
          <Button
            className={styles.deleteBtn}
            onClick={() => setShowDeleteModal(true)}
            variant="secondary"
          >
            {t("delete_acc")}
          </Button>
          {saved && <p className={styles.success}>{t("saved_msg")}</p>}
        </Wrapper>
      </Container>
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalWindow}>
            <h2>{t("confirm_delete_title")}</h2>
            <p>{t("confirm_delete_msg")}</p>
            <div className={styles.modalActions}>
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className={styles.modalControl}
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting}
                variant="primary"
                className={styles.modalControl}
              >
                {deleting ? t("deleting") : t("confirm_delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
