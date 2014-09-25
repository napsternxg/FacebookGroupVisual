var ymdFormat = d3.time.format("%Y-%m-%d");
var yFormat = d3.time.format("%Y");


var dataJSON = null;


d3.json('data.json', function(presidents){

    var ymdFormat = d3.time.format("%Y-%m-%d");
    presidents.forEach(function(p) {
      p.took_office = ymdFormat.parse(p.took_office);
      if (p.left_office) {
        p.left_office = ymdFormat.parse(p.left_office);
      }
    });
    
    // Use the crossfilter force.
    var cf = crossfilter(presidents);
    
    // Create a dimension by political party
    var byParty = cf.dimension(function(p) { return p.party; });
    
    console.log("-- group by party");
    var groupByParty = byParty.group();
    groupByParty.top(Infinity).forEach(function(p, i) {
      console.log(p.key + ": " + p.value);
    });
    console.log("");
    
    console.log("-- filter to Whig party presidents");
    byParty.filterExact("Whig");
    byParty.top(Infinity).forEach(function(p, i) {
      console.log(p.number + ". " + p.president);
    });
    console.log("");
    
    byParty.filterAll();
    
    // Create a dimension by the year a president took office.
    var byTookOffice = cf.dimension(function(p) { return p.took_office; });
    console.log("Total # of presidents: " + byTookOffice.top(Infinity).length);
    
    // filter to presidents starting after 1900.
    byTookOffice.filter([new Date(1900, 1, 1), Infinity]);
    console.log("# of presidents starting after 1900: " + byTookOffice.top(Infinity).length);
    groupByParty.top(Infinity).forEach(function(p, i) {
      console.log(p.key + ": " + p.value);
    });
    
    byTookOffice.filterAll();
    
    function barchart(id, groupByParty) {
      var woff = 115;
      var hoff = 0;
      var w = 400 + woff;
      var h = 100 + hoff;
    
      var parties = groupByParty.top(Infinity);
    
      var chart = d3.select(id)
        .append("svg")
          .attr("class", "chart")
          .attr("width", w)
          .attr("height", h)
        .append("g")
          .attr("transform", "translate(" + woff + "," + hoff + ")");
    
      var x = d3.scale.linear()
        .domain([0, d3.max(parties, function(v) { return v.value; })])
        .range([0, w-woff]);
    
      var y = d3.scale.ordinal()
        .domain(d3.range(parties.length))
        .rangeBands([0, h-hoff]);
    
      var refresh = function() {
        var bars = chart.selectAll("rect")
            .data(parties, function(v) { return v.key; });
    
        bars.enter().append("rect")
            .attr("height", y.rangeBand());
    
        bars.attr("y", function(d, i) { return i * y.rangeBand(); })
            .attr("width", function(v) { return x(v.value); });
    
        var partyLabels = chart.selectAll(".party-label")
            .data(parties, function(v) { return v.key; });
    
        partyLabels.enter().append("text")
            .attr("class", "party-label")
            .attr("x", function(v) { return 0; })
            .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function(v) { return v.key; });
    
        var valueLabels = chart.selectAll(".value-label")
            .data(parties, function(v) { return v.key; });
    
        valueLabels.enter().append("text")
            .attr("class", "value-label")
            .attr("dy", ".35em")
            .attr("dx", -3);
    
        valueLabels
            .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
            .text(function(v) { return v.value; })
            .attr("x", function(v) { 
              if (v.value === 0) {
                return x(1);
              } else {
                return x(v.value); 
              }
            })
            .classed("white", function(v) { 
              return v.value !== 0;
            });
    
      };
    
      refresh();
    
      return {refresh: refresh};
    
    }
    
    var bars = barchart("#chart", groupByParty);
    
    $("#slider").change(function(ev) {
      var year = $(this).val();
      $("#start-year").text(year);
      byTookOffice.filter([new Date(year, 1, 1), Infinity]);
      bars.refresh();
    });

});

/*

d3.json('data.json', function(presidents){
	presidents.forEach(function(d){
		var t = "Random";
		try{
			d.took_office = ymdFormat.parse(d.took_office+'');
			d.left_office = ymdFormat.parse(d.left_office+'');
			d.birth_year = yFormat.parse(''+d.birth_year);
			d.death_year = yFormat.parse(''+d.death_year);	
		}catch(e){
			console.log(e.stack);
			console.log(d);
			console.log(t);
		}
	});

	dataJSON = presidents;
	// Use the crossfilter force.
    var cf = crossfilter(presidents);
    
    // Create a dimension by political party
    var byParty = cf.dimension(function(p) { return p.party; });
    
    console.log("-- group by party");
    var groupByParty = byParty.group();
    groupByParty.top(Infinity).forEach(function(p, i) {
      console.log(p.key + ": " + p.value);
    });
    console.log("");
    
    console.log("-- filter to Whig party presidents");
    byParty.filterExact("Whig");
    byParty.top(Infinity).forEach(function(p, i) {
      console.log(p.number + ". " + p.president);
    });
    console.log("");
    
    byParty.filterAll();
    
    // Create a dimension by the year a president took office.
    var byTookOffice = cf.dimension(function(p) { return p.took_office; });
    console.log("Total # of presidents: " + byTookOffice.top(Infinity).length);
    
    // filter to presidents starting after 1900.
    byTookOffice.filter([new Date(1900, 1, 1), Infinity]);
    console.log("# of presidents starting after 1900: " + byTookOffice.top(Infinity).length);
    groupByParty.top(Infinity).forEach(function(p, i) {
      console.log(p.key + ": " + p.value);
    });
    
    byTookOffice.filterAll();


	function barchart(id, groupByParty) {
		var woff = 115;
		var hoff = 0;
		var w = 400 + woff;
		var h = 100 + hoff;

		var parties = groupByParty.top(Infinity);

		var chart = d3.select(id)
			.append("svg")
			.attr("class", "chart")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + woff + "," + hoff + ")");

		var x = d3.scale.linear()
		.domain([0, d3.max(parties, function(v) { return v.value; })])
		.range([0, w-woff]);

		var y = d3.scale.ordinal()
		.domain(d3.range(parties.length))
		.rangeBands([0, h-hoff]);

		var refresh = function() {
			var bars = chart.selectAll("rect")
            	.data(parties, function(v) { return v.key; });

            bars.enter().append("rect")
            	.attr("height", y.rangeBand());
    
    	    bars.attr("y", function(d, i) { return i * y.rangeBand(); })
        	    .attr("width", function(v) { return x(v.value); });

        	var partyLabels = chart.selectAll(".party-label")
            	.data(parties, function(v) { return v.key; });

            partyLabels.enter().append("text")
	            .attr("class", "party-label")
	            .attr("x", function(v) { return 0; })
	            .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
	            .attr("dx", -3)
	            .attr("dy", ".35em")
	            .attr("text-anchor", "end")
	            .text(function(v) { return v.key; });
			
			var valueLabels = chart.selectAll(".value-label")
            .data(parties, function(v) { return v.key; });
    
        valueLabels.enter().append("text")
            .attr("class", "value-label")
            .attr("dy", ".35em")
            .attr("dx", -3);
    
        valueLabels
            .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
            .text(function(v) { return v.value; })
            .attr("x", function(v) { 
              if (v.value === 0) {
                return x(1);
              } else {
                return x(v.value); 
              }
            })
            .classed("white", function(v) { 
              return v.value !== 0;
            });    
    
		};

		refresh();
    
      return {refresh: refresh};

      var bars = barchart("#chart", groupByParty);
    
    $("#slider").change(function(ev) {
      var year = $(this).val();
      $("#start-year").text(year);
      byTookOffice.filter([new Date(year, 1, 1), Infinity]);
      bars.refresh();
    });
	}


});

*/