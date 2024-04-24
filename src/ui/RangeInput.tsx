import { useEffect, useRef, useState } from "react";
import styles from "./rangeinput.module.scss";

export default function RangeInput({
  name,
  value: valueProp,
  min,
  max,
  onChange,
  readOnly,
}: any) {
  const [value, setValue] = useState(valueProp?.toFixed(2));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (valueProp === value) return;
    setError(false);
    valueProp = valueProp?.toFixed(2);

    setValue(valueProp);
  }, [valueProp]);

  return (
    <fieldset className={styles.fieldset}>
      <label htmlFor={name} className={error ? styles.error : ""}>
        €
      </label>
      <input
        type="number"
        id={name}
        name={name}
        className={`${styles.input} ${error ? styles.error : ""}`}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        readOnly={readOnly}
        onBlur={(e) => {
          const value = Number(e.target.value);
          if (value < min || value > max) {
            setError(true);
            return;
          }
          onChange(Number(e.target.value));
          setError(false);
        }}
        onFocus={(e) => {
          if (readOnly) return;
          e.target.select();
        }}
      />
    </fieldset>
  );
}
