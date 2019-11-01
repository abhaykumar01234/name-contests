// Import type helpers from graphql-js
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID
} = require("graphql");

const UserType = require("./types/user");

// The root query type defines the entry point in graphql data structure
// All graphql resolvers can handle promises
const RootQueryType = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		me: {
			type: UserType,
			description: "The current user defined by an API Key",
			args: {
				key: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve: (parent, args, { loaders }) => {
				// Read user info from database
				return loaders.usersByApiKeys.load(args.key);
			}
		}
	})
});

const AddContestMutation = require("./mutations/add-contest");

const RootMutationType = new GraphQLObjectType({
	name: "RootMutationType",

	fields: () => ({
		AddContest: AddContestMutation
		// AddName : AddNameMutation
	})
});

const ncSchema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType
});

module.exports = ncSchema;
