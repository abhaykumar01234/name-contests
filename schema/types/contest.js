const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList
} = require("graphql");

const ContestStatusType = require("./contest-status");
const NameType = require("./name");

// const pgdb = require("../../database/pgdb");

module.exports = new GraphQLObjectType({
	name: "Contest",

	fields: () => ({
		id: { type: GraphQLID },
		code: { type: new GraphQLNonNull(GraphQLString) },
		title: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLString },
		status: { type: new GraphQLNonNull(ContestStatusType) },
		createdAt: { type: new GraphQLNonNull(GraphQLString) },
		names: {
			type: new GraphQLList(NameType),
			resolve(parent, args, { loaders }) {
				// return pgdb(pgPool).getNames(parent);
				return loaders.namesForContestIds.load(parent.id);
			}
		}
	})
});
