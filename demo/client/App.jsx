import React from 'react';
import { hacheQL } from '../../library/hacheql';

function App() {
  // const query = `{
  //   characters {
  //     _id
  //     name
  //     home_planet_id
  //     homePlanet {
  //       name
  //     }
  //   }
  // }`

  const getAll = () => {
    console.log('click');
    hacheQL('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          characters {
            _id
            name
            home_planet_id
            homePlanet {
              name
            }
          }
        }`
      })
    })
      .then((res) => res.json())
      // .then((data) => console.log(data.data))
      .then((data) => console.log(data))
      .catch((err) => console.log('error in post add application: ', err));
  };

  return (
    <div>
    <button onClick={getAll}>Button</button>
    </div>
  );
}

export default App;
