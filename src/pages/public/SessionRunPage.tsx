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
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getJoinSession, submitJoinSession } from '../../api/public'
import { ApiError } from '../../api/client'
import type { PublicJoinResponse } from '../../api/types'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentProfile } from '../../api/students'

type GuestJoinState = {
  guestName?: string
  guestId?: string | null
  forceGuest?: boolean
}

export function SessionRunPage() {
  const { token: joinToken } = useParams<{ token: string }>()
  const location = useLocation()
  const guestJoinState = (location.state as GuestJoinState | null) ?? null
  const auth = useAuth()
  const { token: authToken, isStudent } = auth
  const navigate = useNavigate()
  const guestStorageKey = joinToken ? `session_guest_${joinToken}` : null
  const storedGuest = useMemo(() => {
    if (!guestStorageKey || typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem(guestStorageKey)
      return raw ? (JSON.parse(raw) as GuestJoinState) : null
    } catch {
      return null
    }
  }, [guestStorageKey])
  const [mood, setMood] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [studentName, setStudentName] = useState(
    () => guestJoinState?.guestName ?? storedGuest?.guestName ?? '',
  )
  const [guestId, setGuestId] = useState<string | null>(
    () => guestJoinState?.guestId ?? storedGuest?.guestId ?? null,
  )

  const studentProfileQuery = useQuery({
    queryKey: ['studentProfile'],
    queryFn: getStudentProfile,
    enabled: isStudent,
  })

  const sessionQuery = useQuery({
    queryKey: ['publicJoin', joinToken],
    queryFn: () => getJoinSession(joinToken ?? ''),
    enabled: Boolean(joinToken),
    retry: false,
  })

  const mutation = useMutation({
    mutationFn: () => {
      if (!joinToken) {
        throw new Error('Missing join token')
      }
      const payload: Parameters<typeof submitJoinSession>[1] = {
        mood,
      }
      if (Object.keys(answers).length > 0) {
        payload.answers = answers
      }
      const trimmedName = studentName.trim()
      if (!authToken || guestJoinState?.forceGuest) {
        payload.is_guest = true
        payload.student_name = trimmedName
        payload.guest_id = guestId
      } else {
        payload.is_guest = false
      }
      return submitJoinSession(joinToken, payload)
    },
    onSuccess: (data) => {
      if (data.guest_id) {
        setGuestId(data.guest_id)
        if (guestStorageKey && typeof window !== 'undefined') {
          sessionStorage.setItem(
            guestStorageKey,
            JSON.stringify({ guestId: data.guest_id, guestName: studentName.trim() }),
          )
        }
      }
      navigate(`/session/run/${joinToken}/result`, {
        replace: true,
        state: {
          submission: data,
          courseTitle: sessionQuery.data?.course_title ?? '',
          guest:
            data.guest_id && studentName.trim()
              ? { guestId: data.guest_id, guestName: studentName.trim(), forceGuest: true }
              : data.guest_id
                ? { guestId: data.guest_id, forceGuest: true }
                : undefined,
        },
      })
    },
  })

  const sessionData: PublicJoinResponse | undefined = sessionQuery.data
  const requireSurvey = sessionData?.require_survey ?? false
  const showSurvey = Boolean(sessionData?.survey)
  const requireGuestIdentity = !authToken || Boolean(guestJoinState?.forceGuest)

  const surveyQuestions = useMemo(
    () => sessionData?.survey?.questions ?? [],
    [sessionData?.survey?.questions],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sessionData) return
    mutation.mutate()
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.isError
        ? 'Unable to submit your response.'
        : null

  if (sessionQuery.isLoading) {
    return (
      <Stack align="center" spacing={4}>
        <Spinner />
        <Text>Loading session…</Text>
      </Stack>
    )
  }

  if (sessionQuery.isError || !sessionData) {
    const message =
      sessionQuery.error instanceof ApiError
        ? sessionQuery.error.message
        : 'We could not find this session or it is no longer available.'
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  }

  if (sessionData.status !== 'OPEN') {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>This session is closed.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader>
          <Stack spacing={2}>
            <Heading size="md">{sessionData.course_title}</Heading>
            <Wrap>
              <WrapItem>
                <Badge colorScheme="green">{sessionData.status}</Badge>
              </WrapItem>
              <WrapItem>
                <Badge>{requireSurvey ? 'Survey required' : 'Survey optional'}</Badge>
              </WrapItem>
            </Wrap>
          </Stack>
        </CardHeader>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {isStudent ? (
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    Submitting as {studentProfileQuery.data?.full_name ?? 'student'}
                  </AlertDescription>
                </Alert>
              ) : null}
              <FormControl isRequired>
                <FormLabel>{sessionData.mood_check_schema.prompt}</FormLabel>
                <RadioGroup value={mood} onChange={setMood}>
                  <Stack direction={{ base: 'column', sm: 'row' }}>
                    {sessionData.mood_check_schema.options.map((option) => (
                      <Radio key={option} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              {requireGuestIdentity ? (
                guestJoinState?.guestId || storedGuest?.guestId ? (
                  <FormControl>
                    <FormLabel>Your name</FormLabel>
                    <Input value={studentName} isReadOnly variant="filled" />
                  </FormControl>
                ) : (
                  <FormControl isRequired>
                    <FormLabel>Your name</FormLabel>
                    <Input
                      value={studentName}
                      onChange={(event) => setStudentName(event.target.value)}
                      placeholder="Enter your name so the teacher can identify you"
                    />
                  </FormControl>
                )
              ) : null}

              {showSurvey ? (
                <Stack spacing={4}>
                  <Heading size="sm">Quick survey</Heading>
                  {surveyQuestions.map((question) => (
                    <FormControl
                      key={question.question_id}
                      isRequired={requireSurvey}
                      as="fieldset"
                    >
                      <FormLabel as="legend">{question.text}</FormLabel>
                      <RadioGroup
                        value={answers[question.question_id] ?? ''}
                        onChange={(value) =>
                          setAnswers((prev) => ({ ...prev, [question.question_id]: value }))
                        }
                      >
                        <Stack>
                          {question.options.map((option) => (
                            <Radio key={option.option_id} value={option.option_id}>
                              {option.text}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                      {requireSurvey ? (
                        <FormHelperText>Select one option to continue</FormHelperText>
                      ) : null}
                    </FormControl>
                  ))}
                </Stack>
              ) : null}

              {errorMessage ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={mutation.isPending}
                isDisabled={
                  !mood ||
                  (requireGuestIdentity && !studentName.trim()) ||
                  (requireSurvey &&
                    surveyQuestions.some((q) => !answers[q.question_id]?.trim()))
                }
              >
                Submit check-in
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>

    </Stack>
  )
}
