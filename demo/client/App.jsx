import React from 'react';
import { hacheQL } from '../../library/hacheql';

function App() {
  let t0, t1;
  const getAll = () => {
    console.log('click');
    // initiate timer
    t0 = performance.now()
    console.log('t0', t0);
    hacheQL('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          people {
            _id
            name
            homeworld_id
          }
        }`
      })
    })
      .then((res) => res.json())
      // .then((data) => console.log(data.data))
      .then((data) => {
        console.log(data)
        // timer ends after fetch
        t1 = performance.now();
        console.log('runtime', t1-t0)
      })
      .catch((err) => console.log('error in post add application: ', err));
  };

  return (
    <div>
    <button onClick={getAll}>Button</button>
    </div>
  );
}

export default App;
