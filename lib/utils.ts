import { generateFakeData } from "./canvas";

export const debounce = (callback: Function, ms: number, ...args: any[]) => {
  callback.apply(null, args);
  let timer: NodeJS.Timeout | undefined = undefined;

  return () => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(null, args);
      timer = undefined;
    }, ms);
  };
};

export function throttle(cb: Function, delay: number = 500, ...args: any[]) {
  let id: NodeJS.Timeout | null = null;

  return function fn() {
    if (id !== null) return;
    id = setTimeout(() => {
      cb.apply(null, args);
      id = null;
    }, delay);
  };
}

export const handleScreenResize = (
  callback: Function,
  ms: number,
  ...args: any[]
) => {
  window.onresize = debounce(callback, ms);

  return () => {
    window.onresize = null;
  };
};

export const isProd = () => process.env.NODE_ENV === "production";
export const isDev = () => process.env.NODE_ENV === "development";

export function isMobile() {
  let flag =
    navigator &&
    navigator.userAgent &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return flag;
}

export async function getData(currentPage: number, perPage: number) {
  const res = await generateFakeData(currentPage, perPage);
  return { data: res };
}

export function callWhenIdle(cb: Function, delay = 100) {
  return requestAnimationFrame(() => {
    cb.call(null);
    let id = setTimeout(() => {
      callWhenIdle(cb);
      clearTimeout(id);
    }, delay);
  });
}
