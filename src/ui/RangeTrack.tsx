import styles from "./rangetrack.module.scss";

export default function RangeTrack({ left, width }) {
  console.log("RangeTrack", left, width);
  return (
    <span
      className={styles.track}
      style={{ left: `${left}%`, width: `${width}%` }}
    ></span>
  );
}
