"use strict";

const cds = require("@sap/cds");
const cov2ap = require("../../../src");
const compression = require("compression");

const init = require("./init");

cds.on("bootstrap", (app) => {
  app.use(compression({ filter: shouldCompress }));
  app.use(cov2ap({ target: "auto" }));
});

cds.on("listening", ({ server }) => {
  global._init = init({
    app: cds.app,
    port: server.address().port,
  });
});

function shouldCompress(req, res) {
  const type = res.getHeader("Content-Type");
  if (type && typeof type === "string" && type.startsWith("multipart/mixed")) {
    return true;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

module.exports = cds.server;
