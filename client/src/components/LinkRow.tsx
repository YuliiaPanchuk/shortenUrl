import React from 'react';
import { Box, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { QrCode } from './QrCode';
import { useLinkContext } from '../context/LinkContext';

export function LinkRow() {
  const { links, clearAll } = useLinkContext();

  return (
    <Box>
      <Button onClick={clearAll} variant="outline" colorScheme="blue" marginBottom={2}>
        Clear
      </Button>

      {links.map((item, index) => (
        <TableContainer key={index}>
          <Table variant="simple" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Long url</Th>
                <Th>Shorten url</Th>
                <Th isNumeric>Clicked</Th>
                <Th>Created at</Th>
                <Th>QrCode</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{item.long_url}</Td>
                <Td>
                  <a href={item.short_url} target="_blank" rel="noreferrer">
                    {item.short_url}
                  </a>
                </Td>
                <Td>{item.count}</Td>
                <Td>{new Date(item.created_at).toLocaleString()}</Td>
                <Td>
                  <QrCode text={item.short_url} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}
