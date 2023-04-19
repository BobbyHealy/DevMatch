export default async function (req, res) {
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };
  
      console.log(req.body);
      console.log(req.body.uid);
      console.log(req.body.report);
  
      fetch(
        `http://localhost:8080/postReport?uid=${req.body.uid}&report=${req.body.report}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "max-age=180000");
  
          res.end(JSON.stringify(JSON.parse(result)));
          resolve();
        })
  
        .catch((error) => {
          res.json(error);
          res.status(405).end();
          resolve(); // in case something goes wrong in the catch block (as vijay commented)
        });
    });
  }
  