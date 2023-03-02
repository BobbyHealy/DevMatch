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

  var req = http.request(options, function (fres) {
    var chunks = [];

    fres.on("data", function (chunk) {
      chunks.push(chunk);
    });

    fres.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      // console.log(body.toString());
      res.status(200).json(JSON.parse(body.toString()));
    });

    fres.on("error", function (error) {
      // console.error(error);
      res.status(200).json(error);
    });
  });

  var postData = JSON.stringify({
    userId: "1069",
    name: "name",
    skills: [""],
  });

  req.write(postData);

  req.end();
}
