import styled from "styled-components";
import { COLORS_RGBA } from "../../../utils/colors";

export const WrapperS = styled.div`
  position: relative;
  width: 100%;
`;

export const SelectBtnS = styled.div<{ isOpen?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  border: solid 1px ${COLORS_RGBA.default(0.2)};
  border-radius: 6px;
  height: 48px;
  align-items: center;
  padding: 13px 16px;
  cursor: pointer;

  .svgIconSelect {
    margin-right: 10px;
  }

  &:hover {
    border-color: ${COLORS_RGBA.accent(1)};
  }

  svg {
    transition: 0.2s;
    ${({ isOpen }) =>
      isOpen
        ? `
   transform: translateY(1px) scale(1, -1);
  `
        : ""}
  }
`;

export const SelectSpanS = styled.span<{ active?: boolean }>`
  font-size: 1.6rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  padding-right: 5px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ active }) => (active ? `  opacity: 1;` : `  opacity: 0.6;`)}

  .multiSpan {
    max-width: 200px;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
  }
`;

export const LabelS = styled.div`
  span {
    font-size: 1.4rem;
    display: block;
    color: ${COLORS_RGBA.default(0.8)};
    font-weight: 400;
  }
  margin-bottom: 5px;
`;

export const ItemsWrapperS = styled.ul<{ top?: boolean }>`
  position: absolute;

  left: 0;
  width: 100%;
  max-height: 300px;
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 4px 23px 0 rgba(42, 47, 42, 0.16);
  background-color: #ffffff;
  margin: 0;
  padding: 0;
  z-index: 2;
  ${({ top }) =>
    top
      ? `
    bottom: 100%;
  `
      : `
    top: 100%;
  `}
`;
export const ItemS = styled.li<{ noItems?: boolean }>`
  & > span {
    flex: 1;
    font-size: 1.6rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    padding: 13px 16px;
    letter-spacing: normal;
    display: flex;
    align-items: center;
    cursor: pointer;

    svg {
      color: ${COLORS_RGBA.accent()};
      width: 25px;
      height: 25px;
      min-width: 18px;
      min-height: 18px;
    }

    & > * {
      &:first-child {
        flex: 1;
      }
    }

    &:hover {
      background: ${COLORS_RGBA.accent(0.13)};
    }

    &:active {
      background: ${COLORS_RGBA.accent(1)};
      color: white;
    }
  }

  ${({ noItems }) =>
    noItems
      ? `
    padding: 10px;
  `
      : ``}
`;
