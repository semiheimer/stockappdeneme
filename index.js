"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const express = require('express')
const app = express()
const path = require("node:path");

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config({ path: __dirname + '/.env' })

const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// Cors:
app.use(require('cors')())

app.use(express.static(path.resolve(__dirname, "public")));

// Check Authentication:
app.use(require('./src/middlewares/authentication'))

// res.getModelList():
app.use(require('./src/middlewares/findSearchSortPage'))

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all("/api/v1/documents", (req, res) => {

    res.send(`
        <h3>Stock Management API Service</h3>
        <hr>
        <p>
            Documents:
            <ul> 
                <li><a href="/documents/swagger">SWAGGER</a></li>
                <li><a href="/documents/redoc">REDOC</a></li>
                <li><a href="/documents/json">JSON</a></li>
            </ul>
        </p>
    `)
})

// Routes:
app.use("/api/v1", require('./src/routes'))

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
    res.status(404).json({ msg: "The page you are trying to reach could not be found" });
});

/* ------------------------------------------------------- */

// Syncronization (must be in commentLine):

// if (process.env.NODE_ENV == "development") {
//     require('./src/helpers/sync')() // !!! It clear database.
// }
// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`))