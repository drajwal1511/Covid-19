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
    callsummary();
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
            res.render("home",{isglobal:false,isdate:false,country:c})
        }
    })
})
Router.post("/covid/date",function(req,res){
    var country = req.body.country.slice(0,req.body.country.length-1);
    var slug="";
    countries.forEach(function(c){
        if(c.Country==country){
            slug=c.Slug;
            console.log(country,slug);
        }
    })
    var datestr=req.body.date;
    var month = datestr.slice(0,2);
    var day = datestr.slice(3,5);
    var year = datestr.slice(6,10);
    var datestring = year+"-"+month+"-"+day+"T00:00:00";
    var date= new Date();
    date.setFullYear(Number(year));
    date.setMonth(Number(month)-1);
    date.setDate(Number(day));
    var fromdate=new Date();
    fromdate=date;
    fromdate.setDate(date.getDate()-1);
    var urls="/country/"+slug+"?from="+String(fromdate.getFullYear())+"-"+("0"+String(fromdate.getMonth()+1)).slice(-2)+"-"+("0"+String(fromdate.getDate())).slice(-2)+"T00:00:00Z&to="+year+"-"+month+"-"+day+"T00:00:00Z";
    console.log(urls);
        var cops = {
            "method": "GET",
            "hostname": "api.covid19api.com",
            "port": null,
            "path": urls,
            "headers": {
            }
        };    
        var creq = http.request(cops, function (cres) {
            var cchunks = [];    
            cres.on("data", function (cchunk) {
                cchunks.push(cchunk);
            });    
            cres.on("end", function () {
                var cbody = Buffer.concat(cchunks);
                pcbody=JSON.parse(cbody);  
                var country = {
                    Country:pcbody[1].Country,
                    Slug:slug,
                    TotalConfirmed:pcbody[1].Confirmed,
                    TotalDeaths:pcbody[1].Deaths,
                    TotalRecovered:pcbody[1].Recovered,
                }             
                res.render("home",{isglobal:false,isdate:true,isdate:true,country:country})
            });
        });    
        creq.end();       
})
module.exports = Router;
