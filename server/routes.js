const express = require('express');
const app = express();
const { Links } = require('./models/LinksSchema');
// const { v4: uuidv4 } = require('uuid');
const shortId = require('short-uuid');

const baseUrl = `${process.env.REACT_APP_API_HOST}`;

function dateTime(date = new Date()) {
  const pad = function (num) {
    return ('00' + num).slice(-2);
  };

  return (
    date.getUTCFullYear() +
    '-' +
    pad(date.getUTCMonth() + 1) +
    '-' +
    pad(date.getUTCDate()) +
    ' ' +
    pad(date.getUTCHours()) +
    ':' +
    pad(date.getUTCMinutes()) +
    ':' +
    pad(date.getUTCSeconds())
  );
}

// Create shorten url
app.post('/shorten_url', async (request, response) => {
  let long_url = request.body.long_url;
  if (long_url === '' || typeof long_url !== 'string') {
    response.status(400).json({
      error: 'Input cannot be empty',
    });
    alert('Input cannot be empty');
    return;
  }

  try {
    // Create record
    const result = await Links.create({
      long_url,
      _id: shortId.generate(),
      created_at: dateTime(),
    });

    // Respond to client
    response.status(200).json({
      long_url: long_url,
      id: result._id,
      url: `${baseUrl}/r/${result._id}`,
      created_at: result.created_at,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// Show all links shorten and long urls
app.get('/links', async (_request, response) => {
  const links = await Links.find();

  if (links.length === 0) {
    response.status(200).json({
      result: [],
    });
    return;
  }

  response.status(200).json({
    result: links.map((link) => ({
      id: link._id,
      long_url: link.long_url,
      short_url: `${baseUrl}/r/${link._id}`,
      clicked: link.count || 0,
      created_at: dateTime(link.created_at),
    })),
  });
});

// Show links by given id
app.get('/r/:id', async (request, response) => {
  const id = request.params.id;
  if (!id) {
    response.status(404).send();
    return;
  }

  const link = await Links.findOneAndUpdate(
    { _id: id },
    {
      $inc: {
        count: 1,
      },
    },
  );

  if (!link) {
    response.status(404).json();
    return;
  }

  let long_url = link.long_url;
  if (!long_url.startsWith('http')) {
    long_url = 'http://' + long_url;
  }

  response.redirect(long_url);
});

// Clear all content
app.delete('/clear', async (_request, response) => {
  await Links.deleteMany();

  response.status(200).json();
  console.log('Deleted all links');
});

// Clear by id both shorten and long url
app.delete('/clear/:id', async (request, response) => {
  const id = request.params.id;

  if (!id) {
    response.status(404).json();
    return;
  }

  await Links.deleteOne({ _id: id });

  response.status(200).send();
  console.log('Deleted id: ', id);
});

module.exports = app;
