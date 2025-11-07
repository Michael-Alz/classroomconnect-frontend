import { useEffect, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Scanner } from '@yudiel/react-qr-scanner'
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner'

function extractJoinToken(rawValue: string) {
  try {
    const maybeUrl = new URL(rawValue)
    const pathMatch = maybeUrl.pathname.match(/session\/run\/([^/]+)/)
    if (pathMatch?.[1]) {
      return pathMatch[1]
    }
    const tokenParam =
      maybeUrl.searchParams.get('token') || maybeUrl.searchParams.get('join_token')
    if (tokenParam) {
      return tokenParam
    }
  } catch {
    // not a URL, fall through to treat as plain token
  }
  const plainTokenMatch = rawValue.match(/[A-Za-z0-9_-]{6,}/)
  return plainTokenMatch ? plainTokenMatch[0] : null
}

export function ScanPage() {
  const navigate = useNavigate()
  const isMobileExperience = useBreakpointValue({ base: true, md: false })
  const [scannedToken, setScannedToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (scannedToken) {
      navigate(`/session/run/${scannedToken}`)
    }
  }, [navigate, scannedToken])

  if (!isMobileExperience) {
    return (
      <Card maxW="lg" mx="auto">
        <CardBody>
          <Stack spacing={4}>
            <Heading size="md">Scan QR on mobile</Heading>
            <Text>
              Open this page on your phone or tablet to scan the session QR code. You can
              also join manually by entering the token.
            </Text>
            <Button onClick={() => navigate('/guest/join')} colorScheme="blue">
              Enter token manually
            </Button>
          </Stack>
        </CardBody>
      </Card>
    )
  }

  return (
    <Stack spacing={4} align="center">
      <Heading size="md">Scan session QR code</Heading>
      <Text color="gray.600" textAlign="center">
        Point your camera at the QR code shared by your teacher to join instantly.
      </Text>
      <Box width="100%" maxW="360px" borderRadius="lg" overflow="hidden">
        <Scanner
          styles={{ container: { padding: 0 } }}
          onScan={(detected: IDetectedBarcode[]) => {
            const firstValue = detected[0]?.rawValue
            if (!firstValue) return
            const token = extractJoinToken(firstValue)
            if (token) {
              setError(null)
              setScannedToken(token)
            } else {
              setError('Unable to read join token from QR code.')
            }
          }}
          onError={(scanError) => {
            if (scanError instanceof Error) {
              setError(scanError.message)
            } else {
              setError('Camera error')
            }
          }}
        />
      </Box>
      {error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Button variant="outline" onClick={() => navigate('/guest/join')}>
        Enter token manually instead
      </Button>
    </Stack>
  )
}
