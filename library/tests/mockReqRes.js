import { HASH_NOT_FOUND } from './HTTPStatusCodes';

const endpointURL = 'graphql';
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    accepts: 'application/json',
  },
  body: JSON.stringify(
    {
      query: `query {
          films {
            _id
            title
          }
         }`,
    },
  ),
};
const serverResponse200 = {
  status: 200,
  body: JSON.stringify({
    data: {
      characters: [
        {
          _id: 1,
          name: 'Mario',
          win_rate: '54%',
          best_time: '1:50.713',
          favorite_item: 'Golden Mushroom',
          arch_nemesis: {
            name: 'Bowser',
          },
        },
        {
          _id: 2,
          name: 'Princess Peach',
          win_rate: '78%',
          best_time: '1:23.402',
          favorite_item: 'Bob-omb',
          arch_nemesis: {
            name: 'Luigi',
          },
        },
        {
          _id: 3,
          name: 'Luigi',
          win_rate: '41%',
          best_time: '2:09.250',
          favorite_item: 'Triple Bananas',
          arch_nemesis: {
            name: 'Bowser',
          },
        },
        {
          _id: 4,
          name: 'Bowser',
          win_rate: '48%',
          best_time: '1:56.917',
          favorite_item: 'Piranha Plant',
          arch_nemesis: {
            name: 'Mario',
          },
        },
      ],
    },
  }),
};
const serverResponse304 = {
  status: 304,
};
const serverResponseHashNotFound = {
  status: HASH_NOT_FOUND,
};

export {
  endpointURL,
  requestOptions,
  serverResponse200,
  serverResponse304,
  serverResponseHashNotFound,
};
