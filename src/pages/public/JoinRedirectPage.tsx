// src/pages/public/JoinRedirectPage.tsx
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Spinner,
  Stack,
  Text,
  Box,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'

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
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(135deg, red.50 0%, orange.50 100%)"
        px={4}
      >
        <VStack spacing={6} maxW="lg">
          <Box
            bg="red.50"
            p={6}
            borderRadius="full"
            border="2px solid"
            borderColor="red.200"
          >
            <Icon as={FiAlertCircle} boxSize={16} color="red.500" />
          </Box>

          <Alert
            status="error"
            borderRadius="2xl"
            bg="white"
            border="2px solid"
            borderColor="red.200"
            boxShadow="2xl"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            p={8}
          >
            <AlertIcon color="red.500" boxSize={8} mb={4} />
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="800" color="gray.800">
                Missing Join Token
              </Text>
              <AlertDescription color="gray.600" fontSize="md">
                The join link is missing a session token. Please check your link or ask your teacher for a new one.
              </AlertDescription>
            </VStack>
          </Alert>
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(135deg, accent.50 0%, brand.50 100%)"
      px={4}
    >
      <VStack spacing={8}>
        {/* Animated Spinner Container */}
        <Box
          position="relative"
          w="120px"
          h="120px"
        >
          {/* Outer Ring */}
          <Box
            position="absolute"
            inset="0"
            borderRadius="full"
            border="4px solid"
            borderColor="accent.100"
          />
          
          {/* Spinning Ring */}
          <Box
            position="absolute"
            inset="0"
            borderRadius="full"
            border="4px solid transparent"
            borderTopColor="accent.500"
            borderRightColor="accent.500"
            animation="spin 1s linear infinite"
          />
          
          {/* Center Icon */}
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="4xl">🚀</Text>
          </Box>
        </Box>

        {/* Text */}
        <VStack spacing={2}>
          <Text fontSize="2xl" fontWeight="800" color="gray.800">
            Opening Session...
          </Text>
          <Text fontSize="md" color="gray.600">
            Please wait while we redirect you
          </Text>
        </VStack>
      </VStack>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  )
}