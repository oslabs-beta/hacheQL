# Documentation

## Overview

HacheQL works by hashing the contents of GraphQL queries and caching key-value pairs of the form \<hashed query>: \<full query> on the server side. (Hence the name HacheQL -- 'hash' + 'cache' = 'hache.')

No matter how large or complex the original query is, the hashed version is short enough to be sent as a query parameter in a URL, while still being uniquely identifiable as related to the original query. As a result, HacheQL can effectively send any GraphQL query as a GET request, which allows browsers and proxy servers to cache the response.

Refer to the sections below for detailed information about specific HacheQL functions.

## hacheQL()

Sends a GraphQL request over HTTP such that the response is HTTP cacheable.

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
    .catch((error) => { throw error });
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
      throw error;
    }
```

The previous examples sent the GraphQL query as a string (as indicated by the `application/graphql` Content-Type header), but it's more standard to send a query as a JSON-encoded object (using the `application/json` Content-Type header).

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
    .catch((error) => { throw error });
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
      throw error;
    }
```


</details>

<hr>

## nodeHacheQL()

Processes incoming GraphQL requests on the server.  
> Note: If your project uses Express.js, we recommend using [expressHacheQL](#expresshacheql) instead.

<details><summary>Expand for details</summary>

### Behavior in detail

Like many functions in Node.js, nodeHacheQL() runs asynchronously. It parses the Request object's readable stream and either caches the the incoming GraphQL query (if it's a new query) or retrieves the correct GraphQL query from the cache. It returns a Promise which, upon resolving, passes the query to a provided callback function.

 <hr>

### Syntax
```javascript
nodeHacheQL(req, res, opts[, cache, callback(error, query)])
```

### Parameters
- `req` \<Object>
  - The HTTP Request object.
- `res` \<Object>
  - The HTTP Response object.
- `opts` \<Object> *(optional)*
  - Determines where GraphQL queries should be cached.
  - If not specified, nodeHacheQL caches GraphQL queries in the server's memory. 
  - To cache with Redis, provide a reference to your Redis client as a property with the key `redis.`  

    ```javascript
    nodeHacheQL(req, res, { redis: <redisClient> })
    ```
- `cache` \<Object> *(optional)*
  - If not specified, defaults to an empty object. *DO WE ACTUALLY NEED THIS AS A PARAMETER?*
- `callback` \<function> *(optional)*
  - If not specified, defaults to:
  ```javascript
  (err, data) => {
    if (err) {
      throw err;
    }
    return data;
  }
  ```

### Return value
\<Object> &middot; A Promise which, upon resolving, invokes the provided callback function.

- nodeHacheQL passes two arguments to the callback function.
  - The first argument is `null` unless an error has occurred. In the case of an error, the first argument is the error object.
  - The second argument is a GraphQL query.
    > Note: The data type of the query depends on how it was formatted when it was originally sent from the client. If it was formatted as a string, the retrieved query will be a string. If it was a JSON-encoded object, the retrieved query will be a JavaScript object (nodeHacheQL does the JSON parsing for you).

<hr>

### Sample usage 

*IS THIS RIGHT?*

```javascript
server.on('request', async (req, res) => {
  if (request.url === '/graphql') {
    const query = await nodeHacheQL(req, res, { redis: redisClient }); 
    const data = await database.query(query);
    res.end(data);
  }
});
```

</details>

<hr>

## expressHacheQL()

Processes incoming GraphQL requests on the server.   
This function is similar to [nodeHacheQL()](#nodehacheql), but it's built specifically for Express.js and takes advantage of Express's middleware pattern.

<details><summary>Expand for details</summary> 

### Behavior in detail
Invoking expressHacheQL returns a function to be used as part of the middleware chain. The function caches new GraphQL queries and retrieves cached queries when they are needed. After this piece of middleware runs, the GraphQL query can be accessed at `req.body`.

<hr>

### Syntax
```javascript
expressHacheQL([ { cachingClient } ])
```

### Parameters  
- `externalCache` \<Object> *(optional)*
  - An object wrapping your caching client.
  - If not provided expressHacheQL uses the server's memory for caching.
  
### Return value
\<function>
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

</details>

<hr>

## httpCache()

Sets cache-control headers on the HTTP Response object.

<details><summary>Expand for details</summary>

### Behavior in detail

httpCache() sets HTTP caching headers only if the value of `res.locals.cacheable` is `true`. expressHacheQL() sets `res.locals.cacheable` to `true` after successfully retrieving a persisted query from the cache, so in general there shouldn't be a problem. If httpCache() appears to be malfunctioning, however, checking the value of `res.locals.cacheable` might be a good place to start debugging.

<hr>

### Syntax
> Note: Express automatically passes all three of these arguments to each piece of middleware. You do not need to pass them to httpCache() manually.

```javascript
httpCache([req, res, next])
```

### Parameters

- `req` \<Object>
  - The HTTP Request object.
- `res` \<Object>
  - The HTTP Response object.
- `next` \<Object>
  - The next middleware function.

### Return value
An invocation of the next middleware function (i.e., this function returns `next()`).

<hr>

### Sample usage

```javascript
app.use(
  '/graphql',
  expressHacheQL({ redis: <redisClient> }),
  httpCache,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
```
</details>