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
    ['Total Deaths', Number($(".dp").text())],
    ["Mild/Critical",Number($(".tp").text())-(Number($(".dp").text())+Number($(".rp").text()) )]
]);
// Optional; add a title and set the width and height of the chart
var options = {'width':"100%", 'height':300};
// Display the chart inside the <div> element with id="piechart"
var chart = new google.visualization.PieChart(document.getElementById('piechart'));
chart.draw(data, options);
}
// for date calender
$( function() {
    $( "#datepicker" ).datepicker();
});
// for line graph
var slugname = $("#slugname").text();
var url="https://api.covid19api.com/total/country/"+slugname;
$.ajax({
    url:url,
    method:"GET",
    dataType:"json",
    success:function(data){
        var totaldata=[];
            for(var i=0;i<data.length;i++){
                var tempdata=[];
                var datestr = data[i].Date;
                var yearstr = datestr.slice(0,4);
                var monthstr = datestr.slice(5,7);
                var daystr = datestr.slice(8,10);
                var datetopush = new Date(Number(yearstr),Number(monthstr),Number(daystr));
                tempdata.push(datetopush);
                tempdata.push(Number(data[i].Confirmed));
                tempdata.push(Number(data[i].Deaths));
                tempdata.push(Number(data[i].Recovered));
                totaldata.push(tempdata);
            }
        google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Confirmed');
            data.addColumn('number', 'Death');
            data.addColumn('number', 'Recovered');
            data.addRows(totaldata);
            var options = {
            width: "100%",
            height: 300,
            };
            var chart = new google.charts.Line(document.getElementById('linechart_material'));
            chart.draw(data, google.charts.Line.convertOptions(options));
        }
    }
})