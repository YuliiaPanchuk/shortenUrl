const express = require('express');
const app = express();
const { Links } = require('./models/LinksSchema');
const { v4: uuidv4 } = require('uuid');

const baseUrl = 'http://localhost:3001';

// Create shorten url
app.post('/shorten_url', async (request, response) => {
  let long_url = request.body.long_url;

  // Validate inputs
  if (!long_url) {
    response.status(400).json({
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

  try {
    // Create record
    const result = await Links({
      long_url,
      _id: uuidv4(),
    });

    // Respond to client
    response.status(200).json({
      long_url: long_url,
      id: result._id,
      url: `${baseUrl}/r/${result._id}`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// Show all links shorten and long urls
app.get('/links', async (_request, response) => {
  const links = await Links.find();

  // check if the the input field is empty
  if (links.length === 0) {
    response.status(200).json({
      result: [],
    });
    return;
  }

  response.status(200).json({
    result: links.map((link) => ({
      link: { ...link, short_url: `${baseUrl}/${link._id}` }
    })),
  });
});

// Show links by given id
app.get('/r/:id', async (request, response) => {
  const id = request.params.id
  const link = await Links.findById(id);
  let long_url = link.long_url

  if (!id) {
    response.status(404).send();
    return;
  }

  if (!long_url.startsWith('http://')) {
    long_url = 'http://' + long_url;
  }

  response.redirect(long_url)
})

// Clear all shorten and long urls
app.delete('/clear', async (_request, response) => {
  await Links.deleteMany();

  response.status(200).send();
  console.log('Deleted all links');
});

// Clear by id both shorten and long url
app.delete('/clear/:id', async (request, response) => {
  const id = request.params.id;

  if (!id) {
    response.status(404).send();
    return;
  }

  await Links.deleteOne({ _id: id });

  response.status(200).send();
  console.log('Deleted id: ', id);
});

module.exports = app;
