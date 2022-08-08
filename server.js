const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const { MongoClient } = require("mongodb");

// ---------- dummy data ----------

// const articleInfo = {
//   "learn-react": {
//     comments: [],
//   },

//   "learn-node": {
//     comments: [],
//   },
//   "learn-mongo": {
//     comments: [],
//   },
// };
// ---------- dummy data ----------

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("mernblog"); //DB name
    await operations(db);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
};

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db
      .collection("article")
      .findOne({ name: articleName }); //collectionName
    res.status(200).json(articleInfo);
  }, res);
});

// Initialize Middleware
// an express function to parse incoming JSON payload
app.use(express.json({ extended: false }));

// -------------- TEST ROUTRS -------------- //
// app.get("/", (req, res) => res.send("hello friend"));
// app.post("/", (req, res) => res.send(`Hello i am ${req.body.name}`));
// app.get("/hello/:name", (req, res) => res.send(`Hey there ${req.body.name}`));
// -------------- TEST ROUTRS -------------- //

// ----- ROUTE to get data from DB -----
app.get("/api/articles/:name", async (req, res) => {
  //   try {
  const articleName = req.params.name;
  //   const client = await MongoClient.connect("mongodb://localhost:27017");
  //   const db = client.db("mernblog"); //DB name
  const articleInfo = await db
    .collection("article")
    .findOne({ name: articleName }); //collectionName
  res.status(200).json(articleInfo);
  // client.close();
  //   } catch (error) {
  //     res.status(500).json({ message: "Error connecting to database", error });
  //   }
});

app.post("/api/articles/:name/add-comments", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;
  //   articleInfo[articleName].comments.push({ username, text });
  //   res.status(200).send(articleInfo[articleName]);

  withDB(async (db) => {
    const articleInfo = await db
      .collection("article")
      .findOne({ name: articleName });
    await db.collection("article").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text }),
        },
      }
    );
    const updateArticleInfo = await db
      .collection("article")
      .findOne({ name: articleName });
    res.status(200).json(updateArticleInfo);
  });
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

// app.listen(PORT);
