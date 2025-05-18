import React from "react";
import styles from "./submit-btn.module.scss";

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SubmitBtn = ({ children, ...props }: SubmitBtnProps) => {
  return (
    <button type="submit" className={styles.button} {...props}>
      {children}
    </button>
  );
};

export default SubmitBtn;
