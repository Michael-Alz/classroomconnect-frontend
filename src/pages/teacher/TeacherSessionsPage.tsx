import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCourses } from '../../api/courses'
import { listCourseSessions } from '../../api/sessions'

export function TeacherSessionsPage() {
  const navigate = useNavigate()
  const [courseId, setCourseId] = useState('')

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: listCourses,
  })

  const sessionsQuery = useQuery({
    queryKey: ['courseSessions', courseId],
    queryFn: () => listCourseSessions(courseId),
    enabled: Boolean(courseId),
  })

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading size="md">Session library</Heading>
        <Text color="gray.600">
          Select a course to review open and past sessions.
        </Text>
      </Stack>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Course</FormLabel>
              <Select
                placeholder={coursesQuery.isLoading ? 'Loading courses…' : 'Choose a course'}
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

            {courseId ? (
              sessionsQuery.isLoading ? (
                <Text>Loading sessions…</Text>
              ) : sessionsQuery.isError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>Unable to load sessions for this course.</AlertDescription>
                </Alert>
              ) : sessionsQuery.data?.length ? (
                <Stack spacing={3}>
                  {sessionsQuery.data.map((session) => (
                    <Box
                      key={session.session_id}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      justifyContent="space-between"
                      gap={3}
                    >
                      <Stack spacing={1}>
                        <Heading size="sm">Session {session.session_id.slice(0, 8)}</Heading>
                        <Text fontSize="sm" color="gray.500">
                          Started {new Date(session.started_at).toLocaleString()}
                        </Text>
                        <Stack direction="row" spacing={2}>
                          <Badge colorScheme={session.closed_at ? 'gray' : 'green'}>
                            {session.closed_at ? 'Closed' : 'Open'}
                          </Badge>
                          <Badge colorScheme={session.require_survey ? 'purple' : 'orange'}>
                            {session.require_survey ? 'Survey on' : 'Survey off'}
                          </Badge>
                        </Stack>
                        <Text fontSize="sm">Join token: {session.join_token}</Text>
                      </Stack>
                      <Button
                        alignSelf="flex-start"
                        colorScheme="brand"
                        onClick={() =>
                          navigate(`/teacher/sessions/${session.session_id}/dashboard`)
                        }
                      >
                        View details
                      </Button>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Text>No sessions yet for this course.</Text>
              )
            ) : (
              <Text>Select a course to view sessions.</Text>
            )}
          </Stack>
        </CardBody>
      </Card>

      <Button variant="outline" onClick={() => navigate('/teacher/sessions/new')}>
        Create a new session
      </Button>
    </Stack>
  )
}
