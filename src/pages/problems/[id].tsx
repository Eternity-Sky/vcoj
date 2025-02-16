import React, { useState } from 'react'
import { 
  Container, 
  Box, 
  Heading, 
  Text, 
  Button,
  useToast,
  Badge
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import prisma from '@/lib/prisma'
import axios from 'axios'

const MonacoEditor = dynamic(
  () => import('@/components/MonacoEditor'),
  { ssr: false }
)

interface ProblemDetailProps {
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    timeLimit: number;
    memoryLimit: number;
  };
}

export default function ProblemDetail({ problem }: ProblemDetailProps) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [submitting, setSubmitting] = useState(false)
  const { data: session } = useSession()
  const toast = useToast()

  const handleSubmit = async () => {
    if (!session) {
      toast({
        title: '请先登录',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await axios.post('/api/submissions', {
        problemId: problem.id,
        code,
        language,
      })

      if (res.data.status === 'Accepted') {
        toast({
          title: '提交成功',
          status: 'success',
          duration: 3000,
        })
      } else {
        toast({
          title: res.data.status,
          status: 'error',
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: '提交失败',
        status: 'error',
        duration: 3000,
      })
    }
    setSubmitting(false)
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={6}>
        <Heading size="lg">{problem.title}</Heading>
        <Badge 
          colorScheme={
            problem.difficulty === 'Easy' ? 'green' : 
            problem.difficulty === 'Medium' ? 'orange' : 'red'
          }
          mt={2}
        >
          {problem.difficulty}
        </Badge>
      </Box>

      <Box mb={6}>
        <Text whiteSpace="pre-wrap">{problem.description}</Text>
      </Box>

      <Box mb={6}>
        <Text>时间限制: {problem.timeLimit}ms</Text>
        <Text>内存限制: {problem.memoryLimit}MB</Text>
      </Box>

      <Box h="600px" mb={6}>
        <MonacoEditor
          language={language}
          value={code}
          onChange={setCode}
        />
      </Box>

      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={submitting}
      >
        提交
      </Button>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const problem = await prisma.problem.findUnique({
    where: { 
      id: params?.id as string 
    },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      timeLimit: true,
      memoryLimit: true,
    }
  })
  
  if (!problem) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      problem
    }
  }
} 