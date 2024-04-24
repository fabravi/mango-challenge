import styles from "./rangemark.module.scss";

export default function RangeMark({ left }: any) {
  return <span className={styles.mark} style={{ left: `${left}%` }}></span>;
}
