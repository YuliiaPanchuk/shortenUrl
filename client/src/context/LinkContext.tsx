import React, { useCallback, useEffect, useState } from 'react';
import { Links } from '../types';

export const LinkContext = React.createContext<{
  links: Links[];
  fetchLinks: () => void;
}>({
  links: [],
  fetchLinks: function (): void {
    throw new Error('Function not implemented.');
  },
});

export function LinkProvider({ children }: any) {
  const [links, setLinks] = useState<Links[]>([]);

  const fetchLinks = useCallback(() => {
    fetch('http://localhost:3001/links', {
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

  return (
    <LinkContext.Provider
      value={{
        links,
        fetchLinks,
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
