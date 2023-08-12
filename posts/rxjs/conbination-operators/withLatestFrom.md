##### withLatestFrom 解决了 zip、combineLatest 中的多重继承问题（glitch）

glitch 问题的根源在于多个 Observable 同时有数据到来时都会向下游吐出数据，因此会出现同一个时刻吐出多个数据的情况

###### withLatestFrom 解决方式：

- 提供一个控制者 Observble 作为 Controller，其他 Observable 作为从属仅提供数据（不向下游提供数据）
- controller 向下游吐出数据（因此也把 Subscription 提供给下游）
- controller 自身有数据时会检查 从属者是否已经提供数据（而不管数据何时提供的）
- 上面三点决定了在订阅 controller 之前势必要先订阅从属者最后订阅 controller，也就给了当同时多个 Observable 吐出数据时从属者更新数据的机会

```javascript
const fakeWithLatestFrom = (...rest: any[]) => {
  let porject: Function | undefined;
  let others: Observable<any>[];
  let data: any[];
  const last = rest[rest.length - 1];
  if (typeof last === "function") {
    porject = last;
    others = rest.slice(0, -1);
    data = Array(rest.length - 1).fill(undefined);
  } else {
    porject = undefined;
    others = rest;
    data = Array(rest.length).fill(undefined);
  }

  return function (obs$: Observable<any>) {
    return Observable.create((observer: Subscriber<any>) => {
      others.forEach((item, index) => {
        item.subscribe(
          (val) => {
            data[index] = val;
          },
          (err) => observer.error(err)
        );
      });

      const subscription = obs$.subscribe(
        (value) => {
          if (data.every((v) => v !== undefined && v !== null)) {
            observer.next(
              porject ? porject.apply(null, [value, ...data]) : [value, ...data]
            );
          }
        },
        (err) => observer.error(err),
        () => observer.complete()
      );

      return subscription;
    });
  };
};

const source2$ = timer(500, 1000);
const source3$ = timer(100, 100);

const source1$ = timer(0, 2000).pipe(
  map((x) => x * 100),

  // source$1 处于主动地位（控制并发出最终形成的数据），数据不足时则不发送数据。
  // withLatestFrom参数中的Observables处于从属地位（仅提供数据）
  // withLatestFrom(source2$,)
  fakeWithLatestFrom(source2$, (a, b) => [a, b].join("-"))
);

// source1$.subscribe(
//     console.log,
//     console.error,
//     () => console.log("done")
// )

const original$ = timer(0, 1000);
const src2$ = timer(0, 1000).pipe(map((x) => x + "b"));

const src3$ = timer(0, 1000).pipe(
  map((x) => x + "c"),
  take(5)
);

// withLatestFrom 解决了zip、combineLatest中的多重继承问题（glitch）
// glitch 问题的根源在于多个Observable同时有数据到来时都会向下游吐出数据，因此会出现同一个时刻吐出多个数据的情况
// withLatestFrom解决方式：
// 1、提供一个控制者Observble作为Controller，其他Observable作为从属仅提供数据（不向下游提供数据）
// 2、controller向下游吐出数据（因此也把Subscription提供给下游）
// 3、controller自身有数据时会检查 从属者是否已经提供数据（而不管数据何时提供的）
// 上面三点决定了在订阅controller之前势必要先订阅从属者最后订阅controller，也就给了当同时多个Observable吐出数据时从属者更新数据的机会
const src1$ = original$.pipe(
  map((x) => x + "a"),
  withLatestFrom(src2$, src3$)
  // fakeWithLatestFrom(src2$, src3$)
);
console.log("start");
const sub = src1$.subscribe(console.log);
setTimeout(() => {
  sub.unsubscribe();
}, 10000);
```
