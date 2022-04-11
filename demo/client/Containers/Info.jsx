import React from 'react';
import graphql_rest from '../../images/graphql-versus-rest.png';
import bothWorld from '../../images/bestofbothworld.png'
import hacheql_image from '../../images/hacheQL-image.png';
import npm from '../../images/npm-logo.png';

//Should return a narrative on HacheQL and OspreyLabs
export default function info() {
  return (
    <div className='info-container'>
      <h2>About HacheQL</h2>
      <div className='info'>
        <h3>HacheQL is a lightweight open source Javascript library that provides a solution of HTTP caching for GraphQL. Download our package and get started:</h3>
        <a href='https://www.npmjs.com/package/hacheql' target="_blank">
          <img className='npm-logo' src={npm}></img>
        </a>
        <p>GraphQL provides an alternative to traditional RESTful architecture, emphasizing customization over optimization. This tradeoff highlights one of the prevalent shortcomings of GraphQL architecture, its nightmarish relationship with caching.</p>
        <div>
          <img className='graphql-rest-image' src={graphql_rest}></img>
          <cite>By Jordan Panasewicz, Medium.com</cite>
        </div>
        <p>HacheQL reformats GraphQL queries and stores them as a hash in a data store, reducing the size of network transfer. Subsequent network responses are then cached over HTTP at client, server and proxy level.</p>
        <div className='hacheql-image-container'>
          <img className='hacheql-image' src={hacheql_image}></img>
        </div>
        <p>With HacheQL you can have "the best of both worlds", allowing you to make use of the native caching mechanism over HTTP that is accessible in traditional RESTful architecture.</p>
        <div className='both-image-container'>
          <img className='both-image' src={bothWorld}></img>
        </div>
      </div>
    </div>
  )
}
