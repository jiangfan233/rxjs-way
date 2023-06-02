##### merge用于合并多个数据源，常用于异步处理多个数据源，先到先得；可指定一个concurrent用与控制数据源并行数量。

```javascript
const fakeMerge = (...rest: any[]) => {
    const concurrent = rest[rest.length - 1];
    let obsArr: Observable<any>[], restArr: Observable<any>[], records: boolean[];
    if(typeof concurrent === "number") {
        obsArr = rest.slice(0, concurrent);
        restArr = rest.slice(concurrent, -1);
    } else {
        obsArr = rest as Observable<any>[];
        restArr = [];
    }
    // records用于记录当前并行数据源（concurrent）的订阅关系，true===已退订、数据源已完结
    records = Array(obsArr.length).fill(false);

    return Observable.create((observer: Subscriber<any>) => {
        let subs: Subscription[];

        const subscribe = (obs$: Observable<any>, index: number) => {
            return obs$.subscribe(
                val => observer.next(val),
                err => {
                    observer.error(err);
                    subs && subs.forEach(sub => sub.unsubscribe());
                },
                () => {
                    // 当一个数据源完结的时候，根据index拿到这个数据源并退订
                    // 取出新的数据源，并更新index的订阅关系。
                    if(subs[index]) {
                        subs[index].unsubscribe();
                        records[index] = true;
                        if(restArr.length > 0) {
                            subs[index] = subscribe(restArr.shift()!, index);
                            records[index] = false;
                        }
                    }
                    // 当所有数据源都完结的时候，fakeMerge 产生的Observable也应该完结
                    if(records.every(record => record === true)) {
                        observer.complete();
                    }
                },
            )
        }

        subs = obsArr.map((obs$, index) => {
            return subscribe(obs$, index);
        })

        return {
            unsubscribe() {
                subs && subs.forEach(sub => sub.unsubscribe());
            }
        }
    })
}

// const source1$ = timer(0, 1000).map(x => x + "A").take(2);
// const source2$ = timer(500, 1000).map(x => x + "B").take(3);

// // concurrent===2：只有当前两个数据源完结的时候第三个才有机会入场
// // const source3$ = merge(source1$, source2$, interval(1000), 2);
// const source3$ = fakeMerge(source1$, source2$, interval(1000), 2);

// source3$.take(10).subscribe(
//     console.log,
//     console.error,
//     () => console.log("done")
// )
```
