const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const app = express();
const port = 3000;

const prisma = new PrismaClient();

app.use(bodyParser.json());
app.put('/:jsonPath', async (req, res) => {
  const jsonPath = req.params.jsonPath;
  const jsonDocument = req.body;

  try {
    const document = await prisma.jsonDocument.upsert({
      where: { path: jsonPath },
      update: { data: jsonDocument },
      create: { path: jsonPath, data: jsonDocument },
    });

    res.status(200).send({ message: 'JSON stored successfully.', document });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
app.get('/:jsonPath', async (req, res) => {
  const jsonPath = req.params.jsonPath;

  try {
    const document = await prisma.jsonDocument.findUnique({
      where: { path: jsonPath },
    });

    if (document) {
      res.status(200).json(document.data);
    } else {
      res.status(404).send({ error: 'JSON not found.' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
