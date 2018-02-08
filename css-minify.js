/**
    Minify css code using UglifyCSS
    @see https://github.com/mishoo/UglifyJS2
*/

var uglifycss = require('uglifycss');
var fs = require("fs");

var uglified = uglifycss.processFiles([process.argv[2]]);
fs.writeFileSync(process.argv[3], uglified);