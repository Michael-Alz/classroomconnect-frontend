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
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  Wrap,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { createActivity, listActivityTypes } from '../../api/activities'
import { ApiError } from '../../api/client'

export function TeacherActivityCreatePage() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [summary, setSummary] = useState('')
  const [typeName, setTypeName] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [tagsInput, setTagsInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const activityTypesQuery = useQuery({
    queryKey: ['activityTypes'],
    queryFn: listActivityTypes,
  })

  const selectedType = useMemo(
    () => activityTypesQuery.data?.find((item) => item.type_name === typeName),
    [activityTypesQuery.data, typeName],
  )

  const createMutation = useMutation({
    mutationFn: () =>
      createActivity({
        name,
        summary,
        type: typeName,
        tags,
        content_json: Object.fromEntries(
          Object.entries(fieldValues).filter(([, value]) => value && value.trim()),
        ),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      setName('')
      setSummary('')
      setTypeName('')
      setFieldValues({})
      setTags([])
      setTagsInput('')
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createMutation.mutate()
  }

  const handleAddTag = () => {
    const trimmed = tagsInput.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags((prev) => [...prev, trimmed])
    setTagsInput('')
  }

  return (
    <Card>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="md">Create activity</Heading>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Summary</FormLabel>
            <Textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Activity type</FormLabel>
            <Select
              placeholder="Select a type"
              value={typeName}
              onChange={(event) => setTypeName(event.target.value)}
            >
              {activityTypesQuery.data?.map((type) => (
                <option key={type.type_name} value={type.type_name}>
                  {type.type_name}
                </option>
              ))}
            </Select>
            <Button
              as={RouterLink}
              to="/teacher/activity-types/new"
              variant="link"
              colorScheme="purple"
              size="sm"
              mt={2}
            >
              Missing a type? Create one
            </Button>
          </FormControl>

          {selectedType ? (
            <Stack spacing={3}>
              {[...selectedType.required_fields, ...selectedType.optional_fields].map((field) => (
                <FormControl key={field} isRequired={selectedType.required_fields.includes(field)}>
                  <FormLabel textTransform="capitalize">{field.replaceAll('_', ' ')}</FormLabel>
                  <Input
                    value={fieldValues[field] ?? ''}
                    onChange={(event) =>
                      setFieldValues((prev) => ({ ...prev, [field]: event.target.value }))
                    }
                  />
                </FormControl>
              ))}
            </Stack>
          ) : null}

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
              <Input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Add a tag"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button onClick={handleAddTag} isDisabled={!tagsInput.trim()}>
                Add tag
              </Button>
            </Stack>
            <Wrap mt={2}>
              {tags.map((tag) => (
                <Tag key={tag} colorScheme="purple" borderRadius="full">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} />
                </Tag>
              ))}
            </Wrap>
          </FormControl>

          {createMutation.error instanceof ApiError ? (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{createMutation.error.message}</AlertDescription>
            </Alert>
          ) : null}

            <Button
              type="submit"
              colorScheme="purple"
              isLoading={createMutation.isPending}
              isDisabled={!name.trim() || !summary.trim() || !typeName}
            >
              Save activity
            </Button>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  )
}
