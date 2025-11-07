import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity, updateActivity } from '../../api/activities'
import { ApiError } from '../../api/client'

export function TeacherActivityDetailPage() {
  const { activityId } = useParams<{ activityId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const activityQuery = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => getActivity(activityId ?? ''),
    enabled: Boolean(activityId),
  })

  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [contentJson, setContentJson] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  useEffect(() => {
    if (!activityQuery.data) return
    setName(activityQuery.data.name)
    setSummary(activityQuery.data.summary)
    setTags(activityQuery.data.tags)
    setContentJson(JSON.stringify(activityQuery.data.content_json, null, 2))
  }, [activityQuery.data])

  const mutation = useMutation({
    mutationFn: () => {
      let parsedContent: Record<string, unknown> | undefined
      if (contentJson.trim()) {
        try {
          parsedContent = JSON.parse(contentJson)
        } catch {
          setJsonError('Content JSON must be valid JSON.')
          throw new Error('invalid json')
        }
      }
      setJsonError(null)
      return updateActivity(activityId ?? '', {
        name: name.trim(),
        summary: summary.trim(),
        tags,
        content_json: parsedContent,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['activity', activityId] })
    },
  })

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags((prev) => [...prev, trimmed])
    setTagInput('')
  }

  if (activityQuery.isLoading) {
    return <Text>Loading activity…</Text>
  }

  if (activityQuery.isError || !activityQuery.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Unable to load activity.</AlertDescription>
      </Alert>
    )
  }

  const activity = activityQuery.data

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading size="lg">{activity.name}</Heading>
        <Text color="gray.600">Type: {activity.type}</Text>
      </Stack>

      <Card>
        <CardHeader>
          <Heading size="sm">Edit activity</Heading>
          <Text fontSize="sm" color="gray.500">
            Update details to keep recommendations aligned with class needs.
          </Text>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Summary</FormLabel>
              <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
                <Input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button onClick={handleAddTag} isDisabled={!tagInput.trim()}>
                  Add tag
                </Button>
              </Stack>
              <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                {tags.map((tag) => (
                  <Tag key={tag} colorScheme="purple" borderRadius="full">
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => setTags(tags.filter((t) => t !== tag))} />
                  </Tag>
                ))}
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>Content JSON</FormLabel>
              <Textarea
                minH="200px"
                fontFamily="mono"
                value={contentJson}
                onChange={(event) => {
                  setContentJson(event.target.value)
                  if (jsonError) setJsonError(null)
                }}
              />
            </FormControl>
            {jsonError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{jsonError}</AlertDescription>
              </Alert>
            ) : null}
            {mutation.error instanceof ApiError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            ) : null}
            <Button
              colorScheme="brand"
              onClick={() => mutation.mutate()}
              isLoading={mutation.isPending}
              isDisabled={!name.trim() || !summary.trim()}
            >
              Save changes
            </Button>
          </Stack>
        </CardBody>
      </Card>

      <Button variant="outline" onClick={() => navigate('/teacher/activities')}>
        Back to activity library
      </Button>
    </Stack>
  )
}
