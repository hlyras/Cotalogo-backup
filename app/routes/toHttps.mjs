function toHttps(req, res, next) {
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
  } else {
    next();
  }
};

export default toHttps;