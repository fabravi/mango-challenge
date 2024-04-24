import { useEffect, useRef } from "react";
import styles from "./rangethumb.module.scss";

interface RangeThumbProps {
  left: number;
  isActive: boolean;
  setActive: (value: boolean) => void;
}

export default function RangeThumb({
  left,
  isActive,
  setActive,
}: RangeThumbProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.addEventListener("focus", (event) => {
      setActive(true);
    });

    ref.current?.addEventListener("blur", () => {
      setActive(false);
    });
  }, [setActive]);

  return (
    <span
      ref={ref}
      tabIndex={0}
      role="slider-thumb"
      className={`${styles.thumb} ${isActive ? styles.hover : ""}`}
      style={{ left: `${left}%` }}
    ></span>
  );
}
