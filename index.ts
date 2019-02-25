interface State {
  db: null | string;
}
interface toDo {
  id: string;
  toDo: string;
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
const PORT: number = 3000;
const db = require('./db');

const collection: string = 'todo';

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getTodos', (req: Request, res: Response) => {
  db.getDb()
    .collection(collection)
    .find({})
    .toArray((err: Error, documents: object[]) => {
      if (err) {
        console.error(err);
        return err;
      } else {
        res.json(documents);
      }
    });
});

app.put('/:id', (req: Request, res: Response) => {
  const todoID: string = req.params.id;
  const userInput = req.body;
  db.getDb()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput } },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          res.json(result);
          return result;
        }
      }
    );
});

app.post('/', (req, res) => {
  const userInput = req.body;
  db.getDb()
    .collection(collection)
    .insertOne(userInput, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ result, document: result.ops[0] });
      }
    });
});

app.delete('/:id', (req, res) => {
  const toDoID = req.params.id;
  db.getDb()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(toDoID) }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.json(result);
      }
    });
});

db.connect((err: Error) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    app.listen(PORT, () => {
      console.log(`connected to the database on Port ${PORT}`);
    });
  }
});
