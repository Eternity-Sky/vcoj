import React from 'react'
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>在线评测系统</Heading>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        <Link href="/problems">
          <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md">题目列表</Heading>
            <Text mt={4}>浏览所有可用的编程题目</Text>
          </Box>
        </Link>
        
        <Link href="/submissions">
          <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md">提交记录</Heading>
            <Text mt={4}>查看所有提交的解答</Text>
          </Box>
        </Link>
        
        <Link href="/leaderboard">
          <Box p={6} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading size="md">排行榜</Heading>
            <Text mt={4}>查看用户排名</Text>
          </Box>
        </Link>
      </SimpleGrid>
    </Container>
  )
} 