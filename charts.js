var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var drawViz = function(error, data){
	if (error) return console.warn(error);
	var fbVizObj = new fbViz();
	fbVizObj.init(data, {
			margin: margin,
			width: width,
			height: height,
			divId: "#graphs"
		});
	fbVizObj.drawChart();
};



d3.json(filename, drawViz);