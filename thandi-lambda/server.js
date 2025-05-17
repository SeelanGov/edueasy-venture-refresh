// server.js
// Express wrapper for Lambda handler for local testing
const express = require('express');
const bodyParser = require('body-parser');
const { handler } = require('./index');

const app = express();
app.use(bodyParser.json());

app.post('/thandi', async (req, res) => {
  const event = {
    headers: {
      authorization: req.headers.authorization,
    },
    body: JSON.stringify(req.body),
  };

  try {
    const result = await handler(event);
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    res.status(500).json({ error: 'SERVER_ERROR', message: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Thandi test server running on http://localhost:${PORT}/thandi`);
});
