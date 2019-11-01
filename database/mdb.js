const { orderedFor } = require("../lib/util");

const logQuery = fields =>
	console.log(`*************************************
Mongo Query to fetch : Info of user(s) ${fields}`);

module.exports = mPool => ({
	getCounts(user, countsField) {
		logQuery([user.id]);
		return mPool
			.db("graphqlApp")
			.collection("users")
			.findOne({ userId: user.id })
			.then(userCounts => userCounts[countsField]);
	},

	getUsersByIds(userIds) {
		logQuery(userIds);
		return mPool
			.db("graphqlApp")
			.collection("users")
			.find({ userId: { $in: userIds } })
			.toArray()
			.then(res => orderedFor(res, userIds, "userId", true));
	}
});
