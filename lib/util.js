const humps = require("humps");
const _ = require("lodash");

module.exports = {
	nodeEnv: process.env.NODE_ENV || "development",

	fromSnakeCase: GraphQLType => ({
		type: GraphQLType,
		resolve: (obj, args, ctx, { fieldName }) => {
			// return obj["... current field in snake case..."]
			return obj[humps.decamelize(fieldName)];
		}
	}),

	orderedFor: (rows, collection, field, singleObject) => {
		// return the rows ordered for the collection
		const data = humps.camelizeKeys(rows);
		const inGroupsOfField = _.groupBy(data, field);
		return collection.map(element => {
			const elementArray = inGroupsOfField[element];
			if (elementArray) return singleObject ? elementArray[0] : elementArray;
			return singleObject ? {} : [];
		});
	},

	slug: str => str.toLowerCase().replace(/[\s\W-]+/g, "-")
};
