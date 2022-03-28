import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
}
  from 'graphql';

import db from '../models/starWarsModel';

const getCharacters = () => db.query('SELECT * FROM characters').then((data) => data.rows);
const getPlanets = () => db.query('SELECT * FROM planets').then((data) => data.rows);

const planetType = new GraphQLObjectType({
  name: 'planetType',
  description: 'star wars planets',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLInt) },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

const characterType = new GraphQLObjectType({
  name: 'characterType',
  description: 'star wars characters',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    home_planet_id: { type: new GraphQLNonNull(GraphQLInt) },
    homePlanet: {
      type: planetType,
      description: 'home planet',
      resolve: (parent) => db.query('SELECT name FROM planets WHERE _id = $1', [parent.home_planet_id]).then((data) => data.rows[0]),
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'This is our root',
  fields: () => ({
    characters: {
      type: new GraphQLList(characterType),
      description: 'List of All characters',
      resolve: getCharacters,
    },
    planets: {
      type: new GraphQLList(planetType),
      description: 'List of All planets',
      resolve: getPlanets,
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Our mutating type',
  fields: () => ({
    addCharacter: {
      type: characterType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        home_planet_id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parents, args) {
        return db.query('INSERT INTO Characters (name, home_planet_id) VALUES ( $1, $2) RETURNING *', [ args.name, args.home_planet_id])
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: mutationType
});

export default {
  schema,
  rootQueryType,
  characterType,
  planetType,
};
