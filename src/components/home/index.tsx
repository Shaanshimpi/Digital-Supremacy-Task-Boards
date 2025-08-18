import React, { useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid, Button, Icon, Stack, Flex, Badge } from '@chakra-ui/react';
import {
  FaProjectDiagram,
  FaUsers,
  FaTasks,
  FaChartLine,
  FaPlus,
  FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/src/hooks';
import { fetchBoards } from '@/src/slices/boards';

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.boards);
  const { fullName, isValid } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isValid) {
      dispatch(fetchBoards());
    }
  }, [dispatch, isValid]);

  // Calculate real statistics from available data
  const stats = [
    {
      label: 'Active Boards',
      value: boards?.length?.toString() || '0',
      icon: FaProjectDiagram,
      color: 'blue'
    },
    {
      label: 'User',
      value: fullName ? '1' : '0',
      icon: FaUsers,
      color: 'green'
    },
    {
      label: 'Total Boards',
      value: boards?.length?.toString() || '0',
      icon: FaTasks,
      color: 'purple'
    },
    {
      label: 'Status',
      value: isValid ? 'Active' : 'Inactive',
      icon: FaChartLine,
      color: isValid ? 'green' : 'red'
    }
  ];

  // Show recent boards as activity (only if we have data)
  const recentActivity =
    boards?.slice(0, 4).map((board: any) => ({
      action: `Board "${board.name || 'Untitled'}" is available`,
      time: board.dateCreated ? new Date(board.dateCreated).toLocaleDateString() : 'Recently'
    })) || [];

  return (
    <Box minHeight="80vh" flexGrow={3} mx="2%" p="2rem">
      {/* Welcome Section */}
      <Stack spacing={6}>
        <Box>
          <Heading size="xl" mb={2} color="gray.700">
            {fullName ? `Welcome back, ${fullName}!` : 'Welcome to Digital Supremacy'}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {boards?.length > 0
              ? `You have ${boards.length} board${boards.length !== 1 ? 's' : ''} to manage`
              : 'Your command center for project management and team collaboration'}
          </Text>
        </Box>

        {/* Quick Actions */}
        <Flex spacing={4} mb={8}>
          <Link href="/boards">
            <Button leftIcon={<Icon as={FaArrowRight} />} colorScheme="blue" size="lg">
              View All Boards
            </Button>
          </Link>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <Box key={index} bg="white" boxShadow="md" borderRadius="lg" p={4}>
              <Flex align="center" spacing={4}>
                <Box
                  p={3}
                  borderRadius="lg"
                  bg={`${stat.color}.100`}
                  color={`${stat.color}.500`}
                  mr={4}>
                  <Icon as={stat.icon} boxSize={6} />
                </Box>
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {stat.label}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        {/* Two Column Layout */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Recent Activity */}
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <Heading size="md" color="gray.700" mb={4}>
              Your Boards
            </Heading>
            <Stack spacing={3}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <Box key={index} p={3} borderRadius="md" bg="gray.50">
                    <Text fontSize="sm" color="gray.700" mb={1}>
                      {activity.action}
                    </Text>
                    <Badge colorScheme="blue" size="sm">
                      {activity.time}
                    </Badge>
                  </Box>
                ))
              ) : (
                <Box p={4} textAlign="center" color="gray.500">
                  <Text mb={2}>No boards yet</Text>
                  <Text fontSize="sm">Create your first board to get started!</Text>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
            <Heading size="md" color="gray.700" mb={4}>
              Quick Access
            </Heading>
            <Stack spacing={4}>
              <Link href="/boards">
                <Box
                  p={4}
                  borderRadius="md"
                  bg="blue.50"
                  borderLeft="4px solid"
                  borderLeftColor="blue.400"
                  cursor="pointer"
                  _hover={{ bg: 'blue.100' }}>
                  <Text fontWeight="semibold" color="blue.600">
                    Project Boards
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Manage your projects with Kanban boards
                  </Text>
                </Box>
              </Link>

              {boards && boards.length > 0 && (
                <Box
                  p={4}
                  borderRadius="md"
                  bg="green.50"
                  borderLeft="4px solid"
                  borderLeftColor="green.400">
                  <Text fontWeight="semibold" color="green.600">
                    Your Workspace
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {boards.length} active board{boards.length !== 1 ? 's' : ''} available
                  </Text>
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default Home;
