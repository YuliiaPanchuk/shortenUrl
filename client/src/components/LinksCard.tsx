import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  Link,
  Stack,
  useClipboard,
} from '@chakra-ui/react';
import { useLinkContext } from '../context/LinkContext';
import { CopyIcon, ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons';
import { LinkDrawer } from './Drawer';
import RobotImg from '../images/robot.png';

export function LinksCard() {
  const { fetchLinks } = useLinkContext();
  const { onCopy, hasCopied } = useClipboard('');
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [_isLoading, setIsLoading] = useState(false);

  function createShortLink() {
    setIsLoading(true);

    fetch(`${process.env.REACT_APP_API_HOST}/shorten_url`, {
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

  const isValidUrl = (urlString: string) => {
    const urlPattern = new RegExp(
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );
    return !!urlPattern.test(urlString);
  };

  return (
    <Grid
      h={{ base: '80vh', md: '100vh' }}
      templateAreas={{
        base: "'Form' 'Robot'",
        md: "'Form Icon' '. Robot'",
      }}
      templateRows={{
        base: 'repeat(2, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
      alignItems="center"
      justifyContent="center"
      justifyItems="center"
      background="linear-gradient(345deg,#ffffff 0%,#ffffff calc(50% - 1px), #008996 calc(50% + 1px), #008996 100%)"
    >
      <GridItem gridArea="Form" display="flex" justifyContent="center" marginTop={{ base: '30px' }}>
        <Flex justify="center" align="center" flexDirection="column" width={{ base: 'xs' }}>
          <Box
            paddingX={10}
            paddingY={6}
            width={{ base: 'xs', md: 'md' }}
            borderWidth="1px"
            borderRadius="lg"
            border="1px solid white"
            backgroundColor="white"
          >
            <FormControl isInvalid={!isValidUrl(longLink)}>
              <FormLabel fontSize={{ base: 'sm', md: 'lg' }}>Enter a long url</FormLabel>
              <Input
                variant="outline"
                type="text"
                size="md"
                placeholder="http://url.com"
                value={longLink}
                onChange={(e) => setLongLink(e.target.value)}
              />
              {isValidUrl(longLink) || <FormErrorMessage>Please enter valid url</FormErrorMessage>}

              <Button
                colorScheme="blue"
                onClick={createShortLink}
                size={{ base: 'sm', md: 'md' }}
                marginTop={2}
                isDisabled={isValidUrl(longLink) ? false : true}
              >
                Submit
              </Button>
            </FormControl>

            {Boolean(shortLink) && (
              <FormControl marginTop={10}>
                <FormLabel fontSize={{ base: 'sm', md: 'lg' }}>Shorten link: </FormLabel>
                <Stack marginY={2}>
                  <Link
                    borderWidth="1px"
                    borderRadius="lg"
                    maxW="md"
                    padding={4}
                    href={shortLink}
                    isExternal
                    onClick={() => {
                      setTimeout(() => fetchLinks(), 500);
                    }}
                  >
                    {shortLink} <ExternalLinkIcon mx="2px" />
                  </Link>
                </Stack>
                <Button onClick={onCopy} fontSize={{ base: 'sm', md: 'md' }}>
                  {hasCopied ? 'Copied!' : 'Copy'}
                  <CopyIcon marginLeft={2} />
                </Button>
              </FormControl>
            )}
          </Box>
          <LinkDrawer />
        </Flex>
      </GridItem>

      <GridItem
        gridArea="Icon"
        display={{ base: 'none', md: 'none', lg: 'flex' }}
        justifyContent="center"
        alignItems="end"
      >
        <Box p={16} borderColor="#ffffff5e" borderWidth={12} borderRadius="50%">
          <LinkIcon boxSize={300} color="#ffffff5e" />
        </Box>
      </GridItem>

      <GridItem
        gridArea="Robot"
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxSize={{ base: '200px', md: '400px', lg: '400px' }}
      >
        <Image src={RobotImg} alt="Cute robot" margin={10} align="right" />
      </GridItem>
    </Grid>
  );
}
