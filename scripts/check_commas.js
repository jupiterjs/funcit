//steal/js funcit/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	var opener = steal.build.open('funcit/scripts/build.html', function(scripts){
		/*var p = print;
		print = function(string){
			p.apply(null, [">>" + string])
		}*/
		scripts.each(function(stl, content){
			if((/,\s*}/g).test(content)){
				steal.print(stl.originalPath)
			}
		})
	});
});