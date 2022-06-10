const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const connectMongoDB = require("./config/db")
const port = process.env.PORT || 5000;


connectMongoDB()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//@Across origin service CORS
const corsOptions = {
    origin: "*",
    credentials: false, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };


//@desc user routes
app.use("/api/users", cors(corsOptions), require("./routes/userRoutes"));
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`.cyan.underline));
