var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var temp = 0; 

var json_data = d3.json('data.json', function(error, data){
	if (error) return console.warn(error);
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
	function c_link_size(d){
    	if('like_count' in d){
    		return d['like_count'];
    	}
    	return 0;    	
    }
	
	var x = d3.time.scale()
    .range([margin.left, width-margin.right])
    .domain(d3.extent(data,created_at));

    var y = d3.scale.linear()
    	.range([height-100, 50])
    	.domain(d3.extent(data, function(d) { return d.like_size; }))

    var postRadius = d3.scale.linear()
    	.range([5,20])
    	.domain(d3.extent(data, function(d) { return d.comments_size; }));

    var commentRadius = d3.scale.linear()
    	.range([3,10])
    	.domain(d3.extent(data, function(d){return d3.max(d.comments_arr, function(t){return c_link_size(t);})}));

    console.log(commentRadius.domain());

    


    var formatTime = d3.time.format('%m/%d/%Y');

    var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.ticks(d3.time.tuesdays, 1)
    	.tickFormat(formatTime)
    	.tickSize(-height)
    	.tickPadding(10)
    	;

    var xAxis1 = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.ticks(d3.time.thursdays, 1)
    	.tickFormat(formatTime)
    	.tickSize(-height)
    	.tickPadding(10)
    	;


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

	var formatDay = d3.time.format('%a');
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll('text')
      .style("text-anchor", "end")
	   .attr("dx", "-10px")
       .attr("dy", "0")
       .attr("class", function(d){
       		console.log(d);
       		return "date_tick "+formatDay(d);
       })
      .attr("transform", function(d) {
			return "rotate(-90)" 
       });

      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis1)
      .selectAll('text')
      .style("text-anchor", "end")
	   .attr("dx", "-10px")
       .attr("dy", "0")
       .attr("class", function(d){
       		console.log(d);
       		return "date_tick "+formatDay(d);
       })
      .attr("transform", function(d) {
			return "rotate(-90)" 
       });



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
	function postClass(d){
		var h = '';
		if(d['from']['id']== '728525023'){
			h = 'highlight ';
		}
		if(d['type'] != 'status'){
			return h+'others';
		}else if(d['type']=='status'){
		 return h+'status';
		}
	}

	function commentClass(d){
		var h = ''
		if(d['from']['id']== '728525023'){
			h = 'highlight ';
		}
		 return h+'status';
	}
	posts.append('circle') // Adds a dot per post
		.attr("data-legend",function(d){return "Post "+postClass(d)})
		.attr('cx',function(d){ return x(d.created_at);})
		.attr('cy',function(d){ return y(d.like_size);})
		.attr('r',function(d){ return postRadius(d.comments_size+1);})
		.attr('class', postClass)
		.classed('posts', true)
		.on('click', function(d){ console.log(d); d3.select('#debug').text(JSON.stringify(d,undefined, 2));})
		.append("svg:title")
   		.text(function(d) { return d.poster+": "+d.message; });

	console.log("Posts", posts);

	posts.selectAll('circle.comment') // Adds a dot per comment
		.data(function(d){return d.comments_arr;})
		.enter()
		.append('circle')
		.attr("data-legend",function(d){return "Comment "+commentClass(d)})
		.attr('cx', function(d){ return x(new Date(d['created_time']));})
		.attr('cy', comment_y)
		.attr('r', function(d){ return commentRadius(c_link_size(d)); })
		.attr('class', commentClass)
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

    legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate("+width+",30)")
    .style("font-size","12px")
    .call(d3.legend);

    temp = data;

});