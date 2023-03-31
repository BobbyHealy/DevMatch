//not used right now, need to figure out updating the progress field when dragging and dropping tasks
export default async function (req, res) {
    return new Promise((resolve, reject) => {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      const task = req.body.task
      fetch(
        `http://localhost:8080/updateSingleTask?pid=${req.body.pid}&task=${task.progress},${task.id},${task.category},${task.title},${task.assignees}`,
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