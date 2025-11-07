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
  IconButton,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createActivityType } from '../../api/activities'
import { ApiError } from '../../api/client'

function createEmptyField() {
  return ''
}

export function TeacherActivityTypeCreatePage() {
  const queryClient = useQueryClient()
  const [typeName, setTypeName] = useState('')
  const [description, setDescription] = useState('')
  const [requiredFields, setRequiredFields] = useState([''])
  const [optionalFields, setOptionalFields] = useState([''])
  const [exampleJson, setExampleJson] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (examplePayload?: Record<string, unknown>) =>
      createActivityType({
        type_name: typeName,
        description,
        required_fields: requiredFields.filter((field) => field.trim()),
        optional_fields: optionalFields.filter((field) => field.trim()),
        example_content_json: examplePayload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityTypes'] })
      setTypeName('')
      setDescription('')
      setRequiredFields([''])
      setOptionalFields([''])
      setExampleJson('')
      setJsonError(null)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let parsedExample: Record<string, unknown> | undefined
    if (exampleJson) {
      try {
        parsedExample = JSON.parse(exampleJson)
      } catch {
        setJsonError('Example JSON must be valid JSON.')
        return
      }
    }
    setJsonError(null)
    mutation.mutate(parsedExample)
  }

  const renderFieldList = (
    label: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Stack spacing={2}>
        {values.map((value, index) => (
          <Stack key={index} direction="row" align="center">
            <Input
              value={value}
              onChange={(event) =>
                setValues(values.map((item, idx) => (idx === index ? event.target.value : item)))
              }
            />
            {values.length > 1 ? (
              <IconButton
                aria-label="Remove field"
                icon={<DeleteIcon />}
                size="sm"
                onClick={() => setValues(values.filter((_, idx) => idx !== index))}
              />
            ) : null}
          </Stack>
        ))}
        <Button
          leftIcon={<AddIcon />}
          onClick={() => setValues([...values, createEmptyField()])}
          variant="outline"
        >
          Add field
        </Button>
      </Stack>
    </FormControl>
  )

  return (
    <Card>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Heading size="md">Create activity type</Heading>
          <FormControl isRequired>
            <FormLabel>Type name</FormLabel>
            <Input value={typeName} onChange={(event) => setTypeName(event.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </FormControl>
          {renderFieldList('Required fields', requiredFields, setRequiredFields)}
          {renderFieldList('Optional fields', optionalFields, setOptionalFields)}
          <FormControl>
            <FormLabel>Example JSON (optional)</FormLabel>
            <Textarea
              value={exampleJson}
              placeholder='{"duration_minutes": 5}'
              onChange={(event) => {
                setExampleJson(event.target.value)
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
              type="submit"
              colorScheme="purple"
              isLoading={mutation.isPending}
              isDisabled={!typeName.trim() || !description.trim()}
            >
              Save activity type
            </Button>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  )
}
