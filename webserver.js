const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");
const https = require("https");

let key = null;
let cert = null;

if (fs.existsSync("./privkey.pem") && fs.existsSync("./cert.pem")) {
	key = fs.readFileSync("./privkey.pem");
	cert = fs.readFileSync("./cert.pem");
}

app.get("/", (req, res) => {
	res.sendFile("/index.html", { root: __dirname });
});

if (key && cert) {
	const server = https.createServer({ key: key, cert: cert }, app);

	server.listen(443, () => {
		console.log(`Example app listening on port ${port}`);
	});
} else {
	console.log("No key or cert found, running insecured server.");

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
}

app.use(express.static("public"));
