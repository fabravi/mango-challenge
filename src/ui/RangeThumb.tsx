import styles from "./rangethumb.module.scss";

export default function RangeThumb() {
  return <span tabIndex={0} role="thumb" className={styles.thumb}></span>;
}
