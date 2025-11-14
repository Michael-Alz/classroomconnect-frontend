// src/pages/LandingPage.tsx
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  VStack,
  Icon,
  Flex,
  useColorModeValue,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiUsers,
  FiHeart,
  FiPlay,
  FiBookOpen,
  FiHeadphones,
  FiPlayCircle,
  FiImage,
} from "react-icons/fi";
import { PiGraduationCapBold } from "react-icons/pi";

export function LandingPage() {
  const cardBg = useColorModeValue("white", "white");

  // Responsive sizes/behaviors
  const tileSize = useBreakpointValue({ base: 0, md: 160, lg: 220, xl: 260 });
  const iconSize = useBreakpointValue({ base: "0px", md: "40px", lg: "64px" });
  const tagPadX = useBreakpointValue({ base: 0, md: 2, lg: 3 });
  const tagPadY = useBreakpointValue({ base: 0, md: 1, lg: 1 });
  const tagRadius = useBreakpointValue({ base: "md", md: "md", lg: "md" });

  // On md (iPad), no rotation; on lg+, playful rotation
  const tileTransform = (i: number) =>
    useBreakpointValue({
      base: "none",
      md: "none",
      lg: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
    });

  const tiles = [
    { bg: "blush.100", icon: FiBookOpen, tag: "Explore", tagBg: "mint.400"}, // learning
    { bg: "white", icon: FiPlayCircle, tag: "Watch", tagBg: "blue.300" }, // video
    { bg: "mint.100", icon: FiHeadphones, tag: "Listen", tagBg: "brand.300" }, // audio
    {
      bg: "brand.100",
      icon: FiImage,
      tag: "Gallery",
      tagBg: "blush.500",
      tagColor: "black",
    }, // pictures
  ];

  return (
    <Box bg="surfaces.canvas" minH="100vh">
      {/* Top nav stub (your actual header likely elsewhere) */}
      <Box as="header" bg="transparent">
        <Container maxW="7xl" py={4}>
          <Flex align="center" justify="space-between" />
        </Container>
      </Box>

      {/* Hero */}
      <Box position="relative" overflow="hidden" py={{ base: 12, md: 20 }}>
        {/* gradient + subtle grid */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(135deg, brand.50 0%, mint.50 50%, blush.50 100%)"
        />
        <Box
          position="absolute"
          inset={0}
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent 0, transparent calc(100% - 1px), rgba(0,0,0,0.06) 1px), linear-gradient(to bottom, transparent 0, transparent calc(100% - 1px), rgba(0,0,0,0.06) 1px)",
            backgroundSize: "40px 40px",
          }}
          opacity={0.25}
        />

        {/* floating accents */}
        <Box
          position="absolute"
          top="6"
          right="6"
          fontSize="3xl"
          opacity={0.9}
          animation="float 6s infinite ease-in-out"
        >
          🎓
        </Box>
        <Box
          position="absolute"
          bottom="10"
          left="8"
          fontSize="3xl"
          opacity={0.9}
          animation="float 7s infinite ease-in-out"
        >
          💡
        </Box>
        <Container
          maxW={{ base: "full", md: "6xl", lg: "7xl" }}
          px={{ base: 4, md: 8, lg: 12 }} // tighter horizontal padding
          position="relative"
          zIndex={1}
        >
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 8, lg: 10 }} // reduce gap between hero and board
            align="center"
            justify="space-between"
          >
            {/* Left copy */}
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              spacing={6}
              flex={1}
            >
              <Heading
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                lineHeight="1.15"
                textAlign={{ base: "center", lg: "left" }}
                color="ink.700"
              >
                Kids have fun {" "}<br></br>
                <Text as="span" color="blush.600">
                you see learning progress.
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="ink.600"
                textAlign={{ base: "center", lg: "left" }}
                maxW="600px"
              >
                Children experience fun while you observe tangible learning
                outcomes.
              </Text>

              {/* CTAs (soft radius) */}
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                w={{ base: "full", sm: "auto" }}
              >
                <Button
                  as={RouterLink}
                  to="/login/teacher"
                  size="lg"
                  px={6}
                  borderRadius="lg"
                  color="sky.900"
                >
                  Get started
                </Button>
                <Button
                  as={RouterLink}
                  to="/guest/join"
                  size="lg"
                  px={6}
                  variant="outline"
                  leftIcon={<Icon as={FiPlay} />}
                  colorScheme="mint"
                  borderRadius="lg"
                >
                  Do an activity
                </Button>
              </Stack>
            </VStack>

            {/* Right visual board */}
            <Box flex={1} display={{ base: "none", md: "block" }}>
              {/* md: true 2×2 grid with square tiles; lg+: larger, rotated */}
              <SimpleGrid
                columns={2}
                spacing={{ md: 4, lg: 6 }}
                position="relative"
                justifyItems="center"
                alignItems="center"
              >
                {tiles.map((tile, i) => (
                  <Box
                    key={i}
                    bg={tile.bg}
                    w={`${tileSize}px`}
                    h={`${tileSize}px`}
                    borderRadius={{ md: "lg", lg: "xl" }}
                    boxShadow="2xl"
                    position="relative"
                    transform={tileTransform(i)}
                    _hover={{
                      transform: {
                        md: "none",
                        lg: "rotate(0deg) scale(1.02)",
                      } as any,
                    }}
                    transition="all .2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={tile.icon} boxSize={iconSize} color="ink.700" />
                    {tile.tag && (
                      <Box
                        position="absolute"
                        bottom={{ md: 2, lg: 3 }}
                        left={{ md: 2, lg: 3 }}
                        bg={tile.tagBg}
                        color={tile.tagColor || "ink.800"}
                        px={tagPadX}
                        py={tagPadY}
                        borderRadius={tagRadius}
                        fontSize={{ md: "xs", lg: "sm" }}
                        fontWeight="semibold"
                        boxShadow="md"
                      >
                        {tile.tag}
                      </Box>
                    )}
                  </Box>
                ))}

                {/* Center sparkle — keep small on md to avoid overlap */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w={{ md: "56px", lg: "84px" }}
                  h={{ md: "56px", lg: "84px" }}
                  borderRadius="full"
                  bg="white"
                  boxShadow="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    w={{ md: "40px", lg: "62px" }}
                    h={{ md: "40px", lg: "62px" }}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    ✨
                  </Box>
                </Box>
              </SimpleGrid>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Audience cards */}
      <Container maxW="7xl" py={{ base: 12, md: 20 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 12 }}>
          {/* Teachers */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            boxShadow="xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
            transition="all .2s"
          >
            <VStack align="flex-start" spacing={5}>
              <Box bg="mint.50" p={3} borderRadius="lg" display="inline-block">
                <Icon as={FiBookOpen} boxSize={8} color="mint.700" />
              </Box>
              <Heading size="lg" color="ink.700">
                Teachers
              </Heading>
              <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
                Plan sessions, configure baseline surveys, and keep
                recommendations aligned with student moods and learning styles.
              </Text>
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={3}
                w="full"
                pt={2}
              >
                <Button
                  as={RouterLink}
                  to="/login/teacher"
                  borderRadius="lg"
                  colorScheme="brand"
                  
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup/teacher"
                  variant="outline"
                  colorScheme="brand"
                  borderRadius="lg"
                  color="ink.700"
                >
                  Sign up
                </Button>
              </Stack>
            </VStack>
          </Box>

          {/* Students & Guests */}
          <Box
            bg={cardBg}
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            boxShadow="xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
            transition="all .2s"
          >
            <VStack align="flex-start" spacing={5}>
              <Box bg="mint.50" p={3} borderRadius="lg" display="inline-block">
                <Icon as={FiBookOpen} boxSize={8} color="mint.700" />
              </Box>
              <Heading size="lg" color="ink.700">
                Students & Guests
              </Heading>
              <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
                Join from any device, review past submissions, or scan a QR to
                participate—no account required.
              </Text>
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={3}
                w="full"
                pt={2}
              >
                <Button
                  as={RouterLink}
                  to="/login/student"
                  colorScheme="brand"
                  borderRadius="lg"
                  color="ink.900"
                >
                  Student Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup/student"
                  variant="outline"
                  colorScheme="brand"
                  borderRadius="lg"
                  color="ink.900"
                >
                  Student Signup
                </Button>
              </Stack>
              <Button
                as={RouterLink}
                to="/guest/join"
                variant="ghost"
                colorScheme="mint"
                leftIcon={<Icon as={FiUsers} />}
                borderRadius="lg"
                color="mint.900"
              >
                Join as Guest
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Bottom tagline */}
        <Box textAlign="center" mt={16}>
          <Text fontSize="lg" color="ink.600" maxW="2xl" mx="auto">
            <Text as="span" fontWeight="bold" color="ink.700">
              We don’t just lecture—kids learn by doing.
            </Text>{" "}
            <Text
              as="span"
              color="mint.700"
              fontWeight="bold"
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Learn more
            </Text>
          </Text>
        </Box>
      </Container>

      {/* animations */}
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }
      `}</style>
    </Box>
  );
}
