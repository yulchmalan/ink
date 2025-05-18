"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, required, ...props }: InputProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

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
        onChange={handleChange}
        required={required}
        className={styles.input}
      />
    </div>
  );
}
