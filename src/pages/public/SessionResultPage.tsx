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
  Textarea,
} from '@chakra-ui/react'
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import type { PublicJoinSubmitResponse } from '../../api/types'

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
    <Stack spacing={6} maxW="3xl" mx="auto">
      <Card>
        <CardHeader>
          <Heading size="md">{courseTitle || 'Session recommendation'}</Heading>
          <Text fontSize="sm" color="gray.500">
            Thanks for checking in! Here is your suggested activity.
          </Text>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Text fontWeight="bold" fontSize="lg">
                {activity.name}
              </Text>
              <Text color="gray.600">{activity.summary}</Text>
              <Badge alignSelf="flex-start">{activity.type}</Badge>
            </Stack>
            <Box>
              <Text fontWeight="semibold" mb={2}>
                Activity details
              </Text>
              <Textarea
                value={JSON.stringify(activity.content_json, null, 2)}
                isReadOnly
                fontFamily="mono"
                rows={6}
              />
            </Box>
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
