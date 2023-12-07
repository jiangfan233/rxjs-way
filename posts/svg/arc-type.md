难点在于根据文字长度计算弧形半径和起始点（高中那点数学知识早还给体育老师了 :)）

目前的实现还是有bug的，晚点解决吧；

```javascript
import { createEffect, createSignal } from "solid-js";
import { SVG } from "@svgdotjs/svg.js";
import "./App.css";

function App() {
  const [text, setText] = createSignal("this is an example!");
  const [n, setN] = createSignal(0);
  let svgContainerRef;
  let svg;
  let textPath;
  let textElement;
  let P = [150, 50];

  createEffect(() => {
    svg = SVG().addTo(svgContainerRef).viewbox(0, 0, 300, 140);
    textElement = svg
      // .text(function (add) {
      //   add.tspan(text());
      // })
      .plain(text())
      .height("1.5rem");

    let L = textElement.length();

    textPath = textElement.path(
      `M ${[P[0] - L / 2, P[1]].join(" ")} L ${[P[0] + L / 2, P[1]].join(" ")}`
    );
  });

  createEffect(() => {
    if (n() != 0) {
      let L = textElement.length();
      // 角度
      let X = (9 * n()) / 5;
      // 弧度
      let rad = (n() * Math.PI) / 100;
      let R = (90 * L) / Math.PI / X;

      let start = [P[0] - R * Math.sin(rad), P[1] - R + R * Math.cos(rad)];

      let end = [P[0] + R * Math.sin(rad), P[1] - R + R * Math.cos(rad)];

      let lenghty = n() >= 50 ? 1 : 0;
      let direction = n() >= 0 ? 0 : 1;
      textPath.plot(
        `M ${start.join(" ")} A ${R} ${R} 0 ${lenghty} ${direction} ${end.join(
          " "
        )}`
      );
    }
  });

  return (
    <>
      <div className="container">
        <div className="" style={{ width: "100%" }}>
          <input
            type="range"
            id="range"
            value={n()}
            min={-99}
            max={99}
            onChange={(e) => setN(e.target.value)}
          />
          <label htmlFor="range">{n()}</label>
        </div>
        <input
          type="text"
          value={text()}
          onChange={(e) => {
            setText(e.target.value);
            if (Boolean(textPath)) {
              textPath.tspan(e.target.value);
            }
          }}
        />
        <div id="drawing" ref={svgContainerRef}></div>
      </div>
    </>
  );
}

export default App;

```