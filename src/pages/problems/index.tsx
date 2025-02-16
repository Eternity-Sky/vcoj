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
import dbConnect from '@/lib/mongodb'
import Problem from '@/models/Problem'
import { IProblem } from '@/models/Problem'

interface ProblemsPageProps {
  problems: {
    _id: string;
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
            <Tr key={problem._id}>
              <Td>
                <Link href={`/problems/${problem._id}`}>
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
  await dbConnect()
  const problems = await Problem.find({}, 'title difficulty')
  
  return {
    props: {
      problems: JSON.parse(JSON.stringify(problems))
    }
  }
} 