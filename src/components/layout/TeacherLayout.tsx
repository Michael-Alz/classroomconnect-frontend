import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

interface SectionLink {
  label: string
  to: string
  excludePrefixes?: string[]
}

interface Section {
  title: string
  links: SectionLink[]
}

const sections: Section[] = [
  {
    title: 'Courses',
    links: [{ label: 'Courses overview', to: '/teacher/courses' }],
  },
  {
    title: 'Surveys',
    links: [
      {
        label: 'Survey templates',
        to: '/teacher/surveys',
        excludePrefixes: ['/teacher/surveys/new'],
      },
      { label: 'Create survey', to: '/teacher/surveys/new' },
    ],
  },
  {
    title: 'Sessions',
    links: [
      {
        label: 'Session library',
        to: '/teacher/sessions',
        excludePrefixes: ['/teacher/sessions/new'],
      },
      { label: 'Launch session', to: '/teacher/sessions/new' },
    ],
  },
  {
    title: 'Activities',
    links: [
      {
        label: 'Activity library',
        to: '/teacher/activities',
        excludePrefixes: ['/teacher/activities/new'],
      },
      { label: 'Create activity', to: '/teacher/activities/new' },
      {
        label: 'Activity types',
        to: '/teacher/activity-types',
        excludePrefixes: ['/teacher/activity-types/new'],
      },
      { label: 'Create activity type', to: '/teacher/activity-types/new' },
    ],
  },
]

export function TeacherLayout() {
  const location = useLocation()

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
      <Card
        flexShrink={0}
        minW={{ base: '100%', lg: '280px' }}
        position={{ base: 'relative', lg: 'sticky' }}
        top={{ lg: 4 }}
        height="fit-content"
      >
        <CardBody>
          <Heading size="sm" mb={4}>
            Teacher Tools
          </Heading>
          <Stack spacing={6}>
            {sections.map((section) => (
              <Box key={section.title}>
                <Heading size="xs" textTransform="uppercase" color="gray.500" mb={2}>
                  {section.title}
                </Heading>
                <Stack spacing={2}>
                  {section.links.map((link) => {
                    const excludes = link.excludePrefixes ?? []
                    const isExcluded = excludes.some((prefix) =>
                      location.pathname.startsWith(prefix),
                    )
                    const isBaseMatch =
                      location.pathname === link.to ||
                      location.pathname.startsWith(`${link.to}/`)
                    const isActive = !isExcluded && isBaseMatch
                    return (
                      <Button
                        key={link.to}
                        as={NavLink}
                        to={link.to}
                        justifyContent="flex-start"
                        variant={isActive ? 'solid' : 'ghost'}
                        colorScheme={isActive ? 'brand' : undefined}
                        size="sm"
                      >
                        {link.label}
                      </Button>
                    )
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card>
      <Box flex="1">
        <Stack spacing={4}>
          <Text fontSize="sm" color="gray.500" display={{ base: 'none', lg: 'block' }}>
            Use the grouped navigation to move through the course, survey, activity, and session
            workflows.
          </Text>
          <Outlet />
        </Stack>
      </Box>
    </Flex>
  )
}
