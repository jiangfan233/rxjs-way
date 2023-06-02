
##### merge用于合并多个数据源，常用于异步处理多个数据源，先到先得；可指定一个concurrent用与控制数据源并行数量。

###### zip和combineLatest的区别在于
- zip每吐出一个数据集合都需要等待所有数据源吐出数据（数据源的数据是 and 的关系）;
- combineLatest 仅仅在第一次吐出数据集合的时候等待所有数据源，后面要任意数据源产生数据都会吐出数据集合（数据源的数据从 and 变为 or）

###### combineLatest 小缺陷：
- 对于同时到来的两个或多个数据，本应该产生一个输出，实际结果却产生了两个或多个，
- 因为多个数据源同时产生数据，同时产生多个宏任务，因此也就无法使用微任务解决这个缺陷（个人猜测）
    
    
###### withLatestFrom 解决了zip、combineLatest中的多重继承问题（glitch）
glitch 问题的根源在于多个Observable同时有数据到来时都会向下游吐出数据，因此会出现同一个时刻吐出多个数据的情况

###### withLatestFrom解决方式：
- 提供一个控制者Observble作为Controller，其他Observable作为从属仅提供数据（不向下游提供数据）
- controller向下游吐出数据（因此也把Subscription提供给下游）
- controller自身有数据时会检查 从属者是否已经提供数据（而不管数据何时提供的）
- 上面三点决定了在订阅controller之前势必要先订阅从属者最后订阅controller，也就给了当同时多个Observable吐出数据时从属者更新数据的机会


race 第一个吐出数据Observable对象保留订阅状态，其他observable直接取消订阅；"赢者通吃"


startWith 直接在订阅后吐出参数，而不管observable内部shadule


forkjoin 等待所有bservable对象都完结（completed）时候把所有observable对象的最后一个数据组合后吐出
    
