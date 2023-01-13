import React from 'react';
import { Links } from '../types';
import { QrCode } from './QrCode';

interface LinkRowProps {
  list: Links[];
  onDelete: () => void;
}

export function LinkRow({ list, onDelete }: LinkRowProps) {
  return (
    <div className="list">
      <button onClick={onDelete} className="clear_button">
        Clear
      </button>

      {list.map((item, index) => (
        <table className="list_urls" key={index}>
          <thead>
            <tr>
              <th>Long url</th>
              <th>Shorten url</th>
              <th>Clicked</th>
              <th>Created at</th>
              <th>QrCode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.long_url}</td>
              <td>
                <a href={item.short_url} target="_blank" rel="noreferrer">
                  {item.short_url}
                </a>
              </td>
              <td>{item.count}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>
                <QrCode text={item.short_url} />
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}
