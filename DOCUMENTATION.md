## Documentation

### hacheQL()

Use this function on the client to send an HTTP request to your GraphQL API.

<details><summary>Expand for details</summary>
#### Syntax
```javascript
hacheQL(endpoint[, options])
```
This function signature is designed to mimic [the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch). (In fact, `hacheQL()` uses the Fetch API under the hood.)  

#### Parameters
- `endpoint`  
  - The endpoint for the GraphQL request. Analogous to the Fetch API's 'resource' parameter.
- `options`
  - An object containing settings for the request; for example, the HTTP request method, request headers, and request body. 
  - Analogous to the fetch API's 'init' parameter. All valid settings for the fetch API's 'init' object are valid for this function's options object.

#### Return value
A Promise that resolves to a Response object from the server, or rejects with an Error object.
</details>

<hr>

### nodeHacheQL()

Use this function on the server to process incoming GraphQL requests.
If your project uses Express.js, we recommend using [expressHacheQL](#expresshacheql) instead.

<details><summary>Expand for details</summary>
#### Syntax
```javascript
nodeHacheQL(req, res, opts[, cache, callback])
```

#### Parameters
- `req`  
  - The HTTP Request object.
- `res`
  - The HTTP Response object.
  - Analogous to the fetch API's 'init' parameter. All valid settings for the fetch API's 'init' object are valid for this function's options object.
- `opts`
  -
- `cache` (optional)
  - If not specified, defaults to an empty object.
- `callback` (optional)
  - If no specified, defaults to:
  ```javascript
  (err, data) => {
  if (err) {
    throw err;
  }
  return data;
  }
  ```

#### Return value
*GONNA HAVE TO READ THIS FUNCTION*
</details>

<hr>

### expressHacheQL()

Use this function on the server to process incoming GraphQL requests. This is a version of the [nodeHacheQL](#nodehacheql) function built specifically for Express. It takes advantage of Express's middleware pattern and the `res.locals` object.

<details><summary>Expand for details</summary>

If the incoming HTTP request contains a GraphQL query, expressHacheQL will cache it.

If the incoming HTTP request does not contain a GraphQL query, expressHacheQL checks to see if a corresponding GraphQL query has been cached. If so, it retrieves the query. If not, it responds to the client asking it to send another HTTP request with the query attached. expressHacheQL will cache the query once it receives the followup HTTP request.

#### Syntax
```javascript
expressHacheQL(options[, cache])
```

#### Parameters
- `endpoint`  
  - The endpoint for the GraphQL request. Analogous to the Fetch API's 'resource' parameter.
- `options`
  - An object containing settings for the request; for example, the HTTP request method, request headers, and request body. 
  - Analogous to the fetch API's 'init' parameter. All valid settings for the fetch API's 'init' object are valid for this function's options object.

#### Return value
A Promise that resolves to a Response object from the server, or rejects with an Error object.
</details>

<hr>

### httpCache()

Use this function on the client side to send an HTTP request to your GraphQL API.

#### Syntax
```javascript
httpCache(req, res, next)
```
Sets cache-control headers on the HTTP Response object, as long as the value of `res.locals.cacheable` is `true`.

<details></summary>Expand for details</summary>
#### Parameters
Note: Express automatically passes all three of these arguments to each piece of middleware. You do not need to do it manually.

- `req`  
  - The HTTP Request object.
- `res`
  - The HTTP Response object.
- `next`
  - The next middleware function.

#### Return value
An invocation of the next middleware function (i.e., this function returns `next();`).
</details>