import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const __dirname = import.meta.dirname;

const app = express();
const port = 3000;

app.use(cors());

app.get("/api/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/:mockName", (req: Request, res: Response) => {
  const mockName = req.params["mockName"];
  const mockFile = path.resolve(__dirname, `./routes/${mockName}.json`);

  fs.readFile(mockFile, "utf8", (err, data) => {
    if (err) {
      console.error(`${mockFile} not found`);
      res.status(404).send("Not found");
    } else {
      console.log(`--- Responds with: ${mockName}.json`);
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
