import styles from "./rangetrack.module.scss";

export default function RangeTrack({ left, width }) {
  return (
    <span
      role="slider-track"
      className={styles.track}
      style={{ left: `${left}%`, width: `${width}%` }}
    ></span>
  );
}
