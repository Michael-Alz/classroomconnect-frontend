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
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createSurvey } from '../../api/surveys'
import { ApiError } from '../../api/client'

const styleKeys = ['visual', 'auditory', 'kinesthetic']

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

export function TeacherSurveyCreatePage() {
  const queryClient = useQueryClient()
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
      setTitle('')
      setQuestions([createEmptyQuestion()])
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

  return (
    <Card>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Heading size="md">Create survey</Heading>
            <Input
              placeholder="Survey title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Stack spacing={4}>
              {questions.map((question, questionIndex) => (
              <Box key={questionIndex} borderWidth="1px" borderRadius="md" p={4}>
                <Stack spacing={3}>
                  <Stack direction="row" justify="space-between" align="center">
                    <Heading size="sm">Question {questionIndex + 1}</Heading>
                    {questions.length > 1 ? (
                      <IconButton
                        aria-label="Remove question"
                        icon={<DeleteIcon />}
                        size="sm"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                      />
                    ) : null}
                  </Stack>
                  <Input
                    placeholder="Question text"
                    value={question.text}
                    onChange={(event) =>
                      setQuestions((prev) =>
                        prev.map((item, idx) =>
                          idx === questionIndex ? { ...item, text: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Stack spacing={3}>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} borderWidth="1px" borderRadius="md" p={3}>
                        <Stack spacing={2}>
                          <Stack direction="row" justify="space-between" align="center">
                            <Text fontWeight="bold">Option {optionIndex + 1}</Text>
                            {question.options.length > 1 ? (
                              <IconButton
                                aria-label="Remove option"
                                icon={<DeleteIcon />}
                                size="xs"
                                onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                              />
                            ) : null}
                          </Stack>
                          <Input
                            placeholder="Option label"
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
                          />
                          <Stack direction={{ base: 'column', sm: 'row' }} spacing={2}>
                            {styleKeys.map((key) => (
                              <NumberInput
                                key={key}
                                min={0}
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
                                <NumberInputField placeholder={`${key} score`} />
                              </NumberInput>
                            ))}
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                    <Button
                      leftIcon={<AddIcon />}
                      variant="outline"
                      onClick={() => handleAddOption(questionIndex)}
                    >
                      Add option
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
            <Button leftIcon={<AddIcon />} onClick={handleAddQuestion}>
              Add question
            </Button>
          </Stack>

          {surveyMutation.error instanceof ApiError ? (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{surveyMutation.error.message}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            colorScheme="purple"
            isLoading={surveyMutation.isPending}
            isDisabled={!title.trim()}
          >
            Save survey
          </Button>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  )
}
