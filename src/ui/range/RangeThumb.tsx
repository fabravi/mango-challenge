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
    const { current } = ref;
    if (!current) return;

    const handleFocus = () => {
      setActive(true);
    };

    const handleBlur = () => {
      setActive(false);
    };

    current.addEventListener("focus", handleFocus);
    current.addEventListener("blur", handleBlur);

    return () => {
      current.removeEventListener("focus", handleFocus);
      current.removeEventListener("blur", handleBlur);
    };
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
