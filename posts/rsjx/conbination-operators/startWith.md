##### startWith 直接在订阅后吐出参数，而不管observable内部协调机制

```javascript
const fakeStartWith = (...rest: any[]) => (obs$: Observable<any>) => Observable.create((observer: Subscriber<any>) => {
    rest.forEach(item => observer.next(item));
    return obs$.subscribe(
        val => observer.next(val),
        err => observer.error(err),
        () => observer.complete()
    )
})


// const sub = timer(3000, 1000).pipe(
//     // startWith 竟然直接吐出参数，原本以为他会一秒以后吐出9999，再待一秒吐出0。。。。
//     // 所以直接到高阶函数里面 observer.next(9999) 即可，
//     // startWith(9999, "sd")
//     fakeStartWith(999, "hello")
// ).subscribe(console.log)

// setTimeout(() =>{
//     sub.unsubscribe()
// }, 10000)
```