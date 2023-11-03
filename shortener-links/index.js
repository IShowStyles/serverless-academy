const express = require('express');
const {PrismaClient} = require('@prisma/client');
const {v4: uuidv4} = require('uuid');
const validUrl = require('valid-url');
const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.post('/shorten', async (req, res) => {
  const {url: urls} = req.body;
  if (validUrl.isUri(urls)) {
    let url = await prisma.url.findUnique({
      where: {
        originalUrl: urls,
      },
    });
    if (!url) {
      const shortUrlId = uuidv4();
      url = await prisma.url.create({
        data: {originalUrl: urls, shortUrl: shortUrlId},
      });
    }
    res.send({originalUrl: url.originalUrl, shortUrl: url.shortUrl});
  } else {
    res.status(400).send({error: 'Invalid URL'});
  }
});

app.get('/:shortUrl', async (req, res) => {
  const {shortUrl} = req.params;
  const url = await prisma.url.findUnique({
    where: {shortUrl},
  });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send({error: 'URL not found'});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
