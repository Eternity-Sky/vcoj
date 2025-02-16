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
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      })

      toast({
        title: '注册成功',
        description: '请登录',
        status: 'success',
        duration: 3000,
      })

      router.push('/auth/signin')
    } catch (error: any) {
      toast({
        title: '注册失败',
        description: error.response?.data?.message || '发生错误',
        status: 'error',
        duration: 3000,
      })
    }

    setLoading(false)
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} shadow="md" borderWidth="1px" borderRadius="md">
        <Heading mb={6} textAlign="center">注册</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>用户名</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
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
              注册
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          已有账号？{' '}
          <Link href="/auth/signin" passHref>
            <ChakraLink color="blue.500">登录</ChakraLink>
          </Link>
        </Text>
      </Box>
    </Container>
  )
} 