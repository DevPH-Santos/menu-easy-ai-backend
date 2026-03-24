const jwt = require("jsonwebtoken");

function verificarAdmin(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SEGREDO_SUPER_FORTE");

    if (!decoded.admin) {
      return res.sendStatus(403);
    }

    req.usuario = decoded;
    next();
  } catch {
    return res.sendStatus(401);
  }
}

module.exports = { verificarAdmin };