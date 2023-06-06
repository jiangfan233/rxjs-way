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


export async function removeOldVersion(versionKey: string) {
  return caches
    .keys()
    .then((keys) => keys.filter((key) => key !== versionKey))
    .then((keys) =>
      Promise.all(
        keys.map((k) => {
          caches.delete(k);
          return k;
        })
      )
    );
}


export async function fetchWIthTimeout(url: RequestInfo | URL, options: RequestInit | undefined = {}, ms: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => {
    ctrl.abort();
  }, ms);
  const res = await fetch(url, { ...options, signal: ctrl.signal });
  if (res.status == 200) clearTimeout(id);
  return res;
}