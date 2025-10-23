import express from "express";
import dotnenv from "dotenv";
import cors from "cors";
import path from "path";

import router from "./routes/notesRoutes.js";
import { connectToDb } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

const app = express();

//notes:

/*
dotenv pkg
process.exit
schema
model based out of that schema
middleware express.json()
rate limit
theme in daisy ui
*/
//an endpoint is a combination of the URL and HTTP method that lets the client interact
//with a specific resource

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

dotnenv.config();

//middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log("server running on PORT:", PORT);
  });
});
