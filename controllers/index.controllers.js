export const getHome = (_req, res) => {
	res.json({ message: "REST API funcionando" });
};

export const getMarco = (_req, res) => {
	res.json({ message: "Polo" });
};

export const getPing = (_req, res) => {
	res.json({ message: "pong" });
};
