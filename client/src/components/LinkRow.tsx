import React from 'react';
import {
  Box,
  Button,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { QrCode } from './QrCode';
import { useLinkContext } from '../context/LinkContext';
import '../styles.css';

export function LinkRow() {
  const { links, clearAll, fetchLinks } = useLinkContext();

  return (
    <Box>
      <Button onClick={clearAll} variant="outline" colorScheme="blue" marginBottom={2}>
        Clear
      </Button>

      {links.map((item, index) => (
        <TableContainer key={index}>
          <Table className="table" variant="simple" colorScheme="blue" size="sm" marginY={6}>
            <Thead>
              <Tr>
                <Th>Long url</Th>
                <Th>Shorten url</Th>
                <Th>Clicked</Th>
                <Th>Created at</Th>
                <Th>QrCode</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{item.long_url}</Td>
                <Td>
                  <Link
                    isExternal
                    href={item.short_url}
                    onClick={() => setTimeout(fetchLinks, 500)}
                  >
                    {item.short_url}
                  </Link>
                </Td>
                <Td>{item.clicked}</Td>
                <Td>{new Date(item.created_at).toLocaleString()}</Td>
                <Td className="qr">
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
