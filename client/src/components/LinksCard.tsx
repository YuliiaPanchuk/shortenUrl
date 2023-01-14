import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Link,
  Stack,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { useLinkContext } from '../context/LinkContext';

export function LinksCard() {
  const { fetchLinks } = useLinkContext();
  const { onCopy, hasCopied } = useClipboard('');
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [_isLoading, setIsLoading] = useState(false);

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
    <Box paddingX={10} paddingY={6} maxW="420px" borderWidth="1px" borderRadius="lg">
      <Stack>
        <div>
          <Text>Enter a long url</Text>
          <Input
            type="text"
            size="md"
            variant="outline"
            placeholder="http://website.com"
            value={longLink}
            onChange={(e) => setLongLink(e.target.value)}
          />
        </div>
        <Button colorScheme="blue" onClick={createShortLink}>
          Submit
        </Button>
      </Stack>

      {Boolean(shortLink) && (
        <Container maxW="md">
          <Text mb="8px">Shorted link: </Text>
          <VStack>
            <Link
              borderWidth="1px"
              borderRadius="lg"
              maxW="md"
              href={shortLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                setTimeout(() => fetchLinks(), 500);
              }}
            >
              {shortLink}
            </Link>
          </VStack>
          <Button onClick={onCopy}>
            {hasCopied ? 'Copied!' : 'Copy'}
            <i className="fa-regular fa-copy" />
          </Button>
        </Container>
      )}
    </Box>
  );
}
