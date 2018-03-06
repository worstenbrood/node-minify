/**
    Minify javascript/CSS using UglifyJS/UglifyCSS
    @see https://github.com/mishoo/UglifyJS2
    @see https://github.com/fmarcia/UglifyCSS
*/

var UglifyJS = require("uglify-js");
var UglifyCSS = require("uglifycss");
var fs = require("fs");
var path = require("path");
var minimist = require("minimist");

function enumerateFiles(directory, regex, recursive, exceptions, total) {
    total = total || [];
    var result = fs.readdirSync(directory, "utf8");
    result.forEach(element => {
        var fullPath = path.join(directory, element);
        var stats = fs.statSync(fullPath);
        if (!exceptions || !element.match(exceptions)) {
            if (stats.isDirectory() && recursive) {
                enumerateFiles(fullPath, regex, recursive, exceptions, total);
            } else if (stats.isFile()) {
                if (!regex || element.match(regex)) {
                    total.push(fullPath);
                }
            }
        }
    });

    return total;
}

function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
      rv[arr[i]] = fs.readFileSync(arr[i], "utf8");
    return rv;
  }

function processJSFiles(directory, outFile, exceptions) {

    var files = enumerateFiles(directory, ".*\.js", true, exceptions);
    var result = UglifyJS.minify(toObject(files), {
        compress: {
            hoist_funs: false
        }, 
        mangle: {
            reserved: ["$","require","exports"],
            keep_fnames: true
        },
		warnings: true
    });

    if (result.warnings) {
        result.warnings.forEach(function(w) {
            process.stdout.write(w);
            process.stdout.write("\n");
        })
    }
	
	if (result.error) {
        process.stderr.write(JSON.stringify(result.error, null, 1));
        process.exit(-1);
	}
	
    fs.writeFileSync(outFile, result.code);
}

function processJS(inFile, outFile) {
    var result = UglifyJS.minify(fs.readFileSync(inFile, "utf8"), {
        compress: {
            hoist_funs: false
        }, 
        mangle: false,
		/*
        {
            reserved: ["$","require","exports"],
            keep_fnames: true
        },*/
		warnings: true
    });

    if (result.warnings) {
        result.warnings.forEach(function(w) {
            process.stdout.write(w);
            process.stdout.write("\n");
        })
    }
	
	if (result.error) {
        process.stderr.write(JSON.stringify(result.error, null, 1));
        process.exit(-1);
	}
	
    fs.writeFileSync(outFile, result.code);
}

function processCSS(inFile, outFile) {
    var uglified = UglifyCSS.processFiles([inFile]);
    fs.writeFileSync(outFile, uglified);
}

var argv = minimist(process.argv.slice(2));

if (argv["_"].length < 2)
{
    process.stderr.write("Usage: " + path.basename(process.argv[1]) + " infile outfile\n");
    process.stderr.write("Usage: " + path.basename(process.argv[1]) + " path outfile -d [-e exceptions]\n");
    process.exit(-1);
}

if (argv["d"])
{
    var exceptions = argv["e"]; // (ckeditor|NewUI|pivottable)
    processJSFiles(argv["_"][0], argv["_"][1], exceptions);
    process.exit(0);
}
else
{
    var inFile = argv["_"][0];
    var outFile = argv["_"][1];
    var extension = path.extname(inFile).toLowerCase();

    switch(extension)
    {
        case ".js":
            processJS(inFile, outFile);
            break;

        case ".css":
            processCSS(inFile, outFile);
            break;

        default:
            process.stderr.write("Invalid extension: " + extension + "\n");
            process.exit(-1);
            break;
    }
}
