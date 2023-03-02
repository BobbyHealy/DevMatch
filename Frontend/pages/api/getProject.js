// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  var http = require("follow-redirects").http;
  var fs = require("fs");

  var options = {
    method: "GET",
    hostname: "localhost",
    port: 8080,
    path: `/projects?pid=${req.body.pid}`,
    headers: {},
    maxRedirects: 20,
  };

  var req = http.request(options, function (fres) {
    var chunks = [];

    fres.on("data", function (chunk) {
      chunks.push(chunk);
    });

    fres.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      res.status(200).json(JSON.parse(body.toString()));
    });

    fres.on("error", function (error) {
      res.status(400).json(JSON.parse(body.toString()));
    });
  });

  req.end();
}
