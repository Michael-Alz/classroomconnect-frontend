import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Button,
  Card,
  CardBody,
  Box,
  Heading,
  Input,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getStudentProfile, getStudentSubmissions } from '../../api/students'
import { getJoinSession } from '../../api/public'
import { ApiError } from '../../api/client'

export function StudentDashboardPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const tabIndex =
    initialTab === 'history' ? 1 : initialTab === 'join' ? 2 : 0
  const [token, setToken] = useState('')

  const profileQuery = useQuery({
    queryKey: ['studentProfile'],
    queryFn: getStudentProfile,
  })

  const submissionsQuery = useQuery({
    queryKey: ['studentSubmissions'],
    queryFn: getStudentSubmissions,
  })

  const joinMutation = useMutation({
    mutationFn: (joinToken: string) => getJoinSession(joinToken),
    onSuccess: (_, joinToken) => {
      navigate(`/session/run/${joinToken}`)
    },
  })

  const handleJoinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token.trim()) return
    joinMutation.mutate(token.trim())
  }

  const handleTabChange = (index: number) => {
    const tabValue = index === 1 ? 'history' : index === 2 ? 'join' : null
    if (tabValue) {
      setSearchParams({ tab: tabValue })
    } else {
      setSearchParams({})
    }
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Tabs
      index={tabIndex}
      onChange={handleTabChange}
      variant="enclosed"
      borderRadius="xl"
      bg="white"
      boxShadow="lg"
      p={{ base: 4, md: 6 }}
    >
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Submission history</Tab>
        <Tab>Join session</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {profileQuery.isLoading ? (
            <Spinner />
          ) : profileQuery.data ? (
            <Card maxW="lg">
              <CardBody>
                <Stack spacing={2}>
                  <Heading size="md">Your profile</Heading>
                  <Text>
                    <strong>ID:</strong> {profileQuery.data.id}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {profileQuery.data.email}
                  </Text>
                  <Text>
                    <strong>Name:</strong> {profileQuery.data.full_name}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                Unable to load your profile. Please refresh the page.
              </AlertDescription>
            </Alert>
          )}
        </TabPanel>
        <TabPanel>
          {submissionsQuery.isLoading ? (
            <Spinner />
          ) : submissionsQuery.data ? (
            isMobile ? (
              <Stack spacing={4}>
                {submissionsQuery.data.submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardBody>
                      <Stack spacing={2}>
                        <Heading size="sm">{submission.course_title}</Heading>
                        <Text fontSize="sm" color="gray.500">
                          Session: {submission.session_id}
                        </Text>
                        <Badge>{submission.status}</Badge>
                        <Text fontSize="sm">
                          Answers: {JSON.stringify(submission.answers)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Submitted at: {new Date(submission.created_at).toLocaleString()}
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Course</Th>
                    <Th>Session</Th>
                    <Th>Answers</Th>
                    <Th>Status</Th>
                    <Th>Submitted at</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {submissionsQuery.data.submissions.map((submission) => (
                    <Tr key={submission.id}>
                      <Td>{submission.course_title}</Td>
                      <Td>{submission.session_id}</Td>
                      <Td>
                        <Text fontSize="sm">{JSON.stringify(submission.answers)}</Text>
                      </Td>
                      <Td>
                        <Badge>{submission.status}</Badge>
                      </Td>
                      <Td>
                        {new Date(submission.created_at).toLocaleString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                Unable to load submissions. Please try again later.
              </AlertDescription>
            </Alert>
          )}
        </TabPanel>
        <TabPanel>
          <Card maxW="lg">
            <CardBody>
              <Box as="form" onSubmit={handleJoinSubmit}>
                <Stack spacing={4}>
                  <Heading size="md">Join with token</Heading>
                  <Input
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="Enter token from your teacher"
                  />
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      flex="1"
                      isDisabled={!token.trim()}
                      isLoading={joinMutation.isPending}
                    >
                      Join session
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/scan')}>
                      Scan QR to join
                    </Button>
                  </Stack>
                  {joinMutation.error instanceof ApiError || joinMutation.isError ? (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription>
                        {joinMutation.error instanceof ApiError
                          ? joinMutation.error.message
                          : 'Unable to find the session. Please check the token.'}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </Stack>
              </Box>
            </CardBody>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
