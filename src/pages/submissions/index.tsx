import React from 'react'
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Heading,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submission'

interface SubmissionsPageProps {
  submissions: {
    _id: string;
    problem: {
      title: string;
    };
    language: string;
    status: string;
    executionTime: number;
    memoryUsage: number;
    createdAt: string;
  }[];
}

export default function SubmissionsPage({ submissions }: SubmissionsPageProps) {
  const { data: session } = useSession()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'green'
      case 'Wrong Answer':
        return 'red'
      case 'Time Limit Exceeded':
        return 'yellow'
      case 'Runtime Error':
        return 'orange'
      default:
        return 'gray'
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>提交记录</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>题目</Th>
            <Th>语言</Th>
            <Th>状态</Th>
            <Th>执行时间</Th>
            <Th>内存使用</Th>
            <Th>提交时间</Th>
          </Tr>
        </Thead>
        <Tbody>
          {submissions.map((submission) => (
            <Tr key={submission._id}>
              <Td>{submission.problem.title}</Td>
              <Td>{submission.language}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(submission.status)}>
                  {submission.status}
                </Badge>
              </Td>
              <Td>{submission.executionTime}ms</Td>
              <Td>{submission.memoryUsage}MB</Td>
              <Td>{new Date(submission.createdAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  await dbConnect()
  const submissions = await Submission.find()
    .populate('problem', 'title')
    .sort({ createdAt: -1 })
    .limit(50)
  
  return {
    props: {
      submissions: JSON.parse(JSON.stringify(submissions))
    }
  }
} 