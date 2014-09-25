$(document).ready(function(){
    $('#switchlines').click(function(){
    	var opacity = 1;
    	var state = $($('.axis line')[0]).attr('class');
    	if(state !== 'down'){
    		state = 'down';
    		opacity = 'display: none;';
    	}else{
    		state = '';
    		opacity = '';
    	}
        $('.axis line').attr("class", state);
        $('g.tick').attr("style",opacity);
        console.log("Switch toggled");
    });
     $('#switchhighlight').click(function(){
     	$('.plots > .posts, .comment').each(function(i){
     		var state = $(this).attr('class').split(' ');
     		//console.log(state);
	    	if(state[0] === 'nohighlight'){
	    		state[0] = 'highlight'
	    		state = state.join(' ');
	    		$(this).attr("class", state);
	    	}else if(state[0] === 'highlight'){
	    		state[0] = 'nohighlight';
	    		state = state.join(' ');
	    		$(this).attr("class", state);
	    	}
	        
     	});
    	
        console.log("Switch toggled");
    });
});