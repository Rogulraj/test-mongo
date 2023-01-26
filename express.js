const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, Timestamp } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const history = require("connect-history-api-fallback");

const app = express();

const port = process.env.PORT || 3030;

const client = new MongoClient(process.env.MONGO_URL);

const dbName = "test";
const collectionName = "users";

const userCollection = client.db(dbName).collection(collectionName);

const connectDB = async () => {
  try {
    await client
      .connect()
      .then(() => {
        console.log("Mongo connected successfully");
      })
      .catch((e) => {
        console.log(`Mongo connection error ${e}`);
      });

    app.listen(port, () => {
      console.log(`Server at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());

const staticFileMiddleware = express.static(
  path.resolve(__dirname, "./client/build")
);
app.use(staticFileMiddleware);
app.use(
  history({
    disableDotRule: true,
    verbose: true,
  })
);

app.post("/api/post", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (username === undefined && password === undefined) {
    res.status(400).send({ failed: `Username and Password didn't provide` });
  }
  try {
    const bcryptedPassword = await bcrypt.hash(password, 10);
    const userDetails = {
      username,
      password: bcryptedPassword,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
    };
    const result = await userCollection.insertOne(userDetails);
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send({ e });
  }
});

app.get("/api/get", async (req, res) => {
  try {
    const getAll = await userCollection.find().toArray();
    console.log(getAll);
    res.status(200).send({ getAll });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

app.put("/api/put", async (req, res) => {
  const { username, updateName } = req.body;
  console.log(username);
  if (username === undefined) {
    res.status(400).send({ failed: `Username and Password didn't provide` });
  }
  try {
    const userData = await userCollection.findOne({
      username,
    });
    if (userData !== undefined) {
      const userId = userData._id;
      const updateMethod = await userCollection.updateOne(
        { username },
        { $set: { username: updateName } }
      );
      console.log(userId);
      console.log(updateMethod.modifiedCount);
      res.status(200).json({ updateMethod });
    } else {
      res.status(200).send({ failed: "user not exist in the DB" });
    }
  } catch (e) {
    res.status(400).send({ e });
  }
});
