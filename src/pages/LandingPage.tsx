import {
  Button,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const CardLink = chakra(RouterLink)

export function LandingPage() {
  return (
    <Stack spacing={12}>
      <Stack
        spacing={6}
        align="flex-start"
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="3xl"
        boxShadow="2xl"
        bgGradient="linear(to-r, surfaces.sky, surfaces.sand)"
      >
        <Heading size={{ base: 'lg', md: 'xl' }}>
          A lightweight companion for live classroom engagement
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Teachers launch interactive sessions, students check in with mood + surveys, and everyone
          gets personalized activity recommendations in minutes.
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
          <Button as={RouterLink} to="/login/teacher">
            Teacher Dashboard
          </Button>
          <Button as={RouterLink} to="/login/student" variant="outline" colorScheme="accent">
            Student Portal
          </Button>
          <Button as={RouterLink} to="/guest/join" variant="ghost" colorScheme="purple">
            Join as Guest
          </Button>
        </Stack>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card height="100%" _hover={{ translateY: '-4px' }} transition="all 0.2s">
          <CardBody>
            <Stack spacing={4}>
              <Heading size="md">Teachers</Heading>
              <Text color="gray.600">
                Plan sessions, configure baseline surveys, and keep recommendations aligned with
                student moods and learning styles.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                <Button as={CardLink} to="/login/teacher">
                  Login
                </Button>
                <Button as={CardLink} to="/signup/teacher" variant="outline">
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
        <Card height="100%" _hover={{ translateY: '-4px' }} transition="all 0.2s">
          <CardBody>
            <Stack spacing={4}>
              <Heading size="md">Students &amp; Guests</Heading>
              <Text color="gray.600">
                Jump into sessions from any device, review past submissions, or scan a QR code to
                participate without logging in.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
                <Button as={CardLink} to="/login/student" colorScheme="accent">
                  Student Login
                </Button>
                <Button as={CardLink} to="/signup/student" variant="outline" colorScheme="accent">
                  Student Signup
                </Button>
                <Button as={CardLink} to="/guest/join" variant="ghost">
                  Join as Guest
                </Button>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
