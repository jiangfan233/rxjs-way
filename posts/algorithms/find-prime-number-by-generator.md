**Sieve of Eratosthenes**: A way to find all the prime numbers in a given range. The basic idea of this algorithm is if a number is a prime number, then all the multiples of this number are not prime numbers.

Here is the generator version.

```typescript
function* prime() {
  console.log("prime begin");
  let cache = new Set<number>();

  let i = 2;

  while (true) {
    if (Array.from(cache).every((item) => i % item !== 0)) {
      cache.add(i);
      yield i;
      // next time the generator will run from this line.
      console.log("fff", i, cache);
    }

    i++;
  }
}
```

We can use this generator in the following way:

```typescript
let i = 0;
let arr: number[] = [];
let primeIter = prime();

let { value, done } = primeIter.next();
// console.log("value", value, done);

while (i++ <= 10 && !done) {
  arr.push(value!);
  let next = primeIter.next();
  value = next.value;
  done = next.done;
}

console.log(arr.join(","), "casual~", primeIter.next());
```
