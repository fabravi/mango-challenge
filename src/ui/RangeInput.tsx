import { useCallback, useEffect, useState } from "react";
import styles from "./rangeinput.module.scss";

interface RangeInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

export default function RangeInput({
  name,
  value: valueProp,
  min,
  max,
  onChange,
  readOnly,
}: RangeInputProps) {
  const [value, setValue] = useState(valueProp?.toFixed(2));
  const [error, setError] = useState(false);

  const changeValue = useCallback(
    (value: number) => {
      if (value < min || value > max) {
        setError(true);
        return;
      }

      setValue(valueProp?.toFixed(2));
      setError(false);
      onChange(value);
    },
    [valueProp, min, max, onChange],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        changeValue(Number(value));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [value, changeValue]);

  useEffect(() => {
    setError(false);
    let value = valueProp?.toFixed(2);
    setValue(value);
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
          changeValue(Number(e.target.value));
        }}
        onFocus={(e) => {
          if (readOnly) return;
          e.target.select();
        }}
      />
    </fieldset>
  );
}
