import React from 'react';
import graphql_rest from '../../images/graphql-versus-rest.png';
import bothWorld from '../../images/bestofbothworld.png';
import hacheql_image from '../../images/hacheQL-image.png';
import npm from '../../images/npm-logo.png';

// Should return a narrative on HacheQL and OspreyLabs
export default function info() {
  return (
    <div className="info-container">
      <div className="info">
        <h3>HacheQL is a lightweight, open source JavaScript library that provides an HTTP caching solution for GraphQL. Download our package and get started:</h3>
        <a href="https://www.npmjs.com/package/hacheql" target="_blank" rel="noreferrer">
          <img className="npm-logo" src={npm} />
        </a>
        <p>GraphQL provides an alternative to traditional RESTful architecture, emphasizing customization over optimization. This tradeoff highlights one of the prevalent shortcomings of GraphQL architecture: its rocky relationship with caching.</p>
        <div>
          <img className="graphql-rest-image" src={graphql_rest} />
          <cite>By Jordan Panasewicz, Medium.com</cite>
        </div>
        <p>HacheQL acts like a courier between your client and server. On the client, HacheQL takes a GraphQL request and sends it to the server in a way that makes the response HTTP cacheable. Subsequent requests from the client for the same data can be fulfilled from the browser or proxy caches. </p>

        <div className="hacheql-image-container">
          <img className="hacheql-image" src={hacheql_image} />
        </div>
        <p>With HacheQL you can have "the best of both worlds", allowing you to make use of the native caching mechanism over HTTP that is accessible in traditional RESTful architecture.</p>
        <div className="both-image-container">
          <img className="both-image" src={bothWorld} />
        </div>
      </div>
    </div>
  );
}
