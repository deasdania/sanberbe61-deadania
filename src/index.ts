// import express from "express";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import db from "./utils/database";
import transporter from "./utils/mail";
import routes from "./routes/api";
import docs from "./docs/route";

const environment = process.env.NODE_ENV || 'development';

const PORT = 3000;

async function init() {
  try {
    await db();
    await transporter;
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
      res.redirect('/docs');
    });
    app.use("/api", routes);
    docs(app);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
