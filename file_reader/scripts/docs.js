//js funcit/file_reader/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('funcit/file_reader/file_reader.html');
});