const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/index');
const bodyParser = require('body-parser');
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api', apiRouter)
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
