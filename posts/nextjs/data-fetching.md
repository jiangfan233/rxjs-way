### Three Ways of Data-fetching in App Router

1、In client components, I can fetch some data in useEffect hook after the page loaded. And fetch some data after receiving user inputs, such as mouse down, key down and so on.

```typescript
"use client";

// this is a client component
export default function Page() {
  useEffect(() => {
    // fetch data....
  }, []);
}
```

2、Server actions

What is server compoennts? In nextjs, every component is server component by default, we can put 'use client' on the most top of a component to mark it as a client component.

Server components runs in server, in the node environment exactly, not browser, so we cannot use browser api, such as window. And we cannot use UI hooks, such as useState, useEffect. But we can fetch some data in the server components and then pass them to the client components. We can even access database in the server components.

Client components runs in browser, which cannot access database. But we can pass a function that can access database and marked using 'use server' to the client components.

In the parent component:

```typescript
import ClientComponent from "@/(root)/page";

// 'use server' must be in a async function.
async function getData() {
    'use server'
    // we can fetch or access database
    return await fetch("http://some-url");
}

// this is a server component, because there is no 'use client' in this file.
export default async function RootLayout() {
    const { status, data, message } = await getData();

    return { status == 200 ? <ClientComponent data={data} getData={getData} /> : message };
}

```

In the child component:

```typescript
"use client";

// this is a client component.
export default function Page({ data, getData }) {
  const handleClick = (_) => {
    // since getData is a async function, I use .then to handle response.
    getData().then((res) => {
      setState(xxx);
    });
  };

  return <button onClick={handleClick}>Click me!</button>;
}
```

3、[Route handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

If i want to "GET" or "POST" data in a-folder/b-folder/page.tsx, I need to define a GET or POST function in a-folder/b-folder/api/route.ts. I can simply get these data through my browser: http://localhost:3000/a-folder/b-folder/api

This alse means I need to <span style="color: red;">use some auth logic to protect my routes</span>.

I can also access local database(is this a common scenario?) and cache data use fetch options and route handlers.
