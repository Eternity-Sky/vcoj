import React, { useState } from 'react'
import {
  Container,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      toast({
        title: '登录失败',
        description: result.error,
        status: 'error',
        duration: 3000,
      })
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} shadow="md" borderWidth="1px" borderRadius="md">
        <Heading mb={6} textAlign="center">登录</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>邮箱</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>密码</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              登录
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          还没有账号？{' '}
          <Link href="/auth/signup" passHref>
            <ChakraLink color="blue.500">注册</ChakraLink>
          </Link>
        </Text>
      </Box>
    </Container>
  )
} 