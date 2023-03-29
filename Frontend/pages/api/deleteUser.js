export default async function (req, res) {
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
  
      fetch(`http://localhost:8080/removeUser?uid=${req.body.userID}`, requestOptions)
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
          resolve();
        });
    });
  }
  