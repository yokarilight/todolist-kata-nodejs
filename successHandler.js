const headers = require("./httpHeaders");

const successHandler = (res, todos) => {
	res.writeHead(200, headers);
	res.write(JSON.stringify({
		"status": "success",
		"data": todos,
	}));
	res.end();
}

module.exports = successHandler;