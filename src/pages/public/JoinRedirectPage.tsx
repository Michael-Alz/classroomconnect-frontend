import { Alert, AlertDescription, AlertIcon, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function JoinRedirectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('s') ?? searchParams.get('token')

  useEffect(() => {
    if (!token) return
    navigate(`/session/run/${token}`, { replace: true })
  }, [navigate, token])

  if (!token) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Join token missing from the link.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Stack align="center" spacing={3} py={10}>
      <Spinner />
      <Text>Opening session…</Text>
    </Stack>
  )
}
