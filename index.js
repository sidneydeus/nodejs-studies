const express = require("express");

const server = express();

server.use(express.json());

let totalreq = 0;
//middleware global
server.use((req, res, next) => {
  console.log("Requisições: " + totalreq++);
  return next();
});

const projects = [];

function checkProjectFields(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }
  return next();
}

function checkProjectExists(req, res, next) {
  const idx = projects.findIndex(p => p.id == req.params.id);
  if (idx >= 0) {
    req.params.idx = idx;
  } else {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const project = req.body;
  projects.push(project);
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { idx } = req.params;
  projects.splice(idx, 1);
  return res.send();
});

server.put(
  "/projects/:id",
  checkProjectFields,
  checkProjectExists,
  (req, res) => {
    const { idx } = req.params;
    const { title } = req.body;

    projects[idx].title = title;

    return res.json(projects);
  }
);

server.post(
  "/projects/:id/tasks",
  checkProjectFields,
  checkProjectExists,
  (req, res) => {
    const { idx } = req.params;
    const { title } = req.body;
    projects[idx].tasks.push(title);
    return res.json(projects);
  }
);

server.listen(3001);
