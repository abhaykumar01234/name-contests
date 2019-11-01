const humps = require("humps");

const logQuery = (query, params) =>
	console.log(`**********************************
Query : ${query}
Params: ${params}`);

module.exports = pgPool => ({
	getUserByApiKey(apiKey) {
		const query = `select * from users where api_key = $1`;
		logQuery(query, [apiKey]);
		return pgPool
			.query(query, [apiKey])
			.then(res => humps.camelizeKeys(res.rows[0]));
	},

	getUserById(userId) {
		const query = `select * from users where id = $1`;
		logQuery(query, [userId]);
		return pgPool
			.query(query, [userId])
			.then(res => humps.camelizeKeys(res.rows[0]));
	},

	getContests(user) {
		const query = `select * from contests where created_by = $1`;
		logQuery(query, [user.id]);
		return pgPool
			.query(query, [user.id])
			.then(res => humps.camelizeKeys(res.rows));
	},

	getNames(contest) {
		const query = `select * from names where contest_id = $1`;
		logQuery(query, [contest.id]);
		return pgPool
			.query(query, [contest.id])
			.then(res => humps.camelizeKeys(res.rows));
	}
});
