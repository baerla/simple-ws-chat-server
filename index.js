const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/api", (req, res) => {
	res.json({
		message: "Hello world",
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
