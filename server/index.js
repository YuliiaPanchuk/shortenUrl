const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const baseUrl = `${process.env.REACT_APP_API_HOST}`;

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shorted_urls',
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected');
});

function sqlDateTime(date = new Date()) {
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
app.post('/create', (req, res) => {
  const long_url = req.body.long_url;
  const uniqueID = Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/gi, '')
    .substring(2, 10);

  if (!long_url) {
    res.status(400).json({
      status: '!OK',
      message: 'Something went wrong',
    });
    return;
  }

  const sql = `INSERT INTO links_data(long_url, short_url_id, created_at, count) VALUES('${long_url}', '${uniqueID}', '${sqlDateTime()}', 0 )`;
  console.log('SQL:', sql);
  con.query(sql, (err, _result) => {
    if (err) {
      res.status(500).json({
        status: '!OK',
        message: 'Something went wrong',
      });
      console.log('Error:', err);
    } else {
      res.json({
        long_url,
        url: `${baseUrl}/${uniqueID}`,
      });
    }
  });
});

app.post('/list', (_req, res) => {
  const sql = `SELECT long_url, short_url_id, created_at, count FROM links_data`;
  con.query(sql, (err, result) => {
    console.log(result);
    if (err) {
      res.status(500).json({
        message: 'Something went wrong',
      });
      console.log('Error:', err);
    } else {
      res.json({
        items: result.map((item) => ({ ...item, short_url: `${baseUrl}/${item.short_url_id}` })),
      });
    }
  });
});

app.delete('/delete', (_req, res) => {
  const sql = 'DELETE FROM links_data';
  con.query(sql, (err, result) => {
    console.log(result);
    if (err) {
      res.status(500).json({
        message: 'Something went wrong for getting shorded url',
      });
      console.log('Error:', err);
    } else {
      res.status(200).send();
    }
  });
});

app.get('/r/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404);
    return;
  }

  con.query('SELECT long_url FROM links_data WHERE short_url_id = ?', [id], (err, result) => {
    if (result?.length > 0) {
      let url = result[0].long_url;
      if (!url.startsWith('http')) {
        url = 'http://' + url;
      }

      con.query('UPDATE links_data SET count = count + 1 WHERE short_url_id = ?', [id], () => { });

      res.redirect(url);
      return;
    }

    if (err) {
      console.log('Error:', err);
    }

    res.status(404);
  });
});
