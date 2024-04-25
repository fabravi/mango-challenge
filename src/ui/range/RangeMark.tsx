import styles from "./rangemark.module.scss";

interface RangeMarkProps {
  left: number;
}

export default function RangeMark({ left }: RangeMarkProps) {
  return <span className={styles.mark} style={{ left: `${left}%` }}></span>;
}
