steal.plugins('funcunit/qunit','funcit/record').then(function(){
	
module('funcit/record',{
	setup : function(){
		// add iframe
		stop()
		$('#qunit-test-area').append(
			$('<iframe/>').bind('load', function(){
				start();
			}).attr('src', steal.root.join('funcit/record/iframe.html'))
		)
	}
});


var play = function(){
	return $( $('#qunit-test-area iframe')[0].contentWindow.document.documentElement).find('#play')
}

test("changing display:block", function(){
	//stop(1000);
	var calls = [];
	$('#qunit-test-area iframe').funcit_record(function(ev){
		calls.push(ev);
	})
	play().attr("style","display:block; color:red")
		.attr("style","display:block; color:blue")
	
	equals(calls.length, 0);
	
});
	
})
