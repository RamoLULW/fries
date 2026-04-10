const getHome = (_req, res) => {
	res.send("hello world");
};

const getFries = (_req, res) => {
	res.send("Give me a large fries and coke");
};

module.exports = {
	getHome,
	getFries,
};
