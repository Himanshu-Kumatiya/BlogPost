const express=require("express");
const app=express();
const connectDB=require("./config/database");
require("dotenv").config;
const router=require("./routes/route");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1",router);
connectDB();
// const bodyParser=require("body-parser");
var cors = require("cors");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
const port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`server running at ${port}`);
})
app.get("/", (req, res) => {
    res.send(`<h1>Backend is Running and this is '/' Route</h1>`);
  });
