const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLNonNull
} = require("graphql");

//const pgdb = require("../../database/pgdb");
const TotalVotes = require("./total-votes");

module.exports = new GraphQLObjectType({
	name: "Name",

	fields: () => {
		const UserType = require("./user");
		return {
			id: { type: GraphQLID },
			label: { type: new GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLString },
			createdAt: { type: new GraphQLNonNull(GraphQLString) },
			createdBy: {
				type: new GraphQLNonNull(UserType),
				resolve(parent, args, { loaders }) {
					return loaders.usersByIds.load(parent.createdBy);
					// return pgdb(pgPool).getUserById(parent.createdBy);
				}
			},
			totalVotes: {
				type: TotalVotes,
				resolve(parent, args, { loaders }) {
					return loaders.totalVotesByNameIds.load(parent.id);
				}
			}
		};
	}
});
