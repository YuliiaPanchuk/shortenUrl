import React from 'react';
import { ChakraProvider, Divider } from '@chakra-ui/react';
import { LinksCard } from './components/LinksCard';
import { LinkProvider } from './context/LinkContext';
import { LinkDrawer } from './components/Drawer';

export function App() {
  return (
    <ChakraProvider>
      <LinkProvider>
        <LinksCard />
      </LinkProvider>
    </ChakraProvider>
  );
}
