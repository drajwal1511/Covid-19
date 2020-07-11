const express = require("express");
require('dotenv').config()
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
const routes = require("./routes/routes");
app.use(routes);
app.listen(process.env.PORT||3000,process.env.IP,()=>{
    console.log("Server UP");
})