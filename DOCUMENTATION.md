# Documentation

## Overview

HacheQL works by hashing the contents of GraphQL queries and caching key-value pairs of the form \<hashed query>: \<full query> on the server side.

No matter how large or complex the original query is, the hashed version is short enough to be sent as a query parameter in a URL, while still being uniquely identifiable as related to the original query. As a result, HacheQL can send any GraphQL query as a GET request, which allows browsers and proxy servers to cache the response.

Refer to the sections below for detailed information about specific HacheQL functions.

## hacheQL()

Send a GraphQL request such that the response is HTTP cacheable.

<details><summary>Expand for details</summary>

### Syntax

> Note: This function signature is designed to mimic [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch). 

```javascript
hacheQL(endpoint[, options])
```

### Parameters
- `endpoint` \<string>
  - The URL endpoint for the GraphQL request. Analogous to the Fetch API's 'resource' parameter.
  - If the URL contains the GraphQL query in a query string (see the next bullet for an example), then the `options` argument may not be necessary. However, you won't be getting much benefit from HacheQL in that case. HacheQL's real utility comes in caching GraphQL requests made using the POST method (which allows for more complex queries).

  - An example of a GraphQL query contained in the URL's query string: 
  ```javascript
  hacheQL('graphql?query=%7B%20hero%20%7B%20name%20%7D%20%7D').then(/* code */)
  ```

- `options` \<Object>
  - An object containing settings for the request; for example, the HTTP request method, request headers, and request body. 
  - Analogous to the fetch API's 'init' parameter. All valid properties for the fetch API's 'init' object are valid properties for this function's 'options' object.
  - See [this page from the GraphQL Foundation](https://graphql.org/learn/serving-over-http/#http-methods-headers-and-body) for more information on sending GraphQL requests over HTTP, especially with respect to setting headers.

### Return value
\<Object>  &middot; A Promise that resolves to a Response object from the server, or rejects with an Error object.

<hr>

### Sample usage 

Just like `fetch()` from the Fetch API, `hacheQL()` works with both `.then` chaining and `async/await`.

Using `.then` chaining:
```javascript
    hacheQL('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/graphql' },
      body: '{ hero { name } }'
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => /* error handling logic */);
```

Using `async/await`:
```javascript
    try { 
      const response = await hacheQL('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/graphql' },
          body: '{ hero { name } }'
        });

      const data = await response.json();
      console.log(data);

    } catch (error) {
      /* error handling logic */
    }
```

The previous examples sent the GraphQL query as a string (as indicated by the `application/graphql` Content-Type header), but it's also common to send a query as a JSON-encoded object (using the `application/json` Content-Type header).

HacheQL is perfectly happy to handle that kind of request too.

Using `.then` chaining:
```javascript
    hacheQL('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `($episode: Episode) {
                  hero(episode: $episode) {
                    name
                    friends {
                      name
                    }
                  }
                }`,
        operationName: 'HeroNameAndFriends',
        variables: '{ "episode": "JEDI" }',
      }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => /* error handling logic */);
```

Using `async/await`:
```javascript
    try { 
      const response = await hacheQL('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `($episode: Episode) {
                    hero(episode: $episode) {
                      name
                      friends {
                        name
                      }
                    }
                  }`,
          operationName: 'HeroNameAndFriends',
          variables: '{ "episode": "JEDI" }',
        }),
      });

      const data = await response.json();
      console.log(data);

    } catch (error) {
      /* error handling logic */
    }
```


</details>

<hr>

## nodeHacheQL()

Process incoming GraphQL requests on the server.  
> Note: If your project uses Express.js, we recommend using [expressHacheQL](#expresshacheql) instead.

<details><summary>Expand for details</summary>

### Behavior in detail

Like many functions in Node.js, nodeHacheQL() runs asynchronously. It parses the Request object's readable data stream and either caches the incoming GraphQL query (if it's a new query) or retrieves the correct GraphQL query from the cache.

 <hr>

### Syntax
```javascript
nodeHacheQL(req, res[, opts, cache, callback])
```

### Parameters
- `req` \<Object>
  - The HTTP Request object.
- `res` \<Object>
  - The HTTP Response object.
- `opts` \<Object> *(optional)*
  - Determines where GraphQL queries should be cached.
  - If not provided, nodeHacheQL caches GraphQL queries in the server's memory. 
  - To cache with Redis, provide a reference to your Redis client as a property with the key `redis.`  

    ```javascript
    nodeHacheQL(req, res, { redis: <redisClient> })
    ```
- `cache` \<Object> *(optional)*
  - If not provided, defaults to an empty object.
- `callback` \<function> *(optional)*
  - If not provided, defaults to:
  ```javascript
  (err, query) => {
    if (err) {
      throw err;
    }
    return data;
  }
  ```

### Return value
\<Promise> &middot;  A Promise which resolves with the value of whatever the callback returns, or rejects with the reason of whatever the callback throws.

There are two ways define what happens after this function finishes running:
  1. You can pass it a callback. The callback is passed two arguments, (error, data), where data is a GraphQL query document.
  2. You can also use .then() chaining or async/await.

<hr>

### Sample usage 

Using async/await: 
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

Using a callback: 
```javascript
server.on('request', async (req, res) => {
  if (request.url === '/graphql') {
    nodeHacheQL(req, res, { redis: redisClient }, (err, query) => {
      database.query(query)
        .then((data) => res.end(data))
        .catch((error) => /* error handling logic */);
    }); 
  }
});

```

</details>

<hr>

## expressHacheQL()

Process incoming GraphQL requests on the server.   
> This function is similar to [nodeHacheQL()](#nodehacheql), but it's built specifically for Express.js and takes advantage of Express's middleware pattern.

<details><summary>Expand for details</summary> 

### Behavior in detail
Invoking expressHacheQL returns a function to be used as part of the middleware chain. The middleware function caches new GraphQL queries and retrieves cached queries when they are needed. After the middleware function runs, the GraphQL query can be accessed at `req.body`.

> Note: `expressHacheQL` relies on Express's built-in [express.json()](https://expressjs.com/en/api.html#express.json) method for parsing JSON-encoded request bodies. If you don't have it set up yet, add the following toward the top of your main server file:
```javascript
app.use(express.json())
```

<hr>

### Syntax
```javascript
expressHacheQL([options, customCache])
```

### Parameters  
- `options` \<Object> *(optional)*
  - An object with settings. If not provided, defaults to an empty Object.
  - Currently, there is only one setting available (see the next bullet), but more may be added in the future.
  - To use Redis for caching, give the object a property with the key `redis`.
    - `redis`: \<your Redis client>
- `customCache` \<Object> *(optional)*
  - An object to use as a cache. If not provided, defaults to an empty Object.
  - If a Redis cache was provided in the `options` object, that overrides anything passed in as the `customCache` argument.
  
### Return value
\<function> &middot; 
A function to be used as part of the middleware chain. After this piece of middleware runs, the GraphQL query can be accessed at `req.body`.

<hr>

### Sample usage 

Use an invocation of `expressHacheQL` as the first piece of middleware in routes that handle GraphQL requests.  

If you don't pass any arguments to `expressHacheQL` it uses the server's memory for caching.

```javascript
app.use('/graphql', expressHacheQL(), /* other middleware */);
```

If you want to cache using Redis, provide a reference to your Redis client as a property with the key `redis.`  

```javascript
app.use('/graphql', expressHacheQL({ redis: <redisClient> }), /* other middleware */);
```
  
If you want to cache in some other object, provide that object as a second argument to the function.

```javascript
app.use('/graphql', expressHacheQL({}, <customCacheObject>), /* other middleware */);
```

</details>

<hr>

## httpCache()

Set cache-control headers on the HTTP Response object.

<details><summary>Expand for details</summary>

### Behavior in detail

httpCache() automatically sets the header `'Cache-Control': 'max-age=5'` on all cacheable responses. However, you can define custom behavior if you'd like.

<hr>

### Syntax
> Note: Express automatically passes all three of these arguments to each piece of middleware. You do not need to pass them to httpCache() manually.

```javascript
httpCache(customHeadersObject)
```

### Parameters

- `customHeadersObject` \<Object>
  - An object that defines HTTP response headers to set. If not provided, defaults to: 
  ```javascript
  { 'Cache-Control': 'max-age=5' }
  ```
  - Common caching-related HTTP response headers include the [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header and the [Etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header.

### Return value
A function to be used as part of the middlware chain. The middleware function sets HTTP headers on all cacheable response objects.

<hr>

### Sample usage

```javascript
app.use(
  '/graphql',
  expressHacheQL(),
  httpCache({
    'Cache-Control': 'max-age=10, must-revalidate';
  })
  graphqlHTTP({
    schema,
    graphiql: false,
  })
);
```
</details>