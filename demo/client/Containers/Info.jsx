import React from 'react';
import graphql_rest from '../../images/graphql-versus-rest.png'

//Should return a narrative on HacheQL and OspreyLabs
export default function info() {
  return (
    <div className='info-container'>
      <h2>About HacheQL</h2>
      <div className='info'>
        <h4>HacheQL is a lightweight open source Javascript library that provides a solution of HTTP caching for GraphQL</h4>
        <p>GraphQL provides an alternative to traditional RESTful architecture, emphasizing customization over optimization. This tradeoff highlights one of the prevalent shortcomings of GraphQL architecture, its nightmarish relationship with caching.</p>
        <div>
          <img className='graphql-rest-image' src={graphql_rest}></img>
          <cite>By Jordan Panasewicz, Medium.com</cite>
        </div>
        <p>HacheQL reformats GraphQL queries and stores them as a hash in a data store, reducing the size of network transfer. Subsequent network responses are then cached over HTTP at client, server and proxy level.</p>
        <div>
          <img className='graphql-rest-image' src={''}></img>
        </div>
        <p>With HacheQL you can have "the best of both worlds", allowing you to make use of the native caching mechanism over HTTP that is accessible in traditional RESTful architecture.</p>
        <div>
          <img className='graphql-rest-image' src={''}></img>
        </div>
      </div>
    </div>
  )
}
