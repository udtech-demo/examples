import React from "react";
import { DefInputProps } from "./types";
import * as Styles from "./inputStyles";

interface TextAreaProps extends DefInputProps {
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label = "",
  placeholder = "",
  classInput = "",
  classWrapper = "",
  errorText,
  name,
  stylesWrapper,
  onChange,
  autoFocus,
  value,
  maxLength,
}) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <Styles.WrapperS style={stylesWrapper} error={!!errorText}>
      <Styles.LabelS className={classWrapper}>
        {label ? <span>{label}</span> : null}
        <Styles.TextAreaS
          autoFocus={autoFocus}
          onChange={(e) => {
            if (
              (maxLength && maxLength >= e.currentTarget.value.length) ||
              !maxLength
            )
              onChange(e);
          }}
          className={classInput}
          name={name}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {maxLength && (
          <Styles.CounterS isGreen={focused}>
            {value.length}/{maxLength}
          </Styles.CounterS>
        )}
      </Styles.LabelS>
      {errorText ? <Styles.ErrorTextS>{errorText}</Styles.ErrorTextS> : null}
    </Styles.WrapperS>
  );
};
