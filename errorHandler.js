const headers = require("./httpHeaders");

const errorHandle = (res) => {
	res.writeHead(400, headers);
	res.write(JSON.stringify({
		"status": "false",
		"message": "invalid json input or invalid id",
	}));
	res.end();
}

module.exports = errorHandle;
