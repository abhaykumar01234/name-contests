module.exports = mPool => ({
	getCounts(user, countsField) {
		return mPool
			.db("graphqlApp")
			.collection("users")
			.findOne({ userId: user.id })
			.then(userCounts => userCounts[countsField]);
	}
});
