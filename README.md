![](demo/images/Logo.png)

# Welcome to [HacheQL](https://wwww.hacheql.com/) &middot; [![License badge](https://img.shields.io/badge/license-MIT-informational)](LICENSE) [![npm badge](https://img.shields.io/badge/npm-v1.0.0-informational)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()
HacheQL is a JavaScript library that brings HTTP caching to your GraphQL API.

## Features
- Automatically creates and caches persisted GraphQL queries.
- Integrates with any server running on Node.js.
- Includes specialized support for servers written with Express.js.
- Supports caching with Redis or in the server's local memory.

Check out [our demo site](https://www.hacheql.com/) to see what HacheQL can do.

<hr>

## Getting Started
HacheQL acts like a courier between your client and server.
- On the client, HacheQL takes a GraphQL request and sends it to the server in a way that makes the response cacheable.
- On the server, HacheQL accepts the incoming request and finds the corresponding cached query. Then it passes the baton to the rest of your server's code. 
- When you're ready to send a response back to the client, HacheQL sets appropriate caching headers before shipping out the response. *IS THIS HOW IT ACTUALLY WORKS?*

Let's get the server-side set up first.

<hr>

## Server-side HacheQL

HacheQL works with any Node.js server, but it includes specialized support for servers written in Express.js.  
If your project uses Express, see [Server-side HacheQL - with Express](README.md#server-side-hacheql---with-express). If not, you're in the right place.

<details><summary>Expand for instructions</summary>
1. Install HacheQL with npm.  

```
npm install hacheql
```

2. Import `nodeHacheQL` and `httpCache` in files that handle GraphQL requests.

```javascript
import { nodeHacheQL, httpCache } from 'hacheql/server';
```

3. *JOEY WHAT DO THEY DO LOL*

That's all for the server! See [Client-side HacheQL](README.md#client-side-hacheql) for the next steps.
</details>

### Server-side HacheQL - with Express
If your project uses Express, this section is for you. If not, see [Server-side HacheQL](README.md#server-side-hacheql).

<details><summary>Expand for instructions</summary>
1. Install HacheQL with npm.  

```
npm install hacheql
```

2. Import `expressHacheQL` and `httpCache` in files that handle GraphQL requests.

```javascript
import { expressHacheQL, httpCache } from 'hacheql/server';
```

3. Use `expressHacheQL` as the first piece of middleware in routes that handle GraphQL requests.  
If you want to cache using Redis, pass `expressHacheQL` a reference to your Redis client.

```javascript
app.use('/graphql', expressHacheQL({ redisClient }), /* other middleware */);
```

If you aren't using Redis, don't pass any arguments to `expressHacheQL` and it will automatically use the server's memory for caching.

```javascript
app.use('/graphql', expressHacheQL(), /* other middleware */);
```

4. Use `httpCache` as the *[WHAT? LAST? ALMOST LAST? JUST PRIOR TO THE GRAPHQL QUERY HANDLER??]* piece of middleware.

```javascript
app.use(
  '/graphql',
  expressHacheQL({ redisClient }),
  httpCache,
  graphqlHTTP({ schema, graphiql: true,}),
);
```

That's all for the server! Let's set up the client.
</details>

<hr>

## Client-side HacheQL
HacheQL's client side is the same whether or not your server uses Express, and it's very simple to set up.

<details><summary>Expand for instructions</summary>
1. Import `hacheQL` in files that send requests to the GraphQL API.

```javascript
import { hacheQL } from 'hacheql';
```

2. HacheQL is designed to make it easy to switch over from the Fetch API. All you have to do is replace the word `fetch` with the word `hacheQL`. The arguments to the function remain exactly the same.

For example, here's how you might send a GraphQL request using the Fetch API:

```javascript
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/graphql' },
      body: '{ hero { name } }'
    })
    .then(/* code */)
```

And here's what that same request looks like using HacheQL:

```javascript
    hacheQL('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/graphql' },
      body: '{ hero { name } }'
    })
    .then(/* code */)
```

Simply replace `fetch` with `hacheQL` wherever the client-side code queries the GraphQL API, and you're done! You've set up HTTP caching for your GraphQL requests.
</details>

Thanks for using HacheQL!

<hr>

## Other Stuff

If you're interested in technical specifics and more sample usage, check out the [Documentation](DOCUMENTATION.md).

If you'd like to contribute, read our [Contributing Guide](CONTRIBUTING.md).

<hr>

## License
HacheQL is [MIT Licensed](LICENSE).