const express = require("express")
const app = express();
const path = require("path");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const cors = require("cors");
const routers = require("./routers/all");

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

for (let route of Object.values(routers)) {
	app.use('/', route);
}

const port = process.env.PORT || 3300;

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
