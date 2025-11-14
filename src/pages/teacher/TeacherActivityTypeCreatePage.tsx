// src/pages/teacher/TeacherActivityTypeCreatePage.tsx
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
  HStack,
  VStack,
  Icon,
  Badge,
  Text,
  Divider,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiLayers,
  FiCheckCircle,
  FiPlus,
  FiCode,
  FiAlertCircle,
  FiList,
} from 'react-icons/fi'
import { createActivityType } from '../../api/activities'
import { ApiError } from '../../api/client'

function createEmptyField() {
  return ''
}

export function TeacherActivityTypeCreatePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
      navigate('/teacher/activities/new')
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
    isRequired: boolean,
    color: string,
  ) => (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <HStack spacing={2}>
          <Icon as={FiList} boxSize={5} color={`${color}.500`} />
          <Text fontWeight="700" fontSize="md">
            {label}
          </Text>
        </HStack>
        <Badge
          colorScheme={isRequired ? 'red' : 'gray'}
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          {values.filter((v) => v.trim()).length} field{values.filter((v) => v.trim()).length !== 1 ? 's' : ''}
        </Badge>
      </HStack>

      <Stack spacing={3}>
        {values.map((value, index) => (
          <HStack key={index} spacing={3}>
            <Input
              value={value}
              onChange={(event) =>
                setValues(values.map((item, idx) => (idx === index ? event.target.value : item)))
              }
              placeholder={`e.g., ${isRequired ? 'duration_minutes' : 'difficulty_level'}`}
              size="lg"
              borderRadius="xl"
              border="2px solid"
              borderColor="gray.200"
              _hover={{ borderColor: `${color}.300` }}
              _focus={{
                borderColor: `${color}.400`,
                boxShadow: `0 0 0 1px var(--chakra-colors-${color}-400)`,
              }}
            />
            {values.length > 1 && (
              <IconButton
                aria-label="Remove field"
                icon={<DeleteIcon />}
                size="lg"
                variant="ghost"
                colorScheme="red"
                onClick={() => setValues(values.filter((_, idx) => idx !== index))}
                borderRadius="xl"
              />
            )}
          </HStack>
        ))}
        <Button
          leftIcon={<Icon as={FiPlus} />}
          onClick={() => setValues([...values, createEmptyField()])}
          variant="outline"
          colorScheme={color}
          borderRadius="xl"
          borderWidth="2px"
          borderStyle="dashed"
          size="lg"
          fontWeight="600"
        >
          Add {isRequired ? 'Required' : 'Optional'} Field
        </Button>
      </Stack>
    </VStack>
  )

  const totalFields =
    requiredFields.filter((f) => f.trim()).length + optionalFields.filter((f) => f.trim()).length

  return (
    <Stack spacing={8}>
      {/* Header */}
      <Box>
        <Button
          leftIcon={<Icon as={FiArrowLeft} />}
          variant="ghost"
          onClick={() => navigate('/teacher/activities/new')}
          mb={4}
          fontWeight="600"
        >
          Back to Create Activity
        </Button>

        <HStack spacing={4} align="flex-start">
          <Box
            bgGradient="linear(135deg, purple.400, purple.600)"
            color="white"
            p={4}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Icon as={FiLayers} boxSize={8} />
          </Box>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg" fontWeight="800">
              Create Activity Type
            </Heading>
            <Text color="gray.600" fontSize="md">
              Define a new template structure for activities
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Main Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing={6}>
          {/* Basic Information Card */}
          <Card borderRadius="2xl" border="2px solid" borderColor="gray.100" boxShadow="xl">
            <CardBody p={6}>
              <VStack align="stretch" spacing={5}>
                <HStack spacing={3}>
                  <Icon as={FiCheckCircle} boxSize={6} color="purple.500" />
                  <Heading size="md" fontWeight="700">
                    Type Details
                  </Heading>
                  <Badge colorScheme="red" fontSize="xs" px={2} py={1} borderRadius="full">
                    Required
                  </Badge>
                </HStack>

                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                      Type Name
                    </FormLabel>
                    <Input
                      value={typeName}
                      onChange={(event) => setTypeName(event.target.value)}
                      placeholder="e.g., Video Lesson, Reading Assignment"
                      size="lg"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{
                        borderColor: 'purple.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                      }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                      Description
                    </FormLabel>
                    <Textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Describe what this activity type is used for..."
                      rows={3}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{
                        borderColor: 'purple.400',
                        boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
                      }}
                    />
                  </FormControl>
                </Stack>
              </VStack>
            </CardBody>
          </Card>

          {/* Required Fields Card */}
          <Card borderRadius="2xl" border="2px solid" borderColor="red.100" boxShadow="xl">
            <CardBody p={6}>
              <VStack align="stretch" spacing={5}>
                <Box
                  p={4}
                  bg="red.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="red.100"
                >
                  <HStack spacing={3} align="start">
                    <Icon as={FiAlertCircle} color="red.500" boxSize={5} mt={0.5} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="700" color="red.900">
                        Required Fields
                      </Text>
                      <Text fontSize="sm" color="red.800">
                        These fields must be filled when creating an activity of this type
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {renderFieldList(
                  'Required Fields',
                  requiredFields,
                  setRequiredFields,
                  true,
                  'red',
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Optional Fields Card */}
          <Card borderRadius="2xl" border="2px solid" borderColor="gray.100" boxShadow="xl">
            <CardBody p={6}>
              <VStack align="stretch" spacing={5}>
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blue.100"
                >
                  <HStack spacing={3} align="start">
                    <Icon as={FiAlertCircle} color="blue.500" boxSize={5} mt={0.5} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="700" color="blue.900">
                        Optional Fields
                      </Text>
                      <Text fontSize="sm" color="blue.800">
                        These fields can be left empty when creating an activity
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {renderFieldList(
                  'Optional Fields',
                  optionalFields,
                  setOptionalFields,
                  false,
                  'blue',
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Example JSON Card */}
          <Card borderRadius="2xl" border="2px solid" borderColor="gray.100" boxShadow="xl">
            <CardBody p={6}>
              <VStack align="stretch" spacing={5}>
                <HStack spacing={3}>
                  <Icon as={FiCode} boxSize={6} color="accent.500" />
                  <Heading size="md" fontWeight="700">
                    Example JSON
                  </Heading>
                  <Badge colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="full">
                    Optional
                  </Badge>
                </HStack>

                <Box
                  p={4}
                  bg="accent.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="accent.100"
                >
                  <HStack spacing={3} align="start">
                    <Icon as={FiAlertCircle} color="accent.500" boxSize={5} mt={0.5} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="700" color="accent.900">
                        Sample Structure
                      </Text>
                      <Text fontSize="sm" color="accent.800">
                        Provide an example of how the JSON content should look
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                <FormControl>
                  <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                    Example Content JSON
                  </FormLabel>
                  <Textarea
                    value={exampleJson}
                    placeholder='{"duration_minutes": 5, "difficulty": "medium"}'
                    onChange={(event) => {
                      setExampleJson(event.target.value)
                      if (jsonError) setJsonError(null)
                    }}
                    minH="150px"
                    fontFamily="mono"
                    fontSize="sm"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={jsonError ? 'red.300' : 'gray.200'}
                    bg="gray.50"
                    _hover={{ borderColor: jsonError ? 'red.400' : 'accent.300' }}
                    _focus={{
                      borderColor: jsonError ? 'red.400' : 'accent.400',
                      boxShadow: `0 0 0 1px var(--chakra-colors-${jsonError ? 'red' : 'accent'}-400)`,
                    }}
                  />
                </FormControl>

                {jsonError && (
                  <Alert
                    status="error"
                    borderRadius="xl"
                    bg="red.50"
                    border="2px solid"
                    borderColor="red.200"
                  >
                    <AlertIcon color="red.500" />
                    <AlertDescription color="red.700" fontWeight="600">
                      {jsonError}
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Error Alert */}
          {mutation.error instanceof ApiError && (
            <Alert
              status="error"
              borderRadius="xl"
              bg="red.50"
              border="2px solid"
              borderColor="red.200"
            >
              <AlertIcon color="red.500" />
              <AlertDescription color="red.700" fontWeight="600">
                {mutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <Card
            borderRadius="2xl"
            bgGradient="linear(135deg, purple.50, accent.50)"
            border="2px solid"
            borderColor="purple.100"
          >
            <CardBody p={6}>
              <VStack spacing={4}>
                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="700" color="gray.800">
                    Ready to create?
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    {totalFields > 0
                      ? `This type will have ${totalFields} field${totalFields !== 1 ? 's' : ''}`
                      : 'Add at least one field to get started'}
                  </Text>
                </VStack>

                <HStack spacing={4} w="full">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/teacher/activities/new')}
                    size="lg"
                    borderRadius="xl"
                    fontWeight="600"
                    borderWidth="2px"
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    leftIcon={<Icon as={FiCheckCircle} />}
                    colorScheme="purple"
                    isLoading={mutation.isPending}
                    loadingText="Creating..."
                    isDisabled={!typeName.trim() || !description.trim()}
                    size="lg"
                    borderRadius="xl"
                    fontWeight="600"
                    flex={2}
                  >
                    Create Type
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Stack>
      </Box>
    </Stack>
  )
}