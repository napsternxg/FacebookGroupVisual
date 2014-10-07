var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var drawViz = function(error, data){
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

    var vdiff_post_comment = 100;
    var y = d3.scale.linear()
    	.range([height-vdiff_post_comment, 50])
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
    	.ticks(d3.time.tuesdays)
    	.tickFormat(formatTime)
    	.tickSize(-height)
    	.tickPadding(10);

    var xAxis1 = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.ticks(d3.time.thursdays)
    	.tickFormat(formatTime)
    	.tickSize(-height)
    	.tickPadding(10);

    var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("right")
    	.tickSize(width-margin.right)
    	.tickPadding(10);

    var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	    return "<div style='width:400px;'><strong style='color:red'>"+d.from.name+":</strong> <span>" + d.message + "</span>";
	  });


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

	svg.call(tip);

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

      svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll('text')
      .attr('class','date_tick');

      svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width-margin.right-5)
    .attr("y", height - 10)
    .text("Comments");

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width-margin.right-5)
    .attr("y", height-vdiff_post_comment - 10)
    .text("Posts");




	var posts = svg.selectAll('g.plots')
		.data(data)
		.enter().append('g')
		.classed('plots', true)
		.attr('id', function(d){ return d.id; })
		.on('mouseover', function(d){d3.select(this).classed('high', true); /*tip.show(d);*/})
		.on('mouseout', function(d){d3.select(this).classed('high', false); /*tip.hide(d);*/});
	//posts.call(tip);

	var post_y = 50;
	var comment_y = height;
	function postClass(d){
		var h = '';
		if(d['from']['id']== '728525023' || d['from']['id'] == "10154643193000024"){
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
		if(d['from']['id']== '728525023' || d['from']['id'] == "10154643193000024"){
			h = 'highlight ';
		}
		 return h+'status';
	}

	function showDebug(d){
		console.log(d);
		var debugDiv = d3.select('#debug');
		var likeText = '';
		if('like_size' in d){
			likeText = '('+d.like_size+') ';
		}else if('like_count' in d){
			likeText = '('+d.like_count+') ';
		}
		var commentList='';
		if('comments' in d){
			commentList = '<br /><ul>';
			for (var i = 0; i < d.comments_arr.length; i++) {
				commentList += '<li><p><strong>('+d.comments_arr[i].like_count+') '+d.comments_arr[i].from.name+': </strong>'+d.comments_arr[i].message+'</p></li>';
			};
			commentList+='</ul>';
		}
		
		
		debugDiv.html('<div class="debug post"><p><strong>'+likeText+d.from.name+':</strong>'+d.message+commentList+'</p></div>');
	}
	posts.append('circle') // Adds a dot per post
		.attr("data-legend",function(d){return "Post "+postClass(d)})
		.attr('cx',function(d){ return x(d.created_at);})
		.attr('cy',function(d){ return y(d.like_size);})
		.attr('r',function(d){ return postRadius(d.comments_size+1);})
		.attr('class', postClass)
		.classed('posts', true)
		.on('mouseover',tip.show)
		.on('mouseout',tip.hide)
		.on('click', showDebug /*function(d){ console.log(d); /*d3.select('#debug').text(JSON.stringify(d,undefined, 2));}*/)
		/*.append("svg:title")
   		.text(function(d) { return d.poster+": "+d.message; })*/;

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
		.on('mouseover',tip.show)
		.on('mouseout',tip.hide)
		.on('click', showDebug 	/*function(d){ console.log(d); d3.select('#debug').text(JSON.stringify(d,undefined, 2));}*/)
		/*.append("svg:title")
   		.text(function(d) { return d['from']['name']+": "+d['message']; })*/;
   		
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
    .attr("transform","translate("+(width+margin.right)+",30)")
    .style("font-size","12px")
    .call(d3.legend);

    console.log("Toggling buttons");
    $('#switchlines').trigger('click');
};



d3.json(filename, drawViz);