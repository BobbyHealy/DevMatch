export default async function (req, res) {
  return new Promise((resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(req.body);
    console.log(req.body);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8080/searchFilter", requestOptions)
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
