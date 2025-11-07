import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { listActivityTypes } from '../../api/activities'

export function TeacherActivityTypesPage() {
  const navigate = useNavigate()
  const activityTypesQuery = useQuery({
    queryKey: ['activityTypes'],
    queryFn: listActivityTypes,
  })

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Activity types</Heading>
          <Text color="gray.600">
            Standardize required fields before authoring new activities.
          </Text>
        </Stack>
        <Button colorScheme="brand" onClick={() => navigate('/teacher/activity-types/new')}>
          Create type
        </Button>
      </Stack>

      <Stack spacing={4}>
        {activityTypesQuery.isLoading ? (
          <Text>Loading activity types…</Text>
        ) : activityTypesQuery.data?.length ? (
          activityTypesQuery.data.map((type) => (
            <Card
              key={type.type_name}
              variant="outline"
              cursor="pointer"
              _hover={{ borderColor: 'brand.400' }}
              onClick={() => navigate(`/teacher/activity-types/${type.type_name}`)}
            >
              <CardBody>
                <Stack spacing={2}>
                  <Heading size="sm">{type.type_name}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {type.description}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Required fields: {type.required_fields.length} • Optional fields:{' '}
                    {type.optional_fields.length}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ))
        ) : (
          <Text>No activity types yet. Create the first one above.</Text>
        )}
      </Stack>
    </Stack>
  )
}
