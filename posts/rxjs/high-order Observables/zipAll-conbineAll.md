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