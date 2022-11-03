import React from "react";
import { SelectItemType } from "./types";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { mainClass, SelectClasses } from "../../../utils/animatedStyles";
import { delay } from "../../../utils/helpers";
import * as Styles from "./SelectStyles";
import { ArrowIcon, CheckIcon } from "../../svgs";

interface DefaultSelectProps {
  data: SelectItemType[];
  selected: SelectItemType | null;
  placeHolder?: string;
  icon?: React.FC;
  label?: string;
  isMultiple?: boolean;
  activeSelects?: SelectItemType[];
  onChange: (item: SelectItemType) => void;
  isOpenHandler?: (isOpen: boolean) => void;
  openToTop?: boolean;
}

export const DefaultSelect: React.FC<DefaultSelectProps> = ({
  data,
  selected,
  onChange,
  label,
  placeHolder,
  icon: Icon,
  isOpenHandler,
  isMultiple,
  activeSelects = [] as SelectItemType[],
  openToTop,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  const hideList = async () => {
    if (modalRef && modalRef.current) {
      modalRef.current.classList.remove(SelectClasses.in);
      modalRef.current.classList.add(SelectClasses.out);
      await delay(100);
      setIsOpen(false);
    }
  };

  const { ref } = useOutsideClick(() => {
    if (isOpen) {
      hideList();
    }
  });

  return (
    <Styles.WrapperS className="ov-select" ref={ref}>
      {label ? <Styles.LabelS>{label}</Styles.LabelS> : null}

      <Styles.SelectBtnS
        isOpen={isOpen}
        className="ov-select-wr"
        onClick={() => {
          setIsOpen(true);
          if (isOpenHandler) isOpenHandler(true);
        }}
      >
        {Icon && (
          <span className="svgIconSelect">
            <Icon />
          </span>
        )}
        <Styles.SelectSpanS active={!!selected}>
          {selected ? (
            isMultiple && activeSelects[0] ? (
              <span className="multiSpan">
                {activeSelects.map(
                  (s, i) =>
                    s.title + (activeSelects.length === i + 1 ? "" : ", ")
                )}{" "}
              </span>
            ) : (
              selected.title
            )
          ) : (
            placeHolder
          )}
        </Styles.SelectSpanS>
        {data[1] && <ArrowIcon />}
      </Styles.SelectBtnS>

      {!isOpen ? null : (
        <Styles.ItemsWrapperS
          top={openToTop}
          ref={modalRef}
          className={`${mainClass} ${SelectClasses.in}`}
        >
          {data && data[0] ? (
            data.map((itm) => {
              if (!isMultiple && selected && selected.id === itm.id)
                return null;
              return (
                <Styles.ItemS key={itm.id}>
                  <span
                    onClick={() => {
                      if (!isMultiple) {
                        hideList();
                      }
                      onChange(itm);
                    }}
                  >
                    <span>{itm.title}</span>

                    {isMultiple &&
                      activeSelects.find((it) => it.value === itm.value) && (
                        <CheckIcon />
                      )}
                  </span>
                </Styles.ItemS>
              );
            })
          ) : (
            <Styles.ItemS noItems>No items</Styles.ItemS>
          )}
        </Styles.ItemsWrapperS>
      )}
    </Styles.WrapperS>
  );
};
