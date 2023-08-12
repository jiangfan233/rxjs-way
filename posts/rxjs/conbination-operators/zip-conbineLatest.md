##### zip和combineLatest的区别在于

zip每吐出一个数据集合都需要等待所有数据源吐出数据（数据源的数据是 and 的关系）;
combineLatest 仅仅在第一次吐出数据集合的时候等待所有数据源，后面要任意数据源产生数据都会吐出数据集合（数据源的数据从 and 变为 or）

###### combineLatest 小缺陷：

对于同时到来的两个或多个数据，本应该产生一个输出，实际结果却产生了两个或多个，
因为多个数据源同时产生数据，同时产生多个宏任务，因此也就无法使用微任务解决这个缺陷（个人猜测）

```javascript
// zip:
// 可操作多组数据流，
// zip产出的数据取决于所有数据流中最短的那个 => 并不是所有数据都能获取到
// zip产出数据的速度取决于所有数据流中最慢的那个
// zip(of(1,2,3), interval(1000).pipe(take(2))).subscribe(
//     console.log,
//     console.error,
//     // 产出 [1,0] [2,1] 之后 done
//     () => console.log("done")
// )

//////////////////////////////////////////////

// zip和combineLatest的区别在于
// zip每吐出一个数据集合都需要等待所有数据源吐出数据（数据源的数据是 and 的关系），
// combineLatest 仅仅在第一次吐出数据集合的时候等待所有数据源，后面要任意数据源产生数据都会吐出数据集合（数据源的数据从 and 变为 or）

// combineLatest 第一次需要填充数据集合，因此需要等待所有数据，
// 后面的每一次只要任意数据源产生数据都会吐出数据集合
// combineLatest 可接受一个函数project，用于处理combineLatest产生的数据集合并将结果传递给下游

const fakeCombineLatest = (...args: any[]) => {
  let project: Function | undefined;
  let rest: Observable<any>[];
  if (typeof args[args.length - 1] === "function") {
    project = args[args.length - 1];
    rest = args.slice(0, -1);
  } else {
    rest = args;
  }
  const values = Array(rest.length).fill(null);
  const completedArr = Array(rest.length).fill(false);

  const nextFunc = (val: any, index: number, observer: Subscriber<any>) => {
    values[index] = val;

    // 这里仅仅验证 values 中数据的长度
    if (values.every((val) => val !== undefined && val !== null)) {
      observer.next(
        project ? project.apply(null, values.slice()) : values.slice()
      );
    }
  };

  const completeFunc = (index: number, observer: Subscriber<any[]>) => {
    completedArr[index] = true;
    if (completedArr.every((isCompleted) => isCompleted)) {
      observer.complete();
    }
  };

  return Observable.create((observer: Subscriber<any[]>) => {
    rest.forEach((obs$, index) => {
      obs$.subscribe(
        // 当有多个数据源同时(逻辑上的同时，物理上相差几纳秒)调用 nextFunc时，每一个都会创建一个宏任务
        (val) => nextFunc(val, index, observer),
        (error) => observer.error(error),
        () => completeFunc(index, observer)
      );
    });
  });
};

// combineLatest(
// fakeCombineLatest(
//     timer(500, 1000).pipe(take(3), map(val => String.fromCharCode(val + 65))),
//     timer(1000, 1000).pipe(take(4)),
//     (a: string, b: number) => `item: ${a} -- ${b}`
// ).subscribe(
//     console.log,
//     console.error,
//     () => console.log("done")
// )

// combineLatest 小缺陷(glitch)：
// 对于同时到来的两个或多个数据，本应该产生一个输出，实际结果却产生了两个或多个，
// 因为多个数据源同时产生数据，同时产生多个宏任务，因此也就无法使用微任务解决这个缺陷（个人猜测）
fakeCombineLatest(
  // combineLatest(
  timer(0, 1000).pipe(
    map((val) => `${val}a`),
    take(1)
  ),
  timer(0, 1000).pipe(
    map((val) => `${val}b`),
    take(1)
  ),
  (a: string, b: string) => `item: ${a} -- ${b}`
).subscribe(console.log, console.error, () => console.log("done"));
```
