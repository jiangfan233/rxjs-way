[Original problem](https://leetcode.com/problems/edit-distance/)

Solving this kind of problem requires some **imagination**.

Now we have three ways to make a word A into another word B, by

- 1、add a char；
- 2、delete a char;
- 3、replace a char of B with a char of A;

Since adding a character to A also means deleting character from B, so the first two ways just are the two sides of the same coin.

Actually, We don't care whether we change A into B or B into A, we just want to know **the minimum number** of editing steps required.

Let's consider the following question:

I want to know the mininum steps of changing A[0, i) into B[0, j)：

```javascript
steps{A[0, i) -> B[0, j)}
``` 

Why do I use i and j?

Because i never know exactly what the words A or B are！And A[0, i) does not simply means A, it means all of the substrings of A, all of the **intermediate states** of changing A into B or **B into A!**.

Now back to our question: A[0, i) -> B[0, j), i never know how to calcate this expression!

But i can **assume** i can get the mininum number of steps of A[0, i) -> B[0, j - 1), to get B[0, j) i can simply adding one char. So i can get this expression:

```javascript
steps{A[0, i) -> B[0, j - 1)} + 1 == steps{A[0, i) -> B[0, j)}
```

Actually, i don't know what the answer is for steps{A[0, i) -> B[0, j - 1)}. To **simplify** the question, which i mean by (**j - 1**), i have to assume that I already have the answer.

Since adding a char or deleting a char are just the two sides of one coin, i can achieve this expression:

```javascript
steps{B[0, j) -> A[0, i - 1)} + 1 == steps{B[0, j) -> A[0, i)}
```

let's simplify these expressions, i just think of the mininum number of steps required to change A[0, i) into B[0, j) or B[0, j) into A[0, i) as F(i, j), we only care about the numbers:

```javascript
 F(i, j) ==  steps{B[0, j) -> A[0, i)} == steps{A[0, i) -> B[0, j)}
```

So the above expressions can both be simplified into:

```javascript
F(i, j - 1) + 1 == F(i, j);
F(i - 1, j) + 1 == F(i, j);
```

Now, let's consider the following expression:

```javascript
F(i - 1, j - 1) + 1 == F(i, j);
```

I can change this expression back into the original verison:

```javascript
steps{A[0, i - 1) -> B[0, j - 1)} + 1 == steps{A[0, i) -> B[0, j)}
```

I think this expression is correct, too. Do you know why?

let 's recall our first expression:

```javascript
steps{A[0, i) -> B[0, j)}
``` 

This expression means the mininum number of steps of changing A[0, i) into B[0, j). In this expression, we got two variables, i and j. Why don't we make i to be a constant number such as 0 to see what we can get(**controlled variable method**)?

```javascript
let i = 0;
A[0, i) == "";
steps{ "" -> B[0, j) } == j   // adding all of the chars of B[0, j) into ""!
```

Things get interesting, what if we make i equal to 1?

```javascript
let i = 1;
A[0, 1).length == 1;                   // We only know the length!   
steps{ A[0, 1) -> B[0, j) } == Math.abs(j - 1)   // what's the hell ? 

// delete a char of A[0, 1)
steps{ A[0, 1) -> B[0, 0) } == steps{ A[0, 1) -> "" } == 1;
// We just want the mininum number, remember?
steps{ A[0, 1) -> B[0, 1) } == steps{ "x" -> "x" } == 0;
steps{ A[0, 1) -> B[0, 2) } == steps{ "x" -> "xa" } == 1;
steps{ A[0, 1) -> B[0, 3) } == steps{ "x" -> "xab" } == 2;
...
steps{ A[0, 1) -> B[0, B.length) } == B.length - 1;
```

Now, let's check the solution:

```typescript
function minDistance(word1: string, word2: string): number {
  let l1 = word1.length + 1;
  let l2 = word2.length + 1;

  // i use dp[r][c] to represent the F(i, j) 
  // rows
  let dp = Array(l1)
    .fill(0)
    // cols
    .map((_) => Array(l2).fill(0));

  // calcate some initial values.  
  for (let r = 1; r < l1; r++) {
    dp[r][0] = r;
  }
  for (let c = 1; c < l2; c++) {
    dp[0][c] = c;
  }

  for (let r = 1; r < l1; r++) {
    for (let c = 1; c < l2; c++) {
      if (word1[r - 1] === word2[c - 1]) {
        dp[r][c] = dp[r - 1][c - 1];
      } else {
        dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) + 1;
      }
    }
  }

  return dp[word1.length][word2.length];
}

```