import React, { useEffect, useState } from 'react';
import { LinkRow } from './components/LinkRow';
import './App.css';

export function App() {
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [_isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);

  const copy = async () => {
    await navigator.clipboard.writeText(shortLink);
    alert('Copied!');
  };

  function fetchLinks() {
    fetch('http://localhost:3001/links', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setList(data.result);
      });
  }

  useEffect(() => {
    fetchLinks();

    return function () {};
  }, []);

  // Delete all links
  function handleDelete() {
    fetch('http://localhost:3001/clear', {
      method: 'DELETE',
    }).then(fetchLinks);
  }

  function createShortLink() {
    setIsLoading(true);

    fetch('http://localhost:3001/shorten_url', {
      method: 'POST',
      body: JSON.stringify({
        long_url: longLink,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setShortLink(data.url);
        fetchLinks();
      })
      .catch(() => alert('Something went wrong'))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="app">
      <div className="app_wrapper">
        <header className="header">Create short URL</header>
        <div className="form">
          <div className="form_element">
            <label>Enter a long url</label>
            <input
              type="text"
              placeholder="http://website.com"
              value={longLink}
              onChange={(e) => setLongLink(e.target.value)}
            />
          </div>
          <div className="form_element">
            <button onClick={createShortLink}>Submit</button>
          </div>
        </div>

        {Boolean(shortLink) && (
          <div className="link_result">
            <label className="shorted_link_text">Shorted link:</label>
            <a
              href={shortLink}
              className="shorted_url"
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setTimeout(() => fetchLinks(), 500);
              }}
            >
              {shortLink}
            </a>
            <button className="copy_button">
              <i className="fa-regular fa-copy" onClick={copy} />
            </button>
          </div>
        )}
      </div>

      <LinkRow list={list} onDelete={handleDelete} />
    </div>
  );
}
