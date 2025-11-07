import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getSurvey } from '../../api/surveys'

export function TeacherSurveyDetailPage() {
  const { surveyId } = useParams<{ surveyId: string }>()
  const navigate = useNavigate()

  const surveyQuery = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: () => getSurvey(surveyId ?? ''),
    enabled: Boolean(surveyId),
  })

  if (surveyQuery.isLoading) {
    return <Text>Loading survey…</Text>
  }

  if (surveyQuery.isError || !surveyQuery.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Unable to load survey template.</AlertDescription>
      </Alert>
    )
  }

  const survey = surveyQuery.data

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={3}>
        <Stack spacing={1}>
          <Heading size="lg">{survey.title}</Heading>
          <Text color="gray.600">
            {survey.questions.length} question{survey.questions.length === 1 ? '' : 's'}
          </Text>
        </Stack>
        <Button onClick={() => navigate('/teacher/surveys/new')} colorScheme="brand">
          Duplicate / Create new
        </Button>
      </Stack>

      <Card>
        <CardBody>
          <Stack spacing={6}>
            {survey.questions.map((question) => (
              <Box key={question.id} borderWidth="1px" borderRadius="lg" p={4}>
                <Stack spacing={3}>
                  <Heading size="sm">{question.text}</Heading>
                  <Stack spacing={2}>
                    {question.options.map((option, idx) => (
                      <Box key={idx} borderWidth="1px" borderRadius="md" p={3}>
                        <Text fontWeight="semibold">{option.label}</Text>
                        <Stack direction="row" flexWrap="wrap" spacing={2} mt={1}>
                          {Object.entries(option.scores).map(([key, value]) => (
                            <Badge key={key} colorScheme="purple">
                              {key}: {value}
                            </Badge>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <Button variant="outline" onClick={() => navigate('/teacher/surveys')}>
        Back to surveys
      </Button>
    </Stack>
  )
}
