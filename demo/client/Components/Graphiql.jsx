//Experimental Graphiql IDE in browser

import React from 'react';
import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';


export default function graphiql() {
  const fetcher = createGraphiQLFetcher({
    url: window.location.origin + '/graphql',
  });

  return (
    <div className='graphiql'>
      <GraphiQL
        fetcher={async (graphQLParams) => {
          const data = await fetch('graphql', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'same-origin',
          });
          return data.json().catch(() => data.text());
        }}
      />
    </div>
  )
}
