import styles from "./rangetrack.module.scss";

interface RangeTrackProps {
  left: number;
  width: number;
}

export default function RangeTrack({ left, width }: RangeTrackProps) {
  return (
    <span
      role="slider-track"
      className={styles.track}
      style={{ left: `${left}%`, width: `${width}%` }}
    ></span>
  );
}
