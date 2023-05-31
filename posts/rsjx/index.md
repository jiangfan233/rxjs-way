

rxjs 既实现了观察者模式又实现了迭代器模式；

观察者模式：

<ul>
<li>
作为一个controller把数据源（用户行为）和处理器（handler）通过source$.subscribe(observer)结合在一起；
</li>
<li>通过运算符组建数据流通管道处理数据；</li>
</ul>
迭代器模式：
<ul>
<li>数据源要求观察者（subscriber）必须实现next、complete、error中至少一个方法，从而保证数据流通；</li>
<li>source$.subscribe(observer)观察者作为参数交给数据源，保证观察者“随时可用”</li>
</ul>

高阶函数可用来保存执行上下文 context,从而摆脱 this 困扰,但也因此不能直接使用链式调用；

关于 fakeRepeatWhen(repeatWhen) 的问题：

<ul>
    <li>期望：</br>
        1、controller$数据流complete的时候能够下游也能正常结束，<br/>
        2、controller$数据流complete的时候能够在重新订阅自身
    </li>
    <li>
        实际：<br/>
        1、controller$数据流只是不再产生数据，不再调用nextFunc了<br/>
        2、实际上当controller$数据流complete的时候，并没有调用observer.complete,即下游并没有被通知到。</br>
        3、而且因为递归中缺少判断条件，会导致无限循环
    </li>
    <li>
        解决方法：<br/>
        当一个Observable 还有数据产生时，会先调用observer.next，
        然后在某一个时刻调用 observer.complete<br/>
        如果该Observable 已经没有数据，会直接调用 observer.complete<br/>
        所以只需要维护一个根据 observer.next 是否调用的来改变状态的状态变量即可<br/>
        该变量同时也表示Observable是否已经complete
    </li>
    <li>
        上述方法缺陷：<br/>
        如果fakeRepeatWhen(notifier)中notifier返回一个cold Observable，
        该Observable在每次调用完observer.next 之后调用 observer.complete，
        又会导致 controller$ 重新订阅 => 无限循环;<br/>
        关键在于如何知道controller$ 什么时候应该重新订阅，什么时候应该调用observer.complete
    </li>
</ul>

**合并运算符**

<ul>
    <li>merge用于合并多个数据源，常用于异步处理多个数据源，先到先得；可指定一个concurrent用与控制数据源并行数量。</li>
    <li>
        zip和combineLatest的区别在于<br/>
zip每吐出一个数据集合都需要等待所有数据源吐出数据（数据源的数据是 and 的关系）;<br/>
combineLatest 仅仅在第一次吐出数据集合的时候等待所有数据源，后面要任意数据源产生数据都会吐出数据集合（数据源的数据从 and 变为 or）<br/>
    combineLatest 小缺陷：<br/>
    对于同时到来的两个或多个数据，本应该产生一个输出，实际结果却产生了两个或多个，<br/>
    因为多个数据源同时产生数据，同时产生多个宏任务，因此也就无法使用微任务解决这个缺陷（个人猜测）<br/>
    </li>
    <li>
        withLatestFrom 解决了zip、combineLatest中的多重继承问题（glitch）<br/>
        glitch 问题的根源在于多个Observable同时有数据到来时都会向下游吐出数据，因此会出现同一个时刻吐出多个数据的情况<br/>
        withLatestFrom解决方式：<br/>
        1、提供一个控制者Observble作为Controller，其他Observable作为从属仅提供数据（不向下游提供数据）<br/>
        2、controller向下游吐出数据（因此也把Subscription提供给下游）<br/>
        3、controller自身有数据时会检查 从属者是否已经提供数据（而不管数据何时提供的）<br/>
        上面三点决定了在订阅controller之前势必要先订阅从属者最后订阅controller，也就给了当同时多个Observable吐出数据时从属者更新数据的机会
    </li>
    <li>
        race 第一个吐出数据Observable对象保留订阅状态，其他observable直接取消订阅；”赢者通吃“
    </li>
    <li>
        startWith 直接在订阅后吐出参数，而不管observable内部协调机制
    </li>
    <li>
        forkjoin 等待所有bservable对象都完结（completed）时候把所有observable对象的最后一个数据组合后吐出
    </li>
</ul>

**高阶 Observable**

<ul>
    <li>mergeAll和concatAll都是把 Observable 对象降低一维</li>
    <ul>
        <li>concatAll 是按先后顺序把 子数据流 头(subscribe)尾(completed)相连，</li>
        <li>因此</li>
        <li>1、最后形成的数据流时间比任何一个子数据流都要长；</li>
        <li>2、某时刻的数据只属于一个 子数据流；</li>
        <li>3、子数据流的订阅时间可能晚于 该数据流 在下游的出现时间；</li>
        <li>4、若中间的子数据流不 complete，后面的子数据流永远不会被订阅。</li>
        <li>5、concatAll 可比喻为 单线程</li>
        <li>mergeAll 是只要有子数据流在 下游 出现，就会被订阅。</li>
        <li>因此</li>
        <li>1、最后形成的数据流执行时间可能和 某一个子数据流 时间相同。</li>
        <li>2、某时刻的数据可能源于多个数据流</li>
        <li>3、子数据流在下游的出现时间和订阅时间基本一致（逻辑上时间相同）</li>
        <li>4、所有的子数据流都会被订阅</li>
        <li>5、mergeAll 可比喻为 并发</li>
    </ul>
    <li>
        zipAll 与 conbineAll
        <div>
            现象：<br>
        1、ho$ 若永不完结，该数据流永不吐出数据<br>
        2、ho$ 吐出一组数据(列表)的时间点 与 该组数据中最后到达的那个数据(单一数据)到达时间点基本相同<br>
        推测<br>
        1、ho$完结之后才会按子数据流到达顺序依次订阅所有子数据流(逻辑上同时订阅)，应用一遍对应的策略<br>
        2、拿到所有子数据流（ho$完结）,在内部调用一下zip或combineLatest(zip(...obsArr)、combineLatest(...obsArr))
        </div>
        <ul>
            <li>
        zipAll
        <div>
        <svg width="612" height="219" style="display: block; font-size: 14px; font-family: Arial, sans-serif; dominant-baseline: central; text-anchor: middle; cursor: default; user-select: none;"><line x1="67.8286" y1="37" x2="67.8286" y2="89" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><line x1="114.3086" y1="37" x2="114.3086" y2="141" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><line x1="160.7886" y1="37" x2="160.7886" y2="193" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><g transform="translate(0, 11)"><g transform="translate(21, 0)"><line x1="0" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(0, 0, 0, 0.2)" style="shape-rendering: crispedges;"></line><line x1="0" y1="26" x2="140.4858" y2="26" stroke-width="2" stroke="#000000" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(0, 0, 0, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="140.48579999999998" y1="3.5" x2="140.48579999999998" y2="48.5" stroke-width="2" stroke="#000000" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(46.8286px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g><g style="transform: translate(93.3086px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g><g style="transform: translate(139.789px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g></g></g></g><g transform="translate(0, 63)"><g transform="translate(21, 0)"><line x1="46.8286" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="46.8286" y1="26" x2="142.1126" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="142.11260000000001" y1="3.5" x2="142.11260000000001" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(95.1678px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">0:0</text></g><g style="transform: translate(141.88px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">0:1</text></g></g></g></g><g transform="translate(0, 115)"><g transform="translate(21, 0)"><line x1="93.3086" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="93.3086" y1="26" x2="280.7392" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="280.7392" y1="3.5" x2="280.7392" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(186.85px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">1:0</text></g><g style="transform: translate(279.926px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">1:1</text></g></g></g></g><g transform="translate(0, 167)"><g transform="translate(21, 0)"><line x1="139.7886" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="139.7886" y1="26" x2="422.968" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="422.96799999999996" y1="3.5" x2="422.96799999999996" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(282.715px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">2:0</text></g><g style="transform: translate(422.271px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">2:1</text></g></g></g></g><g style="text-anchor: start; dominant-baseline: text-before-edge;"></g></svg>
        <svg width="612" height="63" style="display: block; font-size: 14px; font-family: Arial, sans-serif; dominant-baseline: central; text-anchor: middle; cursor: default; user-select: none;"><g transform="translate(0, 11)"><g transform="translate(21, 0)"><line x1="0" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(0, 0, 0, 0.2)" style="shape-rendering: crispedges;"></line><line x1="0" y1="26" x2="419.5982" y2="26" stroke-width="2" stroke="#000000" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(0, 0, 0, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="419.59819999999996" y1="3.5" x2="419.59819999999996" y2="48.5" stroke-width="2" stroke="#000000" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(279.461px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(0, 0, 0); dominant-baseline: central;">...</text><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="transparent"></circle></g><g style="transform: translate(418.785px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(0, 0, 0); dominant-baseline: central;">...</text><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="transparent"></circle></g></g></g></g><g style="text-anchor: start; dominant-baseline: text-before-edge;"></g></svg>
        <p>内部数据为：00-10-20、01-11-21</p>
        </div>
    </li>
    <li>
        combineAll
        <div>
            <svg width="612" height="219" style="display: block; font-size: 14px; font-family: Arial, sans-serif; dominant-baseline: central; text-anchor: middle; cursor: default; user-select: none;"><line x1="67.48" y1="37" x2="67.48" y2="89" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><line x1="113.96000000000001" y1="37" x2="113.96000000000001" y2="141" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><line x1="160.5562" y1="37" x2="160.5562" y2="193" stroke="#767676" stroke-width="1" stroke-dasharray="3,3"></line><g transform="translate(0, 11)"><g transform="translate(21, 0)"><line x1="0" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(0, 0, 0, 0.2)" style="shape-rendering: crispedges;"></line><line x1="0" y1="26" x2="140.2534" y2="26" stroke-width="2" stroke="#000000" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(0, 0, 0, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="140.2534" y1="3.5" x2="140.2534" y2="48.5" stroke-width="2" stroke="#000000" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(46.48px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g><g style="transform: translate(92.96px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g><g style="transform: translate(139.556px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="0" stroke="#000000" fill="#767676"></circle></g></g></g></g><g transform="translate(0, 63)"><g transform="translate(21, 0)"><line x1="46.480000000000004" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="46.480000000000004" y1="26" x2="142.1126" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="142.11260000000001" y1="3.5" x2="142.11260000000001" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(94.4706px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">0:0</text></g><g style="transform: translate(141.996px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">0:1</text></g></g></g></g><g transform="translate(0, 115)"><g transform="translate(21, 0)"><line x1="92.96000000000001" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="92.96000000000001" y1="26" x2="190.2194" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="190.2194" y1="3.5" x2="190.2194" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(141.648px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">1:0</text></g><g style="transform: translate(189.871px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">1:1</text></g></g></g></g><g transform="translate(0, 167)"><g transform="translate(21, 0)"><line x1="139.5562" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(118, 118, 118, 0.2)" style="shape-rendering: crispedges;"></line><line x1="139.5562" y1="26" x2="235.305" y2="26" stroke-width="2" stroke="#767676" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(118, 118, 118, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="235.305" y1="3.5" x2="235.305" y2="48.5" stroke-width="2" stroke="#767676" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(187.895px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">2:0</text></g><g style="transform: translate(234.492px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#767676" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(118, 118, 118); dominant-baseline: central;">2:1</text></g></g></g></g><g style="text-anchor: start; dominant-baseline: text-before-edge;"></g></svg>
            <svg width="612" height="63" style="display: block; font-size: 14px; font-family: Arial, sans-serif; dominant-baseline: central; text-anchor: middle; cursor: default; user-select: none;"><g transform="translate(0, 11)"><g transform="translate(21, 0)"><line x1="0" y1="26" x2="581" y2="26" stroke-width="2" stroke="rgba(0, 0, 0, 0.2)" style="shape-rendering: crispedges;"></line><line x1="0" y1="26" x2="236.2346" y2="26" stroke-width="2" stroke="#000000" style="shape-rendering: crispedges;"></line><path transform="translate(581, 21)" d="M0 0 L10 5 L0 10 z" fill="rgba(0, 0, 0, 0.2)" style="transition: fill 0.2s ease-in-out 0s;"></path><line x1="236.2346" y1="3.5" x2="236.2346" y2="48.5" stroke-width="2" stroke="#000000" style="opacity: 1; transition: opacity 0.5s ease-in-out 0s;"></line><g><g style="transform: translate(186.269px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(0, 0, 0); dominant-baseline: central;">...</text><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="transparent"></circle></g><g style="transform: translate(232.749px, 26px) scale(1); transition: transform 0.5s ease-in-out 0s;"><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="#ffffff"></circle><text x="0" y="0" style="fill: rgb(0, 0, 0); dominant-baseline: central;">...</text><text x="0" y="-18" style="font-size: 10px; dominant-baseline: text-after-edge;">×3</text><circle cx="0" cy="0" r="15" stroke-width="2" stroke="#000000" fill="transparent"></circle></g></g></g></g><g style="text-anchor: start; dominant-baseline: text-before-edge;"></g></svg>
            <p>内部数据为：00-10-20、01-10-20,01-11-20,01-11-21(这三条数据在同一个时刻出现(逻辑上同时))</p>
            <p>上面数据的变化顺序恰恰能反映出三个子数据流的订阅顺序，比如00 -> 01这次变化 恰恰是因为第一个子数据流最先被订阅并且它吐出了01。</p>
            <p>内部数据的每次变化都对应一个外部宏任务执行</p>
        </div>
    </li>
        </ul>
    </li>
    
</ul>

**自我感想**

<ul>
    <li>到目前为止，自己实现的一些简单功能基本全都用到了状态变量，用非函数式实现函数式...挺讽刺的。</li>
</ul>
