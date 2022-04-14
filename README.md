![](demo/images/Logo.png)

# Welcome to [HacheQL](http://www.hacheql.org/) &middot; [![License badge](https://img.shields.io/badge/license-MIT-informational)](LICENSE) [![npm badge](https://img.shields.io/badge/npm-v1.0.1-informational)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()
HacheQL is a JavaScript library that brings HTTP caching to your GraphQL API.

## Features
- Automatically creates and caches persisted GraphQL queries.
- Integrates with any server running on Node.js.
- Includes specialized support for servers written with Express.js.
- Supports caching with Redis or in the server's local memory.

Check out [our demo site](http://www.hacheql.org/) to see what HacheQL can do.

<hr>

## Getting Started
HacheQL sends GraphQL requests in a way that makes the response HTTP cacheable, so subsequent requests for the same data can be fulfilled from a cache in the browser or on a proxy server. 

HacheQL works by hashing the contents of GraphQL queries and caching key-value pairs of the form \<hashed query>: \<full query> on the server side.

Let's get the server set up first.

<hr>

## Server-side HacheQL

HacheQL works with any Node.js server, but it includes specialized support for servers written in Express.js. If your project uses Express, see the next section, titled 'Server-side HacheQL - with Express.'  

If you use vanilla Node or a different Node framework, you're in the right place.

<details><summary>Expand for instructions</summary>  
<br>

1. Install HacheQL with npm.  

```
npm install hacheql
```

2. Import `nodeHacheQL` in files that handle GraphQL requests.

```javascript
import { nodeHacheQL } from 'hacheql/server';
```

3. Call `nodeHacheQL` as the first step in handling GraphQL requests. 
```javascript
server.on('request', async (req, res) => {
  if (request.url === '/graphql') {
    try {
      const query = await nodeHacheQL(req, res, { redis: redisClient }); 
      const data = await database.query(query);
      res.end(data);
    } catch (error) {
      /* error handling logic */
    }
  }
});
```
> See the [Documentation](DOCUMENTATION.md#nodehacheql) for more detail on how to use this function.

That's all for the server! See [Client-side HacheQL](README.md#client-side-hacheql) for the next steps.
</details>

<hr>

## Server-side HacheQL - with Express
If your project uses Express, this section is for you. If not, see the previous section, titled 'Server-side HacheQL.'

<details><summary>Expand for instructions</summary>
<br>

1. Install HacheQL with npm.  

```
npm install hacheql
```

2. Import `expressHacheQL` and `httpCache` in files that handle GraphQL requests.

```javascript
import { expressHacheQL, httpCache } from 'hacheql/server';
```

3. Use `expressHacheQL` as the first piece of middleware in routes that handle GraphQL requests.  

If you want to cache using Redis, pass `expressHacheQL` an object with a property `redis` whose value is a reference to your Redis client.

```javascript
app.use('/graphql', expressHacheQL({ redis: <redisClient> }), /* other middleware */);
```

If you aren't using Redis, don't pass any arguments to `expressHacheQL` and it will automatically use the server's memory for caching.

```javascript
app.use('/graphql', expressHacheQL(), /* other middleware */);
```

4. Use `httpCache` prior to sending a response.

```javascript
app.use(
  '/graphql',
  expressHacheQL(),
  httpCache(),
  graphqlHTTP({ schema, graphiql: true,}),
);
```

5. `expressHacheQL` relies on Express's built-in [express.json()](https://expressjs.com/en/api.html#express.json) method for parsing JSON-encoded request bodies. If you don't have it set up yet, add the following toward the top of your main server file:
```javascript
app.use(express.json())
```

That's all for the server! Let's set up the client.
</details>

<hr>

## Client-side HacheQL
HacheQL's client side is the same whether or not your server uses Express, and it's very simple to set up. 
> Note: It's possible to implement HacheQL on the client-side gradually. You can set it up for some GraphQL routes and not for others, and everything will still work.

<details><summary>Expand for instructions</summary>
<br>

1. Import `hacheQL` in files that send requests to a GraphQL API.

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

<hr>

## Other Stuff

Check out the [Documentation](DOCUMENTATION.md) for more sample usage, technical details, and ways to customize behavior.

If you'd like to contribute, read our [Contributing Guide](CONTRIBUTING.md).

<hr>

## License
HacheQL is [MIT Licensed](LICENSE).