import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listActivities, listActivityTypes } from '../../api/activities'

export function TeacherActivitiesPage() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const activitiesQuery = useQuery({
    queryKey: ['activities'],
    queryFn: listActivities,
  })

  const activityTypesQuery = useQuery({
    queryKey: ['activityTypes'],
    queryFn: listActivityTypes,
  })

  const filteredActivities = useMemo(() => {
    if (!activitiesQuery.data) return []
    return activitiesQuery.data.filter((activity) => {
      const typeMatches = typeFilter ? activity.type === typeFilter : true
      const tagMatches = tagFilter
        ? activity.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))
        : true
      return typeMatches && tagMatches
    })
  }, [activitiesQuery.data, typeFilter, tagFilter])

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={3}>
        <Stack spacing={1}>
          <Heading size="md">Activity library</Heading>
          <Text color="gray.600">Launch or edit reusable activities for recommendations.</Text>
        </Stack>
        <Button colorScheme="brand" onClick={() => navigate('/teacher/activities/new')}>
          Create activity
        </Button>
      </Stack>

      <Card>
        <CardHeader>
          <Heading size="sm">Filters</Heading>
        </CardHeader>
        <CardBody>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <FormControl maxW="240px">
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="All types"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                {activityTypesQuery.data?.map((type) => (
                  <option key={type.type_name} value={type.type_name}>
                    {type.type_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl maxW="240px">
              <FormLabel>Tag contains</FormLabel>
              <Input
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                placeholder="Search tags"
              />
            </FormControl>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {activitiesQuery.isLoading ? (
            <Text>Loading activities…</Text>
          ) : filteredActivities.length ? (
            <Stack spacing={4}>
              {filteredActivities.map((activity) => (
                <Card key={activity.id} variant="outline">
                  <CardBody>
                    <Stack spacing={2}>
                      <Stack direction={{ base: 'column', md: 'row' }} justify="space-between">
                        <Stack spacing={1}>
                          <Heading size="sm">{activity.name}</Heading>
                          <Text fontSize="sm" color="gray.600">
                            {activity.summary}
                          </Text>
                        </Stack>
                        <Badge alignSelf="flex-start">{activity.type}</Badge>
                      </Stack>
                      {activity.tags.length ? (
                        <Wrap>
                          {activity.tags.map((tag) => (
                            <WrapItem key={tag}>
                              <Tag size="sm" colorScheme="purple">
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      ) : null}
                      <Button
                        alignSelf="flex-start"
                        variant="outline"
                        onClick={() => navigate(`/teacher/activities/${activity.id}`)}
                      >
                        View details
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          ) : (
            <Text>
              {activitiesQuery.data?.length
                ? 'No activities match these filters.'
                : 'No activities yet. Create one to get started.'}
            </Text>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
