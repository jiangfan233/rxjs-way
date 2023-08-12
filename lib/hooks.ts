import { RefObject } from "react";

export const useClickOutside = (
  targetRef: RefObject<HTMLElement>,
  callback: Function,
  parentDom?: HTMLElement | Document,
) => {
  const handleClick = (e: Event) => {
    if (e.target && !targetRef.current?.contains(e.target as HTMLElement)) {
      callback.call(null);
    }
  };

  let start = () =>
    (parentDom || document).addEventListener("click", handleClick);
  let end = () =>
    (parentDom || document).removeEventListener("click", handleClick);

  return () => [start, end];
};
