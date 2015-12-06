var tinify = require("tinify");
var fs = require('fs');
var path = require('path');

var EXTs = ['.jpg', '.jpeg', '.png'];

tinify.key = "TUJ_VjBj0v6GmS-TZzS9TlESRUmPhg60";

var main = function () {
	var args = process.argv.slice(2);

	if (!(args[0] && fs.statSync(args[0]).isDirectory())) {
		throw new Error('参数错误.\n您应该传入一个目录参数.');
	}

	if (args[1] === 'clear') {
		clear(args[0]);
	} else {
		compress(args[0]);
	}
};

var compress = function (dir) {
	fs.readdirSync(dir).forEach(function (file) {
		var pathname = path.join(dir, file);
		var stat = fs.statSync(pathname);

		if (stat.isDirectory()) {
			compress(pathname);
		} else {
			var format = path.parse(pathname);
			if (EXTs.indexOf(format.ext) >= 0) {
				if (format.name.lastIndexOf('_tiny') === format.name.length - 5) {
					return;
				}
				format.base = format.name + '_tiny' + format.ext;
				var source = tinify.fromFile(pathname);
				source.toFile(path.format(format), tinifyErrorHandler.bind(undefined, pathname));
				
			} else {
				return;
			}
		}
	});	
};

var clear = function (dir) {
	fs.readdirSync(dir).forEach(function (file) {
		var pathname = path.join(dir, file);
		var stat = fs.statSync(pathname);

		if (stat.isDirectory()) {
			clear(pathname);
		} else {
			var format = path.parse(pathname);
			if (EXTs.indexOf(format.ext) >= 0 && format.name.lastIndexOf('_tiny') === format.name.length - 5) {
				fs.unlink(pathname);
			} else {
				return;
			}
		}
	});
};

var tinifyErrorHandler = function (pathname, err) {
	/*
	if (err instanceof tinify.AccountError) {
    console.log("The error message is: " + err.message);
    // Verify your API key and account limit.
  } else if (err instanceof tinify.ClientError) {
    // Check your source image and request options.
  } else if (err instanceof tinify.ServerError) {
    // Temporary issue with the Tinify API.
  } else if (err instanceof tinify.ConnectionError) {
    // A network connection error occurred.
  } else {
    // Something else went wrong, unrelated to the Tinify API.
  }
	*/
	console.log(pathname);

	if (err) {
		console.error(err);
	} else {
		console.log('Compressed successfully');
	}
};

main();
