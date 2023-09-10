import { useDebounce } from "@lib/hooks";
import { useState } from "react";

export const TestUseDebounce = () => {
  const [count, setCount] = useState(0);

  const testFn = jest.fn(() => setCount((c) => c + 1));
  const fn = useDebounce(testFn, 300);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={fn}>inc(1)</button>
    </div>
  );
};
