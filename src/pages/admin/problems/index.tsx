import React from 'react'
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProblemModal from '@/components/admin/ProblemModal'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

interface AdminProblemsPageProps {
  problems: {
    id: string;
    title: string;
    difficulty: string;
    testCases: any[];
  }[];
}

export default function AdminProblemsPage({ problems }: AdminProblemsPageProps) {
  const { data: session } = useSession()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedProblem, setSelectedProblem] = React.useState<any>(null)

  const handleEdit = (problem: any) => {
    setSelectedProblem(problem)
    onOpen()
  }

  const handleCreate = () => {
    setSelectedProblem(null)
    onOpen()
  }

  if (!session?.user) {
    return <div>请先登录</div>
  }

  return (
    <Container maxW="container.xl" py={10}>
      <HStack justify="space-between" mb={6}>
        <Heading>题目管理</Heading>
        <Button colorScheme="blue" onClick={handleCreate}>
          新建题目
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>标题</Th>
            <Th>难度</Th>
            <Th>测试用例数</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {problems.map((problem) => (
            <Tr key={problem.id}>
              <Td>{problem.title}</Td>
              <Td>{problem.difficulty}</Td>
              <Td>{problem.testCases.length}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleEdit(problem)}
                >
                  编辑
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ProblemModal
        isOpen={isOpen}
        onClose={onClose}
        problem={selectedProblem}
      />
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      testCases: true,
    },
  })

  return {
    props: {
      problems,
    },
  }
} 