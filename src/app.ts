/**
 * # app.ts
 *
 * ---
 *
 * Main file, handles Express's methods and defines the use of the routes.
 *
 * Currently there's only a main route at the root of the endpoint.
 *
 *
 * @packageDocumentation
 */

// Imports
import * as bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { createerror } from "http-errors"
import logger from "morgan"
import * as path from "path"
import { GetRoute, PostRoute } from "./routes/index"

// Set-up Express
export const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))

app.options("/", cors())

//CORS middleware
const corsMiddleware = (req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        req.app.get("env") === "development" ? "http://localhost:4000" : "https://nodoambiental.org"
    )
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
    res.header("Access-Control-Allow-Headers", "Content-Type, query-kind")

    next()
}

app.use(corsMiddleware)

// Route selection
app.use("/", PostRoute)
app.use("/verification", GetRoute)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createerror(404))
})

// Error handler
app.use((error, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = error.message
    res.locals.error = req.app.get("env") === "development" ? error : {}

    // Render the error page
    res.status(error.status || 500)
})
