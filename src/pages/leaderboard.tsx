import React from 'react'
import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Avatar,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import prisma from '@/lib/prisma'

interface LeaderboardPageProps {
  users: {
    id: string;
    name: string;
    image: string | null;
    rating: number;
    solvedProblems: number;
  }[];
}

export default function LeaderboardPage({ users }: LeaderboardPageProps) {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>排行榜</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>排名</Th>
            <Th>用户</Th>
            <Th>解题数</Th>
            <Th>积分</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={user.id}>
              <Td>{index + 1}</Td>
              <Td>
                <Avatar size="sm" src={user.image || undefined} mr={2} />
                {user.name}
              </Td>
              <Td>{user.solvedProblems}</Td>
              <Td>{user.rating}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      rating: true,
      solvedProblems: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      rating: 'desc',
    },
    take: 100,
  })

  return {
    props: {
      users: users.map(user => ({
        ...user,
        solvedProblems: user.solvedProblems.length,
      })),
    },
  }
} 