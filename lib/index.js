const { nodeEnv } = require("./util");
console.log(`Running in ${nodeEnv} mode...`);

const pg = require("pg");
const pgConfig = require("../config/pg")[nodeEnv];
const pgPool = new pg.Pool(pgConfig);

const { MongoClient } = require("mongodb");
const assert = require("assert");
const mConfig = require("../config/mongo")[nodeEnv];

const app = require("express")();

// Read the query from the command line arguments
// const query = process.argv[2];

const ncSchema = require("../schema/index");
const graphqlHTTP = require("express-graphql");
// const { graphql } = require("graphql");

MongoClient.connect(mConfig.url, { useUnifiedTopology: true }, (err, mPool) => {
	assert.equal(err, null);

	app.use(
		"/graphql",
		graphqlHTTP({
			schema: ncSchema,
			graphiql: true,
			context: {
				pgPool,
				mPool
			}
		})
	);

	// Execute the query against the defined server schema
	// graphql(ncSchema, query).then(result => console.log(result));

	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
});
