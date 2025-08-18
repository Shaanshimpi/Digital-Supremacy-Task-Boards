import React, { FC } from 'react';
import {
  Button,
  Box,
  Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/src/hooks';
import { AiOutlineHome } from 'react-icons/ai';
import { SiTrello } from 'react-icons/si';
import DarkModeToggle from '@/src/components/dark-mode-toggle';

const UserNavBar: FC = () => {
  const user = useAppSelector((state) => state.user);
  const navBg = useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.1)');
  const textColor = useColorModeValue('white', 'gray.100');

  const logout = async () => {
    const URL = '/api/logout';

    const response = await fetch(URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({})
    });

    const responseInJson = await response.json();

    if (responseInJson.message === 'success') {
      window.location.href = `${window.location.origin}/login`;
    }
  };

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <>
          <Menu>
            <MenuButton size="xs" mr="5px">
              <Avatar
                size="sm"
                name={user?.fullName}
                color="white"
                src="https://bit.ly/tioluwani-kolawole"
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </>
      );
    }

    return (
      <>
        <Button fontSize="20" color="brand" variant="link" float="right" mr="2" pr="2">
          <Link href="/login">Log in</Link>
        </Button>
        <Button fontSize="md" colorScheme="green" color="white" m="4">
          <Link href="/signup">Sign up</Link>
        </Button>
      </>
    );
  };

  return (
    <Box boxShadow="sm" bg={navBg} display="flex">
      <Link href="/home">
        <Button size="xs" ml="5px" my="5px">
          <AiOutlineHome />
        </Button>
      </Link>
      <Link href="/boards">
        <Button size="xs" ml="5px" mr="10px" my="5px">
          Boards
        </Button>
      </Link>
      <Spacer />
      <Box size="md" m="10px" color={textColor} mixBlendMode="difference">
        <SiTrello />
      </Box>
      <Text fontWeight="bold" fontSize="20px" mt="2px" color={textColor}>
        Digital Supremacy
      </Text>
      <Spacer />
      <DarkModeToggle color={textColor} _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} />
      {renderButtons()}
    </Box>
  );
};

UserNavBar.propTypes = {
  bg: PropTypes.string
};

export default UserNavBar;
