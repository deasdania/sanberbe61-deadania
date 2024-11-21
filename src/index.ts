// import express from "express";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import YAML from 'yamljs'; // Import yamljs to load YAML files
import path from 'path';

import {SERVER_URL, ENV} from "./utils/env";
import db from "./utils/database";
import transporter from "./utils/mail";
import routes from "./routes/api";


import swaggerUi from 'swagger-ui-express';

const environment = process.env.NODE_ENV || 'development';

const PORT = 3000;

async function init() {
  try {
    await db();
    await transporter;
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Load the Swagger YAML file
    const swaggerDocument = YAML.load(path.join(__dirname, '../', 'swagger.yaml'));

    // Add the server URL dynamically
    swaggerDocument.servers = [{
      url: SERVER_URL,
    }];

    // Set up Swagger UI
    app.use("", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use("/api", routes);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
