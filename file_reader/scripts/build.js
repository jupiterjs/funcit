//steal/js funcit/file_reader/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/file_reader/scripts/build.html',{to: 'funcit/file_reader'});
});
