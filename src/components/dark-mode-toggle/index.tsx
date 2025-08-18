import React, { FC } from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

type DarkModeToggleProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: string;
  color?: string;
  mr?: number | string;
  _hover?: Record<string, string>;
};

const DarkModeToggle: FC<DarkModeToggleProps> = ({
  size = 'sm',
  variant = 'ghost',
  color = 'inherit',
  mr = 2,
  _hover = {}
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
      onClick={toggleColorMode}
      size={size}
      mr={mr}
      variant={variant}
      color={color}
      _hover={_hover}
    />
  );
};

export default DarkModeToggle;
