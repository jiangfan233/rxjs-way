### Coarse-grained update and fine-grained update

##### So, What is the difference between the two of them?

I think the answer depends on whether the effect being executed is the latest version or not.


Let's see some code:

```typescript
type State<T> = {
  val: T;
  effects: Set<Function>;
};

type SetState<T> = (newVal: T) => void;

const useState = <T>(val: T): [State<T>, SetState<T>] => {
  let state: State<T> = {
    val,
    effects: new Set(),
  };
  const setState: SetState<T> = (newVal) => {
    state.val = newVal;
    state.effects.forEach((effect) => effect.call(null));
  };

  return [state, setState];
};

const useEffect = (f: Function, deps: State<any>[]) => {
  deps.forEach((dep) => {
    dep.effects.add(f);
  });
  // run effect at program starting.
  f.call(null);
};

```

We can test our codes in this way:

```typescript

const [name1, setName1] = useState("name111111");
const [name2, setName2] = useState("name222222");
const [showAll, toggleShowAll] = useState(false);

useEffect(
  // This effect would be executed once after the program started.
  // a log would show up with name2' value.
  () => console.log(showAll.val ? name1.val : name2.val),
  [name1, name2, showAll]
);

// this will triger a log which still shows the value of the name2, but we are using name1 !!
setName1("Tommy");

// same issue: when whoIsThere has nothing with name2, and name2 changes, more logs show up.
toggleShowAll(true);
setName2("lllllllll");
```

At this version, i use a State object to hold the state value and the effects(subscribers) that would be notified and executed when the value of the state change. And useEffect would be executed immediately after the program running. The effect would be caught by every state that used in the deps.

If you run there codes, there would be some inconsistents cannot be easily ignored.

We set the value of showAll to be true, so the result of the effect would have nothing to do with name2, that means no matter what we change the value of name2, there should be no more logs, but it is. 

If you thought about these codes deeply, you would know <b>i should update my effect everytime before it being executed.</b>

Here are the "corrected" codes:

```typescript

type Getter<T> = () => T;
type Setter<T> = (newVal: T) => void;
type Effect = {
    fn: Function,
    deps: Set<Set<Effect>>;
}

const effectArray: Effect[] = [];


const connect = (subs: Set<Effect>, effect: Effect) => {
    subs.add(effect);
    effect.deps.add(subs);
}

const useState = <T>(val: T): [Getter<T>, Setter<T>] => {
  const subs = new Set<Effect>();

  const get: Getter<T> = () => {
    let effect = effectArray[effectArray.length - 1];
    if (effect) connect(subs, effect);
    return val;
  };

  const setState = (newVal: T) => {
    val = newVal;
    subs.forEach((effect) => {
        // always keep the latest version of the effect!!!
        // cause the result of execution of the effect may change at some time.
        // cause the state always changing!!!!
        effect.deps.forEach(deps => deps.delete(effect));
        // effect: after removing my pervious version, add my latest version!!
        effect.fn.call(null);
    });
  };

  return [get, setState];
};

const useEffect = (cb: Function) => {
  effectArray.push({
    fn: cb,
    deps: new Set()
  });
  cb.call(null);
  effectArray.pop();
};

```

At this version, i remove the argument called deps in both useState and useEffect, and i change the value of the state to be a Getter function, which i can hold every effect that using the state. <b>Every effect must remove its previous version from all of the dependencies in the state in order to ensure that the latest version is executed.</b>

Thanks for reading.



Reference:《React设计原理》(ISBN: 9787121444838)