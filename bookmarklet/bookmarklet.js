(function(){
	var newWin = window.open("", "blank");
	var html = [
	"<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN'",
    "        'http://www.w3.org/TR/html4/strict.dtd'>",
	"<html lang='en'>",
	"<head>",
	"<title>",
	document.title,
	"</title>",
	"</head>",
	"<body>",
	"	<script language='javascript' type='text/javascript'>",
	"		Funcit = {url: location.pathname};",
	"	</script>",
	"	<script language='javascript' type='text/javascript'", 
	"		src='/steal/steal.js?funcit,production'>",
	"	</script>",
	"</body>",
	"</html>"
	];
  newWin.document.write(html.join(''));
	newWin.document.close();
})()