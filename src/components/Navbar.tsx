import React from 'react'
import {
  Box,
  Flex,
  Button,
  useColorMode,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: session } = useSession()

  return (
    <Box px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Link href="/">
            <Box fontWeight="bold" fontSize="xl">OJ平台</Box>
          </Link>

          <Stack direction="row" ml={8} spacing={4}>
            <Link href="/problems">题目</Link>
            <Link href="/submissions">提交</Link>
            <Link href="/leaderboard">排行榜</Link>
          </Stack>
        </Flex>

        <Flex alignItems="center">
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>

          {session ? (
            <Menu>
              <MenuButton>
                <Avatar size="sm" src={session.user?.image || ''} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => signOut()}>退出登录</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button onClick={() => signIn()}>登录</Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
} 