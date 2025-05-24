"use client";

import clsx from "clsx";
import styles from "./input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  required,
  value,
  onChange,
  ...props
}: InputProps) {
  return (
    <div className={styles.inputWrapper}>
      {label && !value && (
        <label className={clsx(styles.label, required && styles.required)}>
          {label}
        </label>
      )}
      <input
        {...props}
        value={value}
        onChange={onChange}
        required={required}
        className={styles.input}
      />
    </div>
  );
}
