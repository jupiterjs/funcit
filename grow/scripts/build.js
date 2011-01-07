//steal/js funcit/grow/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/grow/scripts/build.html',{to: 'funcit/grow'});
});
