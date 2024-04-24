import { useRef } from "react";
import styles from "./rangethumb.module.scss";

export default function RangeThumb({ left, isDragging }: any) {
  const ref = useRef<HTMLDivElement>(null);

  ref.current?.addEventListener("mouseover", () => {
    console.log("mouseover");
  });

  return (
    <span
      ref={ref}
      tabIndex={0}
      role="thumb"
      className={styles.thumb}
      style={{ left: `${left}%`, pointerEvents: isDragging ? "none" : "auto" }}
    ></span>
  );
}
