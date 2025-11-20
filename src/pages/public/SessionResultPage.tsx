import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import type { PublicJoinSubmitResponse } from '../../api/types'
import { FiSmile } from 'react-icons/fi'
import { ActivityContentDisplay } from '../../components/activity/ActivityContentDisplay'

type ResultPageState = {
  submission: PublicJoinSubmitResponse
  courseTitle: string
  guest?: {
    guestId?: string | null
    guestName?: string
    forceGuest?: boolean
  }
}

export function SessionResultPage() {
  const { token: joinToken } = useParams<{ token: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state as ResultPageState | null) ?? null

  if (!state?.submission || !joinToken) {
    return <Navigate to={joinToken ? `/session/run/${joinToken}` : '/scan'} replace />
  }

  const { submission, courseTitle, guest } = state
  const activity = submission.recommended_activity.activity

  const handleRetake = () => {
    navigate(`/session/run/${joinToken}`, {
      state: guest
        ? {
            guestName: guest.guestName,
            guestId: guest.guestId,
            forceGuest: guest.forceGuest ?? true,
          }
        : undefined,
    })
  }

  return (
    <Stack spacing={6} maxW="5xl" mx="auto" px={{ base: 4, md: 0 }}>
      <Card>
        <CardHeader>
          <Heading size="md">{courseTitle || 'Session recommendation'}</Heading>
          <Text fontSize="sm" color="gray.500">
            Thanks for checking in! Here is your suggested activity.
          </Text>
        </CardHeader>
        <CardBody>
          <Stack spacing={6}>
            <Flex
              gap={4}
              align={{ base: 'flex-start', md: 'center' }}
              direction={{ base: 'column', md: 'row' }}
              bg="brand.50"
              borderRadius="xl"
              p={4}
              border="1px solid"
              borderColor="brand.100"
            >
              <Box
                bgGradient="linear(135deg, brand.200, brand.400)"
                color="white"
                borderRadius="full"
                p={3}
                boxShadow="lg"
              >
                <Icon as={FiSmile} boxSize={8} />
              </Box>
              <Stack spacing={2}>
                <Heading size="md" fontWeight="800">
                  {activity.name}
                </Heading>
                <Text color="gray.700">{activity.summary}</Text>
                <Badge colorScheme="brand" w="fit-content">
                  {activity.type}
                </Badge>
              </Stack>
            </Flex>

            <ActivityContentDisplay
              activity={{
                name: activity.name,
                summary: activity.summary,
                type: activity.type,
                content_json: activity.content_json,
              }}
              showHeader={false}
              showTags={false}
            />

            {submission.message ? (
              <Alert status="success">
                <AlertIcon />
                <AlertDescription>{submission.message}</AlertDescription>
              </Alert>
            ) : null}
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Stack spacing={3}>
            <Text>
              Mood logged: <strong>{submission.mood}</strong>
            </Text>
            {submission.learning_style ? (
              <Text>
                Learning style match: <strong>{submission.learning_style}</strong>
              </Text>
            ) : null}
            {submission.is_baseline_update ? (
              <Badge alignSelf="flex-start" colorScheme="purple">
                Baseline profile updated
              </Badge>
            ) : null}
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
              <Button colorScheme="blue" onClick={handleRetake}>
                Retake check-in
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>Done</Button>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}
