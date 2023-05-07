//necessary imports
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const clientRouter = require("./routes/clients");
const customerRouter = require("./routes/customer");
const restaurantRouter = require("./routes/restaurant");
const requestRouter = require("./routes/requests");

//initializing application express
const app = express();
app.use(express.json());
app.use(cookieParser());

//database options
const option_mongodb = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

//adding environment variables - {PORT}
require("dotenv").config();

//cross orgin request source activation
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

//enabling routes for the application
app.use("/api/client", clientRouter);
app.use("/api/customer", customerRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/request", requestRouter);

//database connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URL, option_mongodb, ()=>{
    console.log("Successfully connected to database");
});

//starting the application
app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port : ${process.env.PORT}`);
});