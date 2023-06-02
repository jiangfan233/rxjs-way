#### mergeAll 和 concatAll 都是把 Observable 对象降低一维

- concatAll 是按先后顺序把 子数据流 头(subscribe)尾(completed)相连，
- 因此
- 1、最后形成的数据流时间比任何一个子数据流都要长；
- 2、某时刻的数据只属于一个 子数据流；
- 3、子数据流的订阅时间可能晚于 该数据流 在下游的出现时间；
- 4、若中间的子数据流不 complete，后面的子数据流永远不会被订阅。
- 5、concatAll 可比喻为 单线程
  <br/>
- mergeAll 是只要有子数据流在 下游 出现，就会被订阅。
- 因此
- 1、最后形成的数据流执行时间可能和 某一个子数据流 时间相同。
- 2、某时刻的数据可能源于多个数据流
- 3、子数据流在下游的出现时间和订阅时间基本一致（逻辑上时间相同）
- 4、所有的子数据流都会被订阅
- 5、mergeAll 可比喻为 并发

```javascript
  const fakeConcatAll = () => (obs$: Observable<any>) => {
    let obsArr: Observable<any>[] = [];
    let currentSubscription :Subscription | undefined;
    let hoCompleted = false;
    return Observable.create((observer: Subscriber<any>) => {

        const start = () => {
            if(obsArr.length <= 0) return;
            return obsArr.shift()!.subscribe(
                val => observer.next(val),
                err => observer.error(err),
                () => {
                    if(obsArr.length > 0) {
                        currentSubscription = start();
                    } else {
                        currentSubscription = undefined;
                        if(hoCompleted) {
                            observer.complete();
                        }
                    }
                }
            )
        }

        const hoSubscrption = obs$.subscribe(
            subObs => {
                obsArr.push(subObs);
                if(!currentSubscription) {
                    currentSubscription = start();
                }
            },
            err => observer.error(err),
            () => hoCompleted = true
        )

        return {
            unsubscribe() {
                hoSubscrption.unsubscribe();
                currentSubscription && currentSubscription.unsubscribe();
                obsArr.length = 0;
            }
        }
    })
}


const fakeMergeAll = () => (obs$:Observable<Observable<any>>) => {
    const subscriptionArr: Subscription[] = [];
    return Observable.create((observer: Subscriber<any>) => {
        const hoSubscription = obs$.subscribe(
            subObs$ => {
                const sub = subObs$.subscribe(
                    val => observer.next(val),
                    err => observer.error(err),
                    () => {
                        if(hoSubscription.closed &&
                            subscriptionArr
                                // 执行到这里的时候，该Observable已经可以 "认为" completed了，
                                // 但是还没有被标记为closed
                                .filter(item => item !== sub)
                                .every(item => item.closed)) {
                            observer.complete();
                        }
                    }
                )
                subscriptionArr.push(sub);
            }
        )

        return {
            unsubscribe() {
                subscriptionArr.forEach(sub => sub.unsubscribe());
                hoSubscription.unsubscribe();
            }
        }
    })
}

```
