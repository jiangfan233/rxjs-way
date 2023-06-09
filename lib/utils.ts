export const debounce = (callback: Function, ms: number, ...args: any[]) => {
  callback.apply(null, args);
  let timer: NodeJS.Timeout | undefined = undefined;

  return () => {
    if(timer) {
      window.clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(null, args);
      timer = undefined;
    }, ms);
  }
}

export const handleScreenResize = (callback: Function, ms: number, ...args: any[]) => {
  window.onresize = debounce(callback, ms);

  return () => {window.onresize = null};
} 

export const isProd = () => process.env.NODE_ENV === "production";
export const isDev = () => process.env.NODE_ENV === "development";