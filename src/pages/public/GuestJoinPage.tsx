import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJoinSession } from '../../api/public'
import { ApiError } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

export function GuestJoinPage() {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [guestName, setGuestName] = useState('')
  const { token: authToken, isStudent } = useAuth()

  const mutation = useMutation({
    mutationFn: (joinToken: string) => getJoinSession(joinToken),
    onSuccess: (_, joinToken) => {
      const trimmedName = guestName.trim()
      if (isStudent && authToken) {
        navigate(`/session/run/${joinToken}`)
        return
      }
      navigate(`/session/run/${joinToken}`, {
        state: {
          guestName: trimmedName,
          forceGuest: true,
        },
      })
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token.trim() || !guestName.trim()) return
    mutation.mutate(token.trim())
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? 'Unable to find the session.'
        : null

  return (
    <Card maxW="lg" mx="auto">
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="md">Join as Guest</Heading>
            {errorMessage ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <FormControl isRequired>
              <FormLabel>Join token</FormLabel>
              <Input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter token from your teacher"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Your name</FormLabel>
              <Input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Let your teacher know who you are"
                autoComplete="name"
              />
            </FormControl>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button
                type="submit"
                colorScheme="blue"
                flex="1"
                isLoading={mutation.isPending}
                isDisabled={!token.trim() || !guestName.trim()}
              >
                Join session
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/scan')}
                isDisabled={mutation.isPending}
              >
                Scan QR to join
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  )
}
