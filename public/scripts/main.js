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