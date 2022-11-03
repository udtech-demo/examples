import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import { COLORS, COLORS_RGBA } from "../../../utils/colors";

export const WrapperS = styled.div<{ error?: boolean }>`
  position: relative;
  ${({ error }) =>
    error
      ? `

label {
  span {
    color: ${COLORS.danger};
  }
}

input {
  border-color: ${COLORS.danger};
}

`
      : ``}
`;
export const LabelS = styled.label`
  span {
    font-size: 1.4rem;
    display: block;
    color: ${COLORS_RGBA.default(0.8)};
    margin-bottom: 5px;
    font-weight: 400;
  }
`;

export const InputS = styled.input``;
export const TextAreaS = styled(TextareaAutosize)`
  max-width: 100%;
  min-width: 100%;
`;

export const ErrorTextS = styled.p`
  margin-top: 2px;
  color: ${COLORS.danger};
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 0.2px;
`;

export const CounterS = styled.p<{ isGreen?: boolean }>`
  position: absolute;
  color: ${({ isGreen }) => (isGreen ? COLORS_RGBA.accent() : "#2a2f2a")};
  opacity: ${({ isGreen }) => (isGreen ? "1" : "0.5")};
  margin: 0;
  padding: 0;
  bottom: 10px;
  right: 20px;
  font-size: 12px;
`;
