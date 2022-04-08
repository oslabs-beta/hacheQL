# Welcome to [HacheQL](https://wwww.hacheql.com/) &middot; [![License badge](https://img.shields.io/badge/license-MIT-informational)](LICENSE) [![npm badge](https://img.shields.io/badge/npm-v1.0.0-informational)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()
HacheQL is a JavaScript library that brings HTTP caching to your GraphQL API.

## Features
- Automatically caches GraphQL requests, regardless of the HTTP method the client uses.
- Integrates with any server running on Node.js.
- Includes specialized support for servers written with Express.js.
- Supports caching with Redis, caching in the server's local memory, or a hybrid of the two.

## Getting Started
HacheQL works like a courier between your client-side and server-side code.
- On the client, hand off a GraphQL request to HacheQL and it will deliver the request to the server in a way that makes the response cacheable. HacheQL is the last thing that touches the request before it gets sent out.
- On the server, HacheQL is the first thing that touches incoming requests from the client. Then it passes the baton to the rest of your server's code. 
- When you're ready to send a response back to the client, give it to HacheQL and it will set appropriate caching headers before shipping out the response. *IS THIS HOW IT ACTUALLY WORKS?*

Let's get the server-side set up first.

### Server-side HacheQL

HacheQL works with any server running on Node.js, but it includes specialized support for servers written in Express.js.  
If your project uses Express, see [Server-side HacheQL - with Express](README.md#server-side-hacheql---with-express). For vanilla Node and other Node frameworks, keep reading!

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

### Server-side HacheQL - with Express
HacheQL works with any server running on Node.js, but it includes specialized support for servers written in Express.js.  
If your project uses Express, this is the section for you. If not, see [Server-side HacheQL](README.md#server-side-hacheql).

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

For example:
```javascript
app.use('/graphql', expressHacheQL({ redis }), /* other middleware */);
```
If you aren't using Redis, don't pass any arguments to `expressHacheQL` and it will automatically use the server's memory for caching.
```javascript
app.use('/graphql', expressHacheQL(), /* other middleware */);
```
4. Use `httpCache` as the *[WHAT? LAST? ALMOST LAST? JUST PRIOR TO THE GRAPHQL QUERY HANDLER??]* piece of middleware.

For example:
```javascript
app.use(
  '/graphql',
  expressHacheQL({ redis }),
  httpCache,
  graphqlHTTP({ schema, graphiql: true,}),
);
```

That's all for the server! Let's set up the client.

### Client-side HacheQL
HacheQL's client side is the same whether or not your server uses Express, and it's very simple to set up.

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

Thanks for using HacheQL!

## Other Stuff

If you're interested in more technical specifics, check out the [Documentation](DOCUMENTATION.md).

If you'd like to contribute, read our [Contributing Guide](CONTRIBUTING.md).
## License
HacheQL is [MIT Licensed](LICENSE).