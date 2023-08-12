##### race 第一个吐出数据Observable对象保留订阅状态，其他observable直接取消订阅；"赢者通吃"

```javascript
const fakeRace = (...rest: Observable<any>[]): Observable<any> => {
  return Observable.create((observer: Subscriber<any>) => {
    let idx: number = -1;

    const subs = rest.map((obs$, index) => {
      return obs$.subscribe((val) => {
        if (idx <= -1) {
          // idx用来保留第一个吐出数据的 Obs，其他Obs都会取消订阅
          idx = index;
          subs
            .filter((_, index) => index !== idx)
            .forEach((sub) => sub.unsubscribe());
        }
        console.log("inner", val);
        observer.next(val);
      });
    });

    // 需要把 subscription 放在堆上来以保证 unsubscribe 访问到最新的 idx
    return {
      unsubscribe() {
        // 这里需要考虑两种情况：
        // a、下游取消订阅时，上游仅有一个处于订阅状态的 Observable
        // b、下游取消订阅时，上游所有Observables都处于订阅状态
        if (idx <= -1) {
          subs.forEach((sub) => sub.unsubscribe());
        } else {
          subs[idx].unsubscribe();
        }
      },
    };
  });
};

// const source2$ = timer(500, 1000);

// const source1$ = timer(200, 2000).pipe(
//     map(x => `${x}-a`)
// );

// const subscription = fakeRace(
// // race(
//     source1$,
//     source2$
// ).subscribe(console.log);

// setTimeout(() => {
//     subscription.unsubscribe();
//     // console.log(subscription)
// }, 100);
```
