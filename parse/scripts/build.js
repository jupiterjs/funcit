//steal/js funcit/parse/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/parse/scripts/build.html',{to: 'funcit/parse'});
});
