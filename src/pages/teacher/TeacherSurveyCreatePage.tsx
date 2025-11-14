// src/pages/teacher/TeacherSurveyCreatePage.tsx
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  Divider,
  Flex,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { FiArrowLeft, FiCheckCircle, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSurvey } from '../../api/surveys'
import { ApiError } from '../../api/client'

const styleKeys = ['visual', 'auditory', 'kinesthetic'] as const

interface OptionForm {
  label: string
  scores: Record<string, number | ''>
}

interface QuestionForm {
  text: string
  options: OptionForm[]
}

function createEmptyOption(): OptionForm {
  return { label: '', scores: { visual: 0, auditory: 0, kinesthetic: 0 } }
}

function createEmptyQuestion(): QuestionForm {
  return { text: '', options: [createEmptyOption(), createEmptyOption()] }
}

const STYLE_CONFIG = {
  visual: { color: 'purple', icon: '👁️', label: 'Visual' },
  auditory: { color: 'blue', icon: '👂', label: 'Auditory' },
  kinesthetic: { color: 'green', icon: '✋', label: 'Kinesthetic' },
}

export function TeacherSurveyCreatePage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<QuestionForm[]>([createEmptyQuestion()])

  const surveyMutation = useMutation({
    mutationFn: () =>
      createSurvey({
        title,
        questions: questions.map((question, idx) => ({
          id: `q${idx + 1}`,
          text: question.text,
          options: question.options.map((option) => {
            const scores = Object.fromEntries(
              Object.entries(option.scores).map(([key, value]) => [
                key,
                Number(value) || 0,
              ]),
            )
            const trimmedScores = Object.fromEntries(
              Object.entries(scores).filter(([, value]) => value !== 0),
            )
            return {
              label: option.label,
              scores: Object.keys(trimmedScores).length ? trimmedScores : scores,
            }
          }),
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] })
      navigate('/teacher/surveys')
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    surveyMutation.mutate()
  }

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleAddOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === questionIndex
          ? { ...question, options: [...question.options, createEmptyOption()] }
          : question,
      ),
    )
  }

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === questionIndex
          ? { ...question, options: question.options.filter((_, optIdx) => optIdx !== optionIndex) }
          : question,
      ),
    )
  }

  const totalQuestions = questions.length
  const totalOptions = questions.reduce((sum, q) => sum + q.options.length, 0)

  return (
    <Stack spacing={8}>
      {/* Header */}
      <Box>
        <Button
          leftIcon={<Icon as={FiArrowLeft} />}
          variant="ghost"
          onClick={() => navigate('/teacher/surveys')}
          mb={4}
          fontWeight="600"
        >
          Back to Templates
        </Button>

        <HStack spacing={4} align="flex-start">
          <Box
            bgGradient="linear(135deg, brand.400, brand.600)"
            color="white"
            p={4}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Icon as={FiPlus} boxSize={8} />
          </Box>
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg" fontWeight="800">
              Create Survey Template
            </Heading>
            <HStack spacing={4} fontSize="sm" color="gray.600" fontWeight="600">
              <HStack>
                <Icon as={FiCheckCircle} />
                <Text>{totalQuestions} Questions</Text>
              </HStack>
              <HStack>
                <Icon as={FiCheckCircle} />
                <Text>{totalOptions} Options</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>

      {/* Main Form */}
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing={6}>
          {/* Survey Title Card */}
          <Card borderRadius="2xl" border="2px solid" borderColor="gray.100" boxShadow="xl">
            <CardBody p={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="700" fontSize="lg" mb={3}>
                  Survey Title
                </FormLabel>
                <Input
                  placeholder="e.g., Learning Style Assessment"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  size="lg"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'brand.300' }}
                  _focus={{
                    borderColor: 'brand.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
                  }}
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* Questions */}
          <Stack spacing={5}>
            {questions.map((question, questionIndex) => (
              <Card
                key={questionIndex}
                borderRadius="2xl"
                border="2px solid"
                borderColor="brand.100"
                boxShadow="lg"
                bg="white"
              >
                <CardBody p={6}>
                  <Stack spacing={5}>
                    {/* Question Header */}
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Badge
                          colorScheme="brand"
                          fontSize="md"
                          px={4}
                          py={2}
                          borderRadius="full"
                          fontWeight="700"
                        >
                          Question {questionIndex + 1}
                        </Badge>
                        <Text fontSize="sm" color="gray.500" fontWeight="600">
                          {question.options.length} options
                        </Text>
                      </HStack>
                      {questions.length > 1 && (
                        <IconButton
                          aria-label="Remove question"
                          icon={<Icon as={FiTrash2} />}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveQuestion(questionIndex)}
                          borderRadius="xl"
                        />
                      )}
                    </Flex>

                    {/* Question Text Input */}
                    <FormControl isRequired>
                      <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                        Question Text
                      </FormLabel>
                      <Input
                        placeholder="e.g., How do you prefer to learn new concepts?"
                        value={question.text}
                        onChange={(event) =>
                          setQuestions((prev) =>
                            prev.map((item, idx) =>
                              idx === questionIndex ? { ...item, text: event.target.value } : item,
                            ),
                          )
                        }
                        size="lg"
                        borderRadius="xl"
                        border="2px solid"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'brand.300' }}
                        _focus={{
                          borderColor: 'brand.400',
                          boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
                        }}
                      />
                    </FormControl>

                    <Divider />

                    {/* Options */}
                    <VStack align="stretch" spacing={4}>
                      <Text fontWeight="700" fontSize="sm" color="gray.700">
                        Answer Options
                      </Text>
                      {question.options.map((option, optionIndex) => (
                        <Card
                          key={optionIndex}
                          bg="gray.50"
                          borderRadius="xl"
                          border="2px solid"
                          borderColor="gray.100"
                        >
                          <CardBody p={4}>
                            <Stack spacing={4}>
                              {/* Option Header */}
                              <Flex justify="space-between" align="center">
                                <Text fontWeight="700" fontSize="sm" color="gray.700">
                                  Option {optionIndex + 1}
                                </Text>
                                {question.options.length > 2 && (
                                  <IconButton
                                    aria-label="Remove option"
                                    icon={<Icon as={FiTrash2} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                  />
                                )}
                              </Flex>

                              {/* Option Label */}
                              <Input
                                placeholder="e.g., By reading and taking notes"
                                value={option.label}
                                onChange={(event) =>
                                  setQuestions((prev) =>
                                    prev.map((item, idx) =>
                                      idx === questionIndex
                                        ? {
                                            ...item,
                                            options: item.options.map((opt, optIdx) =>
                                              optIdx === optionIndex
                                                ? { ...opt, label: event.target.value }
                                                : opt,
                                            ),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                borderRadius="lg"
                                bg="white"
                                border="2px solid"
                                borderColor="gray.200"
                                _hover={{ borderColor: 'gray.300' }}
                              />

                              {/* Learning Style Scores */}
                              <VStack align="stretch" spacing={3}>
                                <Text fontSize="xs" fontWeight="700" color="gray.600" textTransform="uppercase">
                                  Learning Style Scores
                                </Text>
                                <HStack spacing={3}>
                                  {styleKeys.map((key) => {
                                    const config = STYLE_CONFIG[key]
                                    return (
                                      <VStack key={key} flex={1} align="stretch" spacing={1}>
                                        <HStack spacing={1} fontSize="xs" color="gray.600" fontWeight="600">
                                          <Text>{config.icon}</Text>
                                          <Text>{config.label}</Text>
                                        </HStack>
                                        <NumberInput
                                          min={0}
                                          max={10}
                                          value={option.scores[key] ?? 0}
                                          onChange={(_, valueNumber) =>
                                            setQuestions((prev) =>
                                              prev.map((item, idx) =>
                                                idx === questionIndex
                                                  ? {
                                                      ...item,
                                                      options: item.options.map((opt, optIdx) =>
                                                        optIdx === optionIndex
                                                          ? {
                                                              ...opt,
                                                              scores: {
                                                                ...opt.scores,
                                                                [key]: valueNumber,
                                                              },
                                                            }
                                                          : opt,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                        >
                                          <NumberInputField
                                            placeholder="0"
                                            borderRadius="lg"
                                            bg="white"
                                            border="2px solid"
                                            borderColor="gray.200"
                                            textAlign="center"
                                            fontWeight="700"
                                            _hover={{ borderColor: `${config.color}.300` }}
                                            _focus={{
                                              borderColor: `${config.color}.400`,
                                              boxShadow: `0 0 0 1px var(--chakra-colors-${config.color}-400)`,
                                            }}
                                          />
                                        </NumberInput>
                                      </VStack>
                                    )
                                  })}
                                </HStack>
                              </VStack>
                            </Stack>
                          </CardBody>
                        </Card>
                      ))}

                      {/* Add Option Button */}
                      <Button
                        leftIcon={<Icon as={FiPlus} />}
                        variant="outline"
                        onClick={() => handleAddOption(questionIndex)}
                        borderRadius="xl"
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor="brand.200"
                        color="brand.600"
                        _hover={{
                          bg: 'brand.50',
                          borderColor: 'brand.400',
                        }}
                        size="lg"
                        fontWeight="600"
                      >
                        Add Answer Option
                      </Button>
                    </VStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}

            {/* Add Question Button */}
            <Button
              leftIcon={<Icon as={FiPlus} />}
              onClick={handleAddQuestion}
              size="lg"
              borderRadius="xl"
              borderWidth="2px"
              borderStyle="dashed"
              variant="outline"
              borderColor="accent.200"
              color="accent.600"
              _hover={{
                bg: 'accent.50',
                borderColor: 'accent.400',
              }}
              fontWeight="600"
            >
              Add Question
            </Button>
          </Stack>

          {/* Error Alert */}
          {surveyMutation.error instanceof ApiError && (
            <Alert
              status="error"
              borderRadius="xl"
              bg="red.50"
              border="2px solid"
              borderColor="red.200"
            >
              <AlertIcon color="red.500" />
              <AlertDescription color="red.700" fontWeight="600">
                {surveyMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <HStack spacing={4} justify="flex-end" pt={4}>
            <Button
              variant="outline"
              onClick={() => navigate('/teacher/surveys')}
              size="lg"
              borderRadius="xl"
              fontWeight="600"
              borderWidth="2px"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={surveyMutation.isPending}
              isDisabled={!title.trim() || questions.some(q => !q.text.trim())}
              size="lg"
              borderRadius="xl"
              fontWeight="600"
              px={8}
              leftIcon={<Icon as={FiCheckCircle} />}
            >
              Save Survey Template
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  )
}