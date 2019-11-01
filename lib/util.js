const humps = require("humps");

module.exports = {
	nodeEnv: process.env.NODE_ENV || "development",

	fromSnakeCase: GraphQLType => ({
		type: GraphQLType,
		resolve: (obj, args, ctx, { fieldName }) => {
			// return obj["... current field in snake case..."]
			return obj[humps.decamelize(fieldName)];
		}
	})
};
