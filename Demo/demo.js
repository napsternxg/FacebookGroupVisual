var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var url = '/gh/get/response.json/napsternxg/FacebookGroupVisual/tree/master/Demo/';

var json_data = d3.json(url)
    .header("X-Requested-With", "XMLHttpRequest")
    .header("Access-Control-Allow-Origin", "*")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post(function (error, request) {
        console.log(request);
    if (error) return console.warn(error);
    var data = request;
    console.log(data);
	data.forEach(function(d){
		d.poster = d['from']['name'];
		d.comments_size = 0;
		d.comments_arr = [];
		d.like_size = 0;
		if(('comments' in d) && ('data' in d['comments'])){
			d.comments_arr = d['comments']['data'];
			d.comments_size = d.comments_arr.length;
		}
		if(('likes' in d) && ('data' in d['likes'])){
			d.like_size = d['likes']['data'].length;
		}
		d.created_at = new Date(d['created_time']);
	});
	
	function created_at(d){ return d.created_at; }
	
	var x = d3.time.scale()
    .range([margin.left, width-margin.right])
    .domain(d3.extent(data,created_at));

    var y = d3.scale.linear()
    	.range([height-100, 50])
    	.domain(d3.extent(data, function(d) { return d.like_size; }))


    var formatTime = d3.time.format('%d/%m');

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(formatTime);


    /*console.log(x.domain());
    console.log(x.range());
    console.log(x.ticks());*/

    /*var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<span style='color:red'>" + d.name + "</span>";
	});*/
	console.log(data);
	var svg = d3.select('#graphs')
		.append('svg');

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


	var posts = svg.selectAll('g.plots')
		.data(data)
		.enter().append('g')
		.classed('plots', true)
		.attr('id', function(d){ return d.id; })
		.on('mouseover', function(d){d3.select(this).classed('high', true); })
		.on('mouseout', function(d){d3.select(this).classed('high', false); });
	//posts.call(tip);

	var post_y = 50;
	var comment_y = height;
	function postColor(d){
		if(d['from']['id']== '728525023'){
			return '#D3DB00';
		}if(d['type'] != 'status'){
			return '#22dd11';
		}else if(d['type']=='status'){
		 return '#dd2211';
		}
	}
	posts.append('circle') // Adds a dot per post
		.attr('cx',function(d){ return x(d.created_at);})
		.attr('cy',function(d){ return y(d.like_size);})
		.attr('r',function(d){ return 2*d.comments_size+4;})
		.attr('fill', postColor)
		.classed('posts', true)
		.on('click', function(d){ console.log(d); d3.select('#debug').text(JSON.stringify(d,undefined, 2));})
		.append("svg:title")
   		.text(function(d) { return d.poster+": "+d.message; });

	console.log("Posts", posts);

	posts.selectAll('circle.comment') // Adds a dot per comment
		.data(function(d){return d.comments_arr;})
		.enter()
		.append('circle')
		.attr('cx', function(d){ return x(new Date(d['created_time']));})
		.attr('cy', comment_y)
		.attr('r', function(d){ if('like_count' in d){return 2*d['like_count']+5;}else{return 5;}})
		.attr('fill', function(d){ if(d['from']['id']== '728525023'){return '#D3DB00';}else{return '#22aaff';}})
		.classed('comment', true)
		.on('click', function(d){ console.log(d); d3.select('#debug').text(JSON.stringify(d,undefined, 2));})
		.append("svg:title")
   		.text(function(d) { return d['from']['name']+": "+d['message']; })
   		
   	function genLinks(d){
   		var links = [];
		for (var j = 0; j < d.comments_arr.length; j++){
			var t = Object();
			t.source = {x: x(new Date(d['created_time'])), y: y(d.like_size)};
			t.target = {x: x(new Date(d.comments_arr[j]['created_time'])), y: comment_y};
			links.push(t);
		};
		return links;


   	}
    posts.selectAll('line.edge')
		.data(function(d){return genLinks(d);})
		.enter()
    	.append('line')
    	.classed('edge', true)
    	.attr('x1', function(d){return d.source.x;})
    	.attr('y1', function(d){return d.source.y;})
    	.attr('x2', function(d){return d.target.x;})
    	.attr('y2', function(d){return d.target.y;});


});