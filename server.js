const http = require("http");
const { v4: uuidv4 } = require("uuid");
const headers = require("./httpHeaders");
const successHandler = require("./successHandler")
const errHandler = require("./errorHandler");
const todos = [];

const requestListener = (req, res) => {
	 let body = "";

	 req.on("data", (chunk) => {
		body += chunk;
	 });

	if (req.url === "/todos" && req.method === "GET") {
		successHandler(res, todos);
	} else if (req.url === "/todos" && req.method === "POST") {
		req.on("end", () => {
			try {
				const title = JSON.parse(body).title;
				if (title) {
					const todo = {
						"title": title,
						"id": uuidv4()
					}
					todos.push(todo);
		
					successHandler(res, todos);
				} else {
					errHandler(res);
				}
			} catch (err) {
				errHandler(res);
			}
		});
	} else if (req.url === "/todos" && req.method === "DELETE") {
		todos.length = 0;
		successHandler(res, todos);
	} else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
		const id = req.url.split("/").pop();
		const index = todos.findIndex(todo => todo.id === id);
		if (index >= 0) {
			todos.splice(index, 1);
			successHandler(res, todos);
		} else {
			errHandler(res);
		}
	} else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
		req.on("end", () => {
			try {
				const title = JSON.parse(body).title;
				const id = req.url.split("/").pop();
				const index = todos.findIndex(todo => todo.id === id);

				if (title && index >= 0) {
					todos[index].title = title;
					successHandler(res, todos);
				} else {
					errHandler(res);
				}
			} catch (err) {
				errHandler(res);
			}
		});
	} else if (req.method === "OPTIONS") {
		res.writeHead(200, headers);
		res.end();
	} else {
		res.writeHead(404, headers);
		res.write(JSON.stringify({
			"status": "false",
			"message": "Not found"
		}));
		res.end();
	}
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3001);
