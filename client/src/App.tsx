import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { LinksCard } from './components/LinksCard';
import { LinkProvider } from './context/LinkContext';

export function App() {
  return (
    <ChakraProvider>
      <LinkProvider>
        <LinksCard />
      </LinkProvider>
    </ChakraProvider>
  );
}
