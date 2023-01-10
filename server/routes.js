const express = require('express');
const app = express();
const { Links } = require('./models/LinksSchema');
const { v4: uuidv4 } = require('uuid');

const baseUrl = 'http://localhost:3001';

// Create shorten url
app.post('/shorten_url', async (request, response) => {
  const long_url = request.body.long_url;

  // Validate inputs
  if (!long_url) {
    res.status(400).json({
      status: '!OK',
      message: 'Something went wrong',
    });
    return;
  }

  if (long_url === '' || typeof long_url !== 'string') {
    response.status(400).json({
      error: 'Input cannot be empty',
    });
    alert('Input cannot be empty');
    return;
  }

  // CHECK it
  if (!long_url.startsWith('http')) {
    long_url = 'http://' + long_url; // ??
  }

  try {
    // Create record
    const result = await Links({
      long_url,
      _id: uuidv4(),
    });

    // Respond to client
    response.status(200).json({
      long_url: result.long_url,
      id: result._id,
      url: `${baseUrl}/r/${result._id}`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// Show all links shorten and long urls
app.get('/links', async (request, response) => {
  const links = await Links.find();

  response.status(200).json({
    result: links.map((link) => ({ ...link, short_url: `${baseUrl}/r/${link._id}` })),
  });
});

// Clear all shorten and long urls
app.delete('/clear', async (_request, response) => {
  await Links.deleteMany();

  response.status(200).send();
  console.log('Deleted all links');
});

// Clear by id both shorten and long url NEEDS TO BE FIXED
app.delete('/clear/:id', async (request, response) => {
  const id = request.params.id;

  if (!id) {
    res.status(404);
    return;
  }

  await Links.deleteOne({ _id: id });

  response.status(200).send();
  console.log('Deleted id: ', id);
});

module.exports = app;
