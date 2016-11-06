var fs = require('fs');
var path = require('path');
var markedMand = require('marked-man');

var markdown = fs.readFileSync(path.join(__dirname, "doc.md"), 'utf8');

var roff = markedMand(markdown);



