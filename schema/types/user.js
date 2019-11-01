const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLInt
} = require("graphql");

const ContestType = require("./contest");
const ActivityType = require("./activity");

module.exports = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		fullName: {
			type: GraphQLString,
			resolve: obj => `${obj.firstName} ${obj.lastName}`
		},
		email: { type: new GraphQLNonNull(GraphQLString) },
		createdAt: {
			type: GraphQLString,
			resolve: ({ createdAt }) => {
				var _d = new Date(createdAt);
				return `${_d.getDate()}-${_d.getMonth()}-${_d.getFullYear()} ${_d.getHours()}:${_d.getMinutes()}`;
			}
		},

		contests: {
			type: new GraphQLList(ContestType),
			resolve: (parent, args, { loaders }) => {
				return loaders.contestsForUserIds.load(parent.id);
			}
		},

		contestsCount: {
			type: GraphQLInt,
			resolve(parent, args, { loaders }, { fieldName }) {
				return loaders.mdb.usersByIds
					.load(parent.id)
					.then(res => res[fieldName]);
			}
		},

		namesCount: {
			type: GraphQLInt,
			resolve(parent, args, { loaders }, { fieldName }) {
				return loaders.mdb.usersByIds
					.load(parent.id)
					.then(res => res[fieldName]);
			}
		},

		votesCount: {
			type: GraphQLInt,
			resolve(parent, args, { loaders }, { fieldName }) {
				return loaders.mdb.usersByIds
					.load(parent.id)
					.then(res => res[fieldName]);
			}
		},

		activities: {
			type: new GraphQLList(ActivityType),
			resolve(obj, args, { loaders }) {
				return loaders.activitiesForUserIds.load(obj.id);
			}
		}
	})
});
