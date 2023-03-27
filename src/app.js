const express = require("express");
const app = express();
const port = 3000;
const API_URL = "https://api.pastebin.fi";

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus dui hac nostra mattis aptent lorem. Auctor nec nullam justo purus aptent placerat sociosqu.\n\nHendrerit odio adipiscing nam magna maecenas purus varius. Dictumst torquent venenatis non conubia aenean commodo eu. Ante in condimentum conubia arcu diam blandit fusce.\n\nLaoreet venenatis porta cubilia elit mus molestie potenti. Consectetur curabitur molestie eget fermentum consectetur amet fermentum. Lorem blandit proin proin odio nostra nisl eleifend.`;

app.use("/static", express.static("static")); // css & js files
app.use(express.static("public")); // robots.txt & .well-known

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", { 
    lorem,
    head: {
      title: "Etusivu - Pastebin.fi",
      description: "Lähetä tekstiliitteesi tänne.",
      url: "https://pastebin.fi"
    }
  });
});

app.post("/", async (req, res) => {
  console.log(req.body.private);
  const pasteReq = await fetch(`${API_URL}/pastes`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: req.body.title,
      paste: req.body.paste,
      private: req.body.private === "on" ? true : false,
    }),
  });
  const pasteJson = await pasteReq.json();
  let id;
  if (pasteReq.status === 409) id = pasteJson.data[0].pasteIdentifier;
  else id = pasteJson.id;
  res.redirect(`/p/${id}`);
});

app.get("/about", async (req, res) => {
  const metricsReq = await fetch(`${API_URL}/metrics`);
  const metricsJson = await metricsReq.json();
  res.render("about", { 
    metrics: metricsJson,
    head: {
      title: "Tietoa - Pastebin.fi",
      description: "Mikä ihmeen pastebin.fi...",
      url: "https://pastebin.fi/about"
    }
  });
});

app.get("/browse", async (req, res) => {
  let sorting = req.params.sorting == undefined ? "" : req.params.sorting;
  let q = req.params.q == undefined ? "" : req.params.q;
  const browseReq = await fetch(
    `${API_URL}/pastes?` +
      new URLSearchParams({
        sorting: "-date",
        q,
      })
  );
  const browseJson = await browseReq.json();
  if (browseReq.status != 200)
    res.render("404", { message: browseJson.message });
  res.render("browse", { 
    pastes: browseJson,
    head: {
      title: "Selaa - Pastebin.fi",
      description: "Kymmenen viimeisintä tekstiliitettä!",
      url: "https://pastebin.fi/browse"
    }
  });
});

app.get("/p/:id", async (req, res) => {
  const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`);
  const pasteJson = await pasteReq.json();
  if (pasteReq.status != 200) res.render("404", { message: pasteJson.message });
  res.render("paste", { 
    paste: pasteJson,
    head: {
      title: `${pasteJson.title} - Pastebin.fi`,
      description: `${pasteJson.meta.views} katselukertaa | ${pasteJson.meta.size} tavua | ${pasteJson.date}`,
      url: "https://pastebin.fi/p/" + req.params.id
    }
  });
});

app.get("/r/:id", async (req, res) => {
  const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`);
  const pasteJson = await pasteReq.json();
  if (pasteReq.status != 200)
    return res.type("text").status(404).send("not found");
  return res.type("text").send(pasteJson.content);
});

app.get("/dl/:id", async (req, res) => {
  const pasteReq = await fetch(`${API_URL}/pastes/${req.params.id}`);
  const pasteJson = await pasteReq.json();
  if (pasteReq.status != 200)
    return res.type("text").status(404).send("not found");
  return res.attachment(`${pasteJson.title}.txt`).send(pasteJson.content);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
