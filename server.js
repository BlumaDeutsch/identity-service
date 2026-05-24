const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('השרת עובד בהצלחה!');
});

app.use("/api", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});