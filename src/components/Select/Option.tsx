import { useRef, useEffect, PropsWithChildren } from "react";

type OptionProps = {
  selected: boolean;
  onClick: () => void;
};

export const Option = ({
  children,
  selected,
  onClick,
}: PropsWithChildren<OptionProps>) => {
  const optionRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (selected) {
      optionRef.current?.scrollIntoView?.({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selected]);

  return (
    <li
      tabIndex={0}
      ref={optionRef}
      className={`dropdown-option ${
        selected ? "dropdown-option--selected" : ""
      } `}
      role="option"
      aria-selected={selected}
      aria-activedescendant="id"
      onClick={() => onClick()}
    >
      {children}
    </li>
  );
};
