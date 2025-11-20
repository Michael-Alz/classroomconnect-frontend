// src/pages/teacher/TeacherActivityTypesPage.tsx
import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Box,
  Badge,
  Flex,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  FiLayers,
  FiPlus,
  FiCheckCircle,
  FiList,
  FiEye,
} from 'react-icons/fi'
import { listActivityTypes } from '../../api/activities'

export function TeacherActivityTypesPage() {
  const navigate = useNavigate()
  const activityTypesQuery = useQuery({
    queryKey: ['activityTypes'],
    queryFn: listActivityTypes,
  })

  const totalTypes = activityTypesQuery.data?.length || 0

  return (
    <Stack spacing={8}>
      {/* Header */}
      <Box>
        <Heading size="lg" fontWeight="800" color="gray.800" mb={2}>
          Activity Types 
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Define templates to standardize activity creation
        </Text>
      </Box>

      {/* Stats Cards Row */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* Total Types Stat */}
        <Card
          borderRadius="xl"
          border="2px solid"
          borderColor="blue.100"
          bg="blue.50"
          overflow="hidden"
          position="relative"
        >
          <CardBody p={6}>
            <HStack spacing={4} align="flex-start">
              <Box
                bg="whiteAlpha.300"
                p={3}
                borderRadius="xl"
                backdropFilter="blur(10px)"
              >
                <Icon as={FiLayers} boxSize={6} color= "blue.500"/>
              </Box>
              <VStack align="flex-start" spacing={1}>
                <Text fontSize="sm" fontWeight="600" opacity={0.9}>
                  Total Types
                </Text>
                <Text fontSize="3xl" fontWeight="800">
                  {totalTypes}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

      
        
        {/* Create Type Action Card */}
        
      </SimpleGrid>

      {/* Types List */}
      <Card borderRadius="2xl" border="2px solid" borderColor="gray.100" boxShadow="xl">
        <CardBody p={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <HStack spacing={3}>
              <Icon as={FiLayers} boxSize={6} color="purple.500" />
              <Heading size="md" fontWeight="700">
                Your Templates
              </Heading>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                {totalTypes}
              </Badge>
            </HStack>
            <Button
              leftIcon={<Icon as={FiPlus} />}
              colorScheme="brand"
              onClick={() => navigate('/teacher/activity-types/new')}
              borderRadius="xl"
              fontWeight="600"
              display={{ base: 'none', md: 'flex' }}
            >
              New Type
            </Button>
          </Flex>

          {activityTypesQuery.isLoading ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500" fontSize="lg">
                Loading activity types...
              </Text>
            </Box>
          ) : activityTypesQuery.data?.length ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
              {activityTypesQuery.data.map((type) => (
                <Card
                  key={type.type_name}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{
                    borderColor: 'purple.400',
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                  onClick={() => navigate(`/teacher/activity-types/${type.type_name}`)}
                >
                  <CardBody p={5}>
                    <VStack align="stretch" spacing={4}>
                      {/* Icon and Title */}
                      <Flex justify="space-between" align="start">
                        <Box
                          bg="purple.50"
                          p={3}
                          borderRadius="xl"
                          border="2px solid"
                          borderColor="purple.100"
                        >
                          <Icon as={FiLayers} boxSize={6} color="purple.500" />
                        </Box>
                        <Badge
                          colorScheme="purple"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="700"
                        >
                          Template
                        </Badge>
                      </Flex>

                      {/* Title and Description */}
                      <VStack align="flex-start" spacing={2}>
                        <Heading size="sm" fontWeight="700" noOfLines={1}>
                          {type.type_name}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {type.description}
                        </Text>
                      </VStack>

                      {/* Field Counts */}
                      <HStack spacing={3} divider={<Text color="gray.300">•</Text>}>
                        <HStack spacing={1.5}>
                          <Icon as={FiCheckCircle} boxSize={4} color="red.500" />
                          <Text fontSize="sm" fontWeight="600" color="gray.700">
                            {type.required_fields.length} required
                          </Text>
                        </HStack>
                        <HStack spacing={1.5}>
                          <Icon as={FiList} boxSize={4} color="blue.500" />
                          <Text fontSize="sm" fontWeight="600" color="gray.700">
                            {type.optional_fields.length} optional
                          </Text>
                        </HStack>
                      </HStack>

                      {/* View Button */}
                      <Button
                        rightIcon={<Icon as={FiEye} />}
                        variant="outline"
                        colorScheme="purple"
                        size="sm"
                        borderRadius="lg"
                        fontWeight="600"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/teacher/activity-types/${type.type_name}`)
                        }}
                      >
                        View Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            // Empty State
            <VStack spacing={4} py={12}>
              <Box
                bg="gray.50"
                p={6}
                borderRadius="full"
                border="2px dashed"
                borderColor="gray.200"
              >
                <Icon as={FiLayers} boxSize={12} color="gray.400" />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="600" color="gray.700">
                  No activity types yet
                </Text>
                <Text color="gray.500" textAlign="center" maxW="md">
                  Create your first template to standardize activity creation
                </Text>
              </VStack>
              <Button
                leftIcon={<Icon as={FiPlus} />}
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/teacher/activity-types/new')}
                mt={2}
                borderRadius="xl"
                fontWeight="600"
              >
                Create First Type
              </Button>
            </VStack>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}
