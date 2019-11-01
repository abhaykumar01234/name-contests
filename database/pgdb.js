const { orderedFor } = require("../lib/util");
const humps = require("humps");
const { slug } = require("../lib/util");

const logQuery = (query, params) =>
	console.log(`**********************************
Query : ${query}
Params: ${params}`);

module.exports = pgPool => ({
	getUsersByApiKeys(apiKeys) {
		const query = `select * from users where api_key = ANY($1)`;
		logQuery(query, [apiKeys]);
		return pgPool
			.query(query, [apiKeys])
			.then(res => orderedFor(res.rows, apiKeys, "apiKey", true));
	},

	getUsersByIds(userIds) {
		const query = `select * from users where id = ANY($1)`;
		logQuery(query, [userIds]);
		return pgPool
			.query(query, [userIds])
			.then(res => orderedFor(res.rows, userIds, "id", true));
	},

	getContestsForUserIds(userIds) {
		const query = `select * from contests where created_by = ANY($1)`;
		logQuery(query, [userIds]);
		return pgPool
			.query(query, [userIds])
			.then(res => orderedFor(res.rows, userIds, "createdBy", false));
	},

	getNamesForContestIds(contestIds) {
		const query = `select * from names where contest_id = ANY($1)`;
		logQuery(query, [contestIds]);
		return pgPool
			.query(query, [contestIds])
			.then(res => orderedFor(res.rows, contestIds, "contestId", false));
	},

	getTotalVotesByNameIds(nameIds) {
		const query = `select name_id, up, down from total_votes_by_name where name_id = ANY($1)`;
		logQuery(query, [nameIds]);
		return pgPool
			.query(query, [nameIds])
			.then(res => orderedFor(res.rows, nameIds, "nameId", true));
	},

	getActivitiesForUserIds(userIds) {
		const query = `select created_by, created_at, label, '' as title, 'name' as activity_type
		from names where created_by = ANY($1)
		union
		select created_by, created_at, '' as label, title, 'contest' as activity_type
		from contests where created_by = ANY($1)
		`;
		logQuery(query, [userIds]);
		return pgPool
			.query(query, [userIds])
			.then(res => orderedFor(res.rows, userIds, "createdBy", false));
	},

	addNewContest({ apiKey, title, description }) {
		const query = `insert into contests(code, title, description, created_by)
		values($1, $2, $3, 
			(select id from users where api_key = $4)	
		) returning * `;
		logQuery(query, [slug(title), title, description, apiKey]);
		return pgPool
			.query(query, [slug(title), title, description, apiKey])
			.then(res => humps.camelizeKeys(res.rows[0]));
	}
});
