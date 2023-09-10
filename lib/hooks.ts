"use Client";

import { RefObject, useMemo } from "react";

export const useClickOutside = (
  targetRef: RefObject<HTMLElement>,
  callback: Function,
  parentDom?: HTMLElement | Document,
) => {
  const handleClick = (e: Event) => {
    if (
      e.target &&
      targetRef.current &&
      !targetRef.current.contains(e.target as HTMLElement)
    ) {
      callback.call(null);
    }
  };

  let start = () =>
    (parentDom || document).addEventListener("click", handleClick);
  let end = () =>
    (parentDom || document).removeEventListener("click", handleClick);

  return () => [start, end];
};

export function useDebounce(fn: Function, ms: number) {
  let timer: NodeJS.Timeout | undefined = undefined;

  const debounced = (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(null, args);
      timer = undefined;
    }, ms);
  };

  return useMemo(() => debounced, [fn, ms]);
}
