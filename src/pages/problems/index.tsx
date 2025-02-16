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
  Heading
} from '@chakra-ui/react'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import prisma from '@/lib/prisma'

interface ProblemsPageProps {
  problems: {
    id: string;
    title: string;
    difficulty: string;
  }[];
}

export default function ProblemsPage({ problems }: ProblemsPageProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'green'
      case 'Medium':
        return 'orange'
      case 'Hard':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>题目列表</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>标题</Th>
            <Th>难度</Th>
          </Tr>
        </Thead>
        <Tbody>
          {problems.map((problem) => (
            <Tr key={problem.id}>
              <Td>
                <Link href={`/problems/${problem.id}`}>
                  {problem.title}
                </Link>
              </Td>
              <Td>
                <Badge colorScheme={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
    },
    orderBy: {
      id: 'asc'
    }
  })
  
  return {
    props: {
      problems
    }
  }
} 