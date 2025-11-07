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
  Select,
  Stack,
  Switch,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCourses, createCourseSession } from '../../api/courses'
import { ApiError } from '../../api/client'

export function TeacherSessionCreatePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [courseId, setCourseId] = useState('')
  const [requireSurvey, setRequireSurvey] = useState(true)
  const [moodPrompt, setMoodPrompt] = useState('How are you feeling today?')

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: listCourses,
  })

  const sessionMutation = useMutation({
    mutationFn: () =>
      createCourseSession(courseId, {
        require_survey: requireSurvey,
        mood_prompt: moodPrompt,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', courseId] })
      navigate(`/teacher/sessions/${data.session_id}/dashboard`, {
        state: { fromCreation: true },
      })
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sessionMutation.mutate()
  }

  return (
    <Stack spacing={6}>
      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Heading size="md">Create session</Heading>
              <FormControl isRequired>
                <FormLabel>Course</FormLabel>
                <Select
                  placeholder="Select course"
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                >
                  {coursesQuery.data?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Require survey</FormLabel>
                <Switch
                  isChecked={requireSurvey}
                  onChange={(event) => setRequireSurvey(event.target.checked)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mood prompt</FormLabel>
                <Input value={moodPrompt} onChange={(event) => setMoodPrompt(event.target.value)} />
              </FormControl>
              {sessionMutation.error instanceof ApiError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{sessionMutation.error.message}</AlertDescription>
                </Alert>
              ) : null}
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={sessionMutation.isPending}
                isDisabled={!courseId}
              >
                Create session
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>

      <Button variant="outline" onClick={() => navigate('/teacher/sessions')}>
        View session library
      </Button>
    </Stack>
  )
}
