// Import type helpers from graphql-js
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID
} = require("graphql");

const pgdb = require("../database/pgdb");

const UserType = require("./types/user");

// The root query type defines the entry point in graphql data structure
// All graphql resolvers can handle promises
const RootQueryType = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		// hello: {
		// 	type: GraphQLString,
		// 	description: "The *mandatory* hello world example, GraphQL style",
		// 	resolve: () => "world"
		// },
		me: {
			type: UserType,
			description: "The current user defined by an API Key",
			args: {
				key: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (parent, args, { pgPool }) => {
				// Read user info from database
				return pgdb(pgPool).getUserByApiKey(args.key);
			}
		}
	}
});

const ncSchema = new GraphQLSchema({
	query: RootQueryType
	// mutation
});

module.exports = ncSchema;
