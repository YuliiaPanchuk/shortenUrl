import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';
import { useLinkContext } from '../context/LinkContext';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import RobotImg from '../images/robot.png';
import { LinkDrawer } from './Drawer';

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
    <Grid h="100vh" templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)">
      <GridItem colStart={1} rowStart={1} display="flex" justifyContent="center">
        <Flex justify="center" align="center" flexDirection="column" minWidth="md">
          <Box paddingX={10} paddingY={6} maxW="lg" minW="md" borderWidth="1px" borderRadius="lg">
            <Stack>
              <Text>Enter a long url</Text>
              <Input
                type="text"
                size="md"
                variant="outline"
                placeholder="http://website.com"
                value={longLink}
                onChange={(e) => setLongLink(e.target.value)}
              />
              <Button colorScheme="blue" onClick={createShortLink}>
                Submit
              </Button>
            </Stack>

            {Boolean(shortLink) && (
              <Box marginTop={10}>
                <Text>Shorted link: </Text>
                <VStack marginY={2}>
                  <Link
                    borderWidth="1px"
                    borderRadius="lg"
                    maxW="md"
                    href={shortLink}
                    isExternal
                    onClick={() => {
                      setTimeout(() => fetchLinks(), 500);
                    }}
                  >
                    {shortLink} <ExternalLinkIcon mx="2px" />
                  </Link>
                </VStack>
                <Button onClick={onCopy}>
                  {hasCopied ? 'Copied!' : 'Copy'}
                  <i className="fa-regular fa-copy" />
                </Button>
              </Box>
            )}
          </Box>
          <LinkDrawer />
        </Flex>
      </GridItem>

      <GridItem
        colStart={2}
        rowStart={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Image src={RobotImg} alt="Cute robot" boxSize="400px" margin={10} align="right" />
      </GridItem>
    </Grid>
  );
}
