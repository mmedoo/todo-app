const express = require("express")
const app = express();
const path = require("path");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const create_route = require("./routers/create");
const update_route = require("./routers/update");
const delete_route = require("./routers/delete");
const read_route = require("./routers/read");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

for (let route of [create_route, update_route, delete_route, read_route]) {
	app.use('/', route);
}

const port = process.env.PORT || 3300;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
