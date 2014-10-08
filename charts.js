var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 450, right: 10, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var fObj = null;
var uids = ["10154643193000024","728525023"];
var drawViz = function(error, data){
	if (error) return console.warn(error);
	var fbVizObj = new fbViz();
	fbVizObj.init(data, {
			margin: margin,
			width: width,
			height: height,
			divId: "#graphs"
		},
		{
			margin: margin2,
			height: height2
		}, uids);
	fbVizObj.drawChart();
	fObj = fbVizObj;
};

d3.json(filename, drawViz);