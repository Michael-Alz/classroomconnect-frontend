import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  useBreakpointValue,
  useToken,
} from '@chakra-ui/react'
import { Link as RouterLink, Outlet } from 'react-router-dom'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentProfile } from '../../api/students'

interface NavItem {
  label: string
  to: string
}

export function AppLayout() {
  const { role, isTeacher, isStudent, logout } = useAuth()
  const studentProfileQuery = useQuery({
    queryKey: ['studentProfile'],
    queryFn: getStudentProfile,
    enabled: isStudent,
  })
  const mobileNav = useDisclosure()

  const navItems = useMemo<NavItem[]>(() => {
    if (isTeacher) {
      return [
        { label: 'Courses', to: '/teacher/courses' },
        { label: 'New Survey', to: '/teacher/surveys/new' },
        { label: 'New Activity', to: '/teacher/activities/new' },
        { label: 'New Session', to: '/teacher/sessions/new' },
      ]
    }
    if (isStudent) {
      return [
        { label: 'Dashboard', to: '/student' },
        { label: 'Join Session', to: '/student?tab=join' },
        { label: 'Scan QR', to: '/scan' },
      ]
    }
    return [
      { label: 'Home', to: '/' },
      { label: 'Teacher Login', to: '/login/teacher' },
      { label: 'Student Login', to: '/login/student' },
      { label: 'Guest Join', to: '/guest/join' },
    ]
  }, [isStudent, isTeacher])

  const showLogout = Boolean(role)
  const navSpacing = useBreakpointValue({ base: 2, md: 4 })
  const [gradientTop, gradientBottom] = useToken('surfaces', [
    'gradientTop',
    'gradientBottom',
  ])

  return (
    <Box minH="100vh" bgGradient={`linear(to-b, ${gradientTop}, ${gradientBottom})`}>
      <Box
        position="sticky"
        top="0"
        zIndex="10"
        bg="rgba(255, 255, 255, 0.92)"
        borderBottomWidth="1px"
        backdropFilter="blur(10px)"
      >
        <Container maxW="6xl" py={3}>
          <Flex align="center" justify="space-between">
            <RouterLink to="/">
              <Text fontSize="xl" fontWeight="bold">
                ClassConnect
              </Text>
            </RouterLink>
            <HStack spacing={navSpacing} display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  variant="ghost"
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
              {showLogout ? (
                <Button size="sm" variant="solid" colorScheme="red" onClick={logout}>
                  Logout
                </Button>
              ) : null}
              {isStudent && studentProfileQuery.data ? (
                <Text fontSize="sm" color="gray.600">
                  {studentProfileQuery.data.full_name}
                </Text>
              ) : null}
            </HStack>
            <IconButton
              aria-label="Toggle navigation"
              icon={mobileNav.isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="ghost"
              display={{ base: 'inline-flex', md: 'none' }}
              onClick={mobileNav.onToggle}
            />
          </Flex>
          {mobileNav.isOpen ? (
            <Stack spacing={2} mt={4} pb={4} display={{ md: 'none' }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  as={RouterLink}
                  to={item.to}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={mobileNav.onClose}
                >
                  {item.label}
                </Button>
              ))}
              {isStudent && studentProfileQuery.data ? (
                <Text fontSize="sm" color="gray.600">
                  {studentProfileQuery.data.full_name}
                </Text>
              ) : null}
              {showLogout ? (
                <Button variant="outline" colorScheme="red" onClick={logout}>
                  Logout
                </Button>
              ) : null}
            </Stack>
          ) : null}
        </Container>
      </Box>
      <Box as="main" py={{ base: 8, md: 12 }}>
        <Container maxW="6xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
