//js funcit/parse/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('funcit/parse/parse.html');
});