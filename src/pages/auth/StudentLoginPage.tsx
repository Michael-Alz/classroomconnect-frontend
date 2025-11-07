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
  Link,
  Stack,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { studentLogin } from '../../api/auth'
import { ApiError } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

export function StudentLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => studentLogin({ email, password }),
    onSuccess: (data) => {
      login(data.access_token, 'student')
      navigate('/student', { replace: true })
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? 'Unable to login. Please try again.'
        : null

  return (
    <Card maxW="lg" mx="auto">
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="md">Student Login</Heading>
            {errorMessage ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={mutation.isPending}
              isDisabled={!email || !password}
            >
              Log in
            </Button>
            <Link as={RouterLink} to="/signup/student" color="blue.600">
              Need an account? Sign up
            </Link>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  )
}
