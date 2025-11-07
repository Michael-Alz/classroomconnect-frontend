import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { listSurveys } from '../../api/surveys'

export function TeacherSurveysPage() {
  const navigate = useNavigate()
  const surveysQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: listSurveys,
  })

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Survey templates</Heading>
          <Text color="gray.600">
            Create reusable surveys that power course baselines and live sessions.
          </Text>
        </Stack>
        <Button colorScheme="brand" onClick={() => navigate('/teacher/surveys/new')}>
          Create survey
        </Button>
      </Stack>

      <Card>
        <CardBody>
          {surveysQuery.isLoading ? (
            <Text>Loading survey templates…</Text>
          ) : surveysQuery.data?.length ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {surveysQuery.data.map((survey) => (
                <Card
                  key={survey.id}
                  variant="outline"
                  cursor="pointer"
                  _hover={{ borderColor: 'brand.400' }}
                  onClick={() => navigate(`/teacher/surveys/${survey.id}`)}
                >
                  <CardHeader>
                    <Heading size="sm">{survey.title}</Heading>
                    <Text fontSize="xs" color="gray.500">
                      {survey.questions.length} questions
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={2}>
                      {survey.creator_name ? (
                        <Text fontSize="sm" color="gray.600">
                          Created by {survey.creator_name}
                        </Text>
                      ) : null}
                      {survey.created_at ? (
                        <Text fontSize="sm" color="gray.500">
                          Added {new Date(survey.created_at).toLocaleDateString()}
                        </Text>
                      ) : null}
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text>No survey templates yet. Create your first one above.</Text>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
