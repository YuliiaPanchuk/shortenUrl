import React, { useState } from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { LinkRow } from './LinkRow';

export function LinkDrawer() {
  const [size, setSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (newSize: string) => {
    setSize(newSize);
    onOpen();
  };

  return (
    <Flex justify="center">
      <Button onClick={() => handleClick(size)} m={4} size="lg">
        {'History'}
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size={'xl'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>History</DrawerHeader>
          <DrawerBody>
            <LinkRow />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
