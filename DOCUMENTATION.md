## Documentation

### hacheQL()

Use this function on the client side to send an HTTP request to your GraphQL API.

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