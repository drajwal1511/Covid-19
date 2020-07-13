$("#country").autocomplete({
    source: function(req,res){
        $.ajax({
            url:"https://api.covid19api.com/summary",
            method:"GET",
            dataType:"json",
            req:{
                name:req.term
            },
            success:function(xs){
                xs=xs.Countries.filter(function(x){
                    return x.Country.toLowerCase().indexOf(req.term.toLowerCase())!=-1;
                })
                var fxs=[];
                for(var i=0;i<xs.length;i++){
                    fxs.push(xs[i].Country);
                }
                res(fxs);
            }
        })
    }
});
// Load google charts

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
// Draw the chart and set the chart values
function drawChart() {
var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Total Recovered', Number($(".rp").text())],
    ['Total Deaths', Number($(".dp").text())]
]);
// Optional; add a title and set the width and height of the chart
var options = {'width':"100%", 'height':300};
// Display the chart inside the <div> element with id="piechart"
var chart = new google.visualization.PieChart(document.getElementById('piechart'));
chart.draw(data, options);
}
