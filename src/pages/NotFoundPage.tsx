import { Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Stack spacing={4} align="flex-start">
      <Heading>Page not found</Heading>
      <Text>The page you were looking for does not exist.</Text>
      <Button as={RouterLink} to="/" colorScheme="purple">
        Go home
      </Button>
    </Stack>
  )
}
