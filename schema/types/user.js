const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLInt
} = require("graphql");

// const { fromSnakeCase } = require("../../lib/util");
const pgdb = require("../../database/pgdb");
const mdb = require("../../database/mdb");

const ContestType = require("./contest");

module.exports = new GraphQLObjectType({
	name: "UserType",
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		// firstName: { type: GraphQLString, resolve: obj => obj.first_name },
		// firstName: fromSnakeCase(GraphQLString),
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
			resolve: (parent, args, { pgPool }) => {
				// Read data from the database
				return pgdb(pgPool).getContests(parent);
			}
		},

		contestsCount: {
			type: GraphQLInt,
			resolve(parent, args, { mPool }, { fieldName }) {
				return mdb(mPool).getCounts(parent, fieldName);
			}
		},

		namesCount: {
			type: GraphQLInt,
			resolve(parent, args, { mPool }, { fieldName }) {
				return mdb(mPool).getCounts(parent, fieldName);
			}
		},

		votesCount: {
			type: GraphQLInt,
			resolve(parent, args, { mPool }, { fieldName }) {
				return mdb(mPool).getCounts(parent, fieldName);
			}
		}
	})
});
