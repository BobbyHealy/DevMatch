// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  var http = require("follow-redirects").http;
  var fs = require("fs");

  var options = {
    method: "POST",
    hostname: "localhost",
    port: 8080,
    path: "/addUser",
    headers: {
      "Content-Type": "application/json",
    },
    maxRedirects: 20,
  };
  const reqBody = req.body;
  // console.log(reqBody);
  var req = http.request(options, function (res1) {
    var chunks = [];

    res1.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res1.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      res.status(201).json(JSON.parse(body.toString()));
    });

    res1.on("error", function (error) {
      console.error(error);
      res.status(400).json(JSON.parse(body.toString()));
    });
  });

  var postData = JSON.stringify(reqBody);

  req.write(postData);

  req.end();
}
