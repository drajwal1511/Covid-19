const express = require("express");
const Router = express.Router();
var http = require("https");
const { json } = require("body-parser");
const { type } = require("os");
var countries=[];
function callsummary(){
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
            global=psbody.Global;
            countries=psbody.Countries;
            countries.sort(function(a,b){
                return (a.TotalConfirmed>b.TotalConfirmed)?-1 : (a.TotalConfirmed<b.TotalConfirmed)?1:0;
            });
            countries.forEach(function(c,i){
                c.imgflag= "https://www.countryflags.io/"+c.CountryCode+"/flat/64.png";
            });
           
        });
    });    
    sreq.end();   
}
Router.get("/",function(req,res){
    res.render("landingpage");
})
Router.get("/covid",function(req,res){
    callsummary();
    var imgsrc = "https://images.vexels.com/media/users/3/140409/isolated/preview/bb6e7b0f2c4e29df1f8e628d41f47eb5-globe-round-icon-1-by-vexels.png";
    res.render("home",{isglobal:true,img:imgsrc,global:global,countries:countries});
    
})
Router.post("/covid",function(req,res){
    var country = req.body.country.toString();
    countries.forEach(function(c,i){
        if(c.Country==country){
            res.render("home",{isglobal:false,country:c})
        }
    })
})
module.exports = Router;
