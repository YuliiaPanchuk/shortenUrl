import React, { useCallback, useEffect, useState } from 'react';
import { Links } from '../types';

const LinkContext = React.createContext<{
  links: Links[];
  fetchLinks: () => void;
  clearAll: () => void;
}>({
  links: [],
  fetchLinks: function (): void {
    throw new Error('Function not implemented.');
  },
  clearAll: function (): void {
    throw new Error('Function not implemented.');
  },
});

export function LinkProvider({ children }: any) {
  const [links, setLinks] = useState<Links[]>([]);

  const fetchLinks = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/links`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLinks(data.result);
      })
      .catch((error) => {
        console.log(`An error occur ${error}`);
      });
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const clearAll = () => {
    fetch(`${process.env.REACT_APP_API_HOST}/clear`, {
      method: 'DELETE',
    }).then(fetchLinks);
  };

  return (
    <LinkContext.Provider
      value={{
        links,
        fetchLinks,
        clearAll,
      }}
    >
      {children}
    </LinkContext.Provider>
  );
}

export function useLinkContext() {
  const context = React.useContext(LinkContext);

  if (context === undefined) {
    throw new Error('useListContext must be a child of ListProvider');
  }

  return context;
}
