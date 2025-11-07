import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { listActivityTypes } from '../../api/activities'

export function TeacherActivityTypeDetailPage() {
  const { typeName } = useParams<{ typeName: string }>()
  const navigate = useNavigate()
  const activityTypesQuery = useQuery({
    queryKey: ['activityTypes'],
    queryFn: listActivityTypes,
  })

  if (activityTypesQuery.isLoading) {
    return <Text>Loading activity type…</Text>
  }

  if (!activityTypesQuery.data?.length) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Unable to load activity types.</AlertDescription>
      </Alert>
    )
  }

  const type = activityTypesQuery.data.find((item) => item.type_name === typeName)

  if (!type) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>Activity type not found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading size="lg">{type.type_name}</Heading>
        <Text color="gray.600">{type.description}</Text>
      </Stack>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Heading size="sm">Required fields</Heading>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {type.required_fields.map((field) => (
                  <Badge key={field} colorScheme="purple">
                    {field}
                  </Badge>
                ))}
              </Stack>
            </Stack>
            <Stack spacing={2}>
              <Heading size="sm">Optional fields</Heading>
              {type.optional_fields.length ? (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {type.optional_fields.map((field) => (
                    <Badge key={field}>{field}</Badge>
                  ))}
                </Stack>
              ) : (
                <Text color="gray.500">No optional fields defined.</Text>
              )}
            </Stack>
            {type.example_content_json ? (
              <Stack spacing={2}>
                <Heading size="sm">Example JSON</Heading>
                <Text
                  as="pre"
                  fontSize="sm"
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  bg="gray.50"
                  overflowX="auto"
                >
                  {JSON.stringify(type.example_content_json, null, 2)}
                </Text>
              </Stack>
            ) : null}
          </Stack>
        </CardBody>
      </Card>

      <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
        <Button onClick={() => navigate('/teacher/activity-types')} variant="outline">
          Back to types
        </Button>
        <Button colorScheme="brand" onClick={() => navigate('/teacher/activities/new')}>
          Create activity from type
        </Button>
      </Stack>
    </Stack>
  )
}
