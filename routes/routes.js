const express = require("express");
const Router = express.Router();
var http = require("https");
Router.get("/",function(req,res){
    res.render("landingpage");
})
Router.get("/covid",function(req,res){
    var options = {
        "method": "GET",
        "hostname": "covid-19-data.p.rapidapi.com",
        "port": null,
        "path": "/totals?format=json",
        "headers": {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key":process.env.key,
            "useQueryString": true
        }
    };    
    var apireq = http.request(options, function (apires) {
        var chunks = [];    
        apires.on("data", function (chunk) {
            chunks.push(chunk);
        });    
        apires.on("end", function () {
            var body = Buffer.concat(chunks);
            pbody=JSON.parse(body);
            if(pbody[0]){
                var imgsrc = "https://images.vexels.com/media/users/3/140409/isolated/preview/bb6e7b0f2c4e29df1f8e628d41f47eb5-globe-round-icon-1-by-vexels.png";
                var ops = {
                    "method": "GET",
                    "hostname": "api.covid19api.com",
                    "port": null,
                    "path": "/summary",
                    "headers": {
                    }
                };    
                var sreq = http.request(ops, function (sres) {
                    var schunks = [];    
                    sres.on("data", function (schunk) {
                        schunks.push(schunk);
                    });    
                    sres.on("end", function () {
                        var sbody = Buffer.concat(schunks);
                        psbody=JSON.parse(sbody);
                        res.render("home",{img:imgsrc,body:JSON.parse(body),summary:psbody});
                    });
                });    
                sreq.end();
            }
            else{
                res.send("Not Found");
            }
        });
    });    
    apireq.end();
    
})
Router.post("/covid",function(req,res){
    var country = (req.body.country);
    var options = {
        "method": "GET",
        "hostname": "covid-19-data.p.rapidapi.com",
        "port": null,
        "path": "/country?format=json&name="+country,
        "headers": {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key": process.env.key,
            "useQueryString": true
        }
        };
        var apireq = http.request(options, function (apires) {
        var chunks = [];
        apires.on("data", function (chunk) {
            chunks.push(chunk);
        });
        apires.on("end", function () {
            var body = Buffer.concat(chunks);
            pbody=JSON.parse(body);
            if(pbody[0]){
                var imgsrc = "https://www.countryflags.io/"+pbody[0].code+"/flat/64.png";
                res.render("home",{img:imgsrc,body:JSON.parse(body)});
            }
            else{
                res.send("Not Found");
            }
        });
        });
        apireq.end();

})
module.exports = Router;
