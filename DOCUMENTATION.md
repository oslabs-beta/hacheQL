# Documentation

## hacheQL()

Sends a GraphQL request over HTTP such that the response is HTTP cacheable.

<details><summary>Expand for details</summary>

### Syntax
```javascript
hacheQL(endpoint[, options])
```
The function signature is designed to mimic [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch). 

### Parameters
- `endpoint` \<string>
  - The URL endpoint for the GraphQL request. Analogous to the Fetch API's 'resource' parameter.
  - If the URL contains the GraphQL query in a query string (see the next bullet for an example), then the `options` argument may not be necessary. However, you won't be getting much benefit from HacheQL in that case. HacheQL's real utility comes in caching GraphQL requests made using the POST method (which is far more common).

  - An example of a GraphQL query contained in the URL's query string: 
  ```javascript
  hacheQL('graphql?query=%7B%20hero%20%7B%20name%20%7D%20%7D').then(/* code */)
  ```

- `options` \<Object>
  - An object containing settings for the request; for example, the HTTP request method, request headers, and request body. 
  - Analogous to the fetch API's 'init' parameter. All valid properties for the fetch API's 'init' object are valid properties for this function's 'options' object.
  - See [this page from the GraphQL Foundation](https://graphql.org/learn/serving-over-http/#http-methods-headers-and-body) for more information on sending GraphQL requests over HTTP, especially with respect to setting headers).

### Return value
A Promise that resolves to a Response object from the server, or rejects with an Error object.

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
If your project uses Express.js, we recommend using [expressHacheQL](#expresshacheql) instead.

<details><summary>Expand for details</summary>

### Syntax
```javascript
nodeHacheQL(req, res, opts[, cache, callback])
```

### Parameters
- `req`  
  - The HTTP Request object.
- `res`
  - The HTTP Response object.
  - Analogous to the fetch API's 'init' parameter. All valid settings for the fetch API's 'init' object are valid for this function's options object.
- `opts`
  - *Some options. Need more info here.*
- `cache` *(optional)*
  - If not specified, defaults to an empty object.
- `callback` *(optional)*
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
*COMING SOON*

<hr>

### Sample usage 

*COMING SOON*

</details>

<hr>

## expressHacheQL()

Processes incoming GraphQL requests on the server.   
This function is similar to [nodeHacheQL()](#nodehacheql), but it's built specifically for Express.js and takes advantage of Express's middleware pattern.

<details><summary>Expand for details</summary> 

### Behavior in detail
Invoking expressHacheQL returns a function to be used as part of the middleware chain. Let's call that function `cacheHandler`. `cacheHandler` has the following behavior: 

If the incoming HTTP request contains a GraphQL query, cacheHandler will cache it.

If the incoming HTTP request does not contain a GraphQL query, cacheHandler checks to see if a corresponding GraphQL query has been cached. If so, it retrieves the query. If not, it responds to the client asking it to send a followup HTTP request with the query attached. cacheHandler will cache the query once it receives the followup HTTP request.

Queries that cacheHandler retrieves from the cache are automatically JSON-parsed, if necessary, and then stored on `req.body`. 

<hr>

### Syntax
```javascript
expressHacheQL([ { externalCache} ])
```

### Parameters  
- `externalCache` \<Object> *(optional)*
  - An object wrapping your caching client.
  
### Return value
An invocation of the next middleware function (i.e., this function returns `next()`).

<hr>

### Sample usage 

Use an invocation of `expressHacheQL` as the first piece of middleware in routes that handle GraphQL requests.  
If you don't pass any arguments to `expressHacheQL` it uses the server's memory for caching.

```javascript
app.use('/graphql', expressHacheQL(), /* other middleware */);
```

If you want to cache using Redis, pass `expressHacheQL` a reference to your Redis client wrapped in an object.

```javascript
app.use('/graphql', expressHacheQL({ redis }), /* other middleware */);
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

- `req`  
  - The HTTP Request object.
- `res`
  - The HTTP Response object.
- `next`
  - The next middleware function.

### Return value
An invocation of the next middleware function (i.e., this function returns `next()`).

<hr>

### Sample usage

```javascript
app.use(
  '/graphql',
  expressHacheQL({ redis }),
  httpCache,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
```
</details>