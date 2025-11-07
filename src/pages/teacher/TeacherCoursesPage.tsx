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
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCourse, listCourses } from '../../api/courses'
import { listSurveys } from '../../api/surveys'
import { ApiError } from '../../api/client'

export function TeacherCoursesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: listCourses,
  })
  const surveysQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: listSurveys,
  })

  const [title, setTitle] = useState('')
  const [baselineSurveyId, setBaselineSurveyId] = useState('')
  const [moodInput, setMoodInput] = useState('')
  const [moodLabels, setMoodLabels] = useState<string[]>([])

  const addMoodLabel = () => {
    const label = moodInput.trim()
    if (!label || moodLabels.includes(label)) return
    setMoodLabels((prev) => [...prev, label])
    setMoodInput('')
  }

  const removeMoodLabel = (label: string) => {
    setMoodLabels((prev) => prev.filter((item) => item !== label))
  }

  const createMutation = useMutation({
    mutationFn: () =>
      createCourse({
        title,
        baseline_survey_id: baselineSurveyId,
        mood_labels: moodLabels,
      }),
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setTitle('')
      setBaselineSurveyId('')
      setMoodLabels([])
      navigate(`/teacher/courses/${course.id}`)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !baselineSurveyId || moodLabels.length === 0) return
    createMutation.mutate()
  }

  const createError =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : createMutation.isError
        ? 'Unable to create course.'
        : null

  return (
    <Stack spacing={6}>
      <Card>
        <CardHeader>
          <Heading size="md">Create course</Heading>
        </CardHeader>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Course title</FormLabel>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Baseline survey</FormLabel>
                  <Select
                    placeholder={
                      surveysQuery.isLoading ? 'Loading surveys…' : 'Select survey template'
                    }
                    value={baselineSurveyId}
                    onChange={(event) => setBaselineSurveyId(event.target.value)}
                    isDisabled={surveysQuery.isLoading || !surveysQuery.data?.length}
                  >
                    {surveysQuery.data?.map((survey) => (
                      <option value={survey.id} key={survey.id}>
                        {survey.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Mood labels</FormLabel>
                <HStack spacing={3}>
                <Input
                  isRequired={false}
                  value={moodInput}
                  onChange={(event) => setMoodInput(event.target.value)}
                  placeholder="Type label and press Add"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addMoodLabel()
                    }
                  }}
                />
                <Button type="button" onClick={addMoodLabel} isDisabled={!moodInput.trim()}>
                  Add
                </Button>
              </HStack>
              <Wrap mt={2}>
                {moodLabels.map((label) => (
                  <WrapItem key={label}>
                    <Badge colorScheme="purple" px={2} py={1}>
                      <HStack spacing={1}>
                        <Text>{label}</Text>
                        <IconButton
                          aria-label={`Remove ${label}`}
                          size="xs"
                          icon={<CloseIcon />}
                          variant="ghost"
                          onClick={() => removeMoodLabel(label)}
                        />
                      </HStack>
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>
            {createError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            ) : null}
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={createMutation.isPending}
                isDisabled={
                  !title.trim() ||
                  !baselineSurveyId ||
                  createMutation.isPending ||
                  !moodLabels.length
                }
              >
                Create course
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md">Your courses</Heading>
        </CardHeader>
        <CardBody>
          {coursesQuery.isLoading ? (
            <Text>Loading courses…</Text>
          ) : coursesQuery.data?.length ? (
            <Stack spacing={4}>
              {coursesQuery.data.map((course) => (
                <Box
                  key={course.id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  cursor="pointer"
                  _hover={{ borderColor: 'purple.500' }}
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  <Heading size="sm">{course.title}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    Created {new Date(course.created_at).toLocaleString()}
                  </Text>
                  <Wrap mt={2}>
                    {course.mood_labels.map((label) => (
                      <WrapItem key={label}>
                        <Badge>{label}</Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              ))}
            </Stack>
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>No courses yet. Create your first course above.</AlertDescription>
            </Alert>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
