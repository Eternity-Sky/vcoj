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
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

interface LeaderboardPageProps {
  users: {
    _id: string;
    name: string;
    image: string;
    rating: number;
    solvedProblems: string[];
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
            <Tr key={user._id}>
              <Td>{index + 1}</Td>
              <Td>
                <Avatar size="sm" src={user.image} mr={2} />
                {user.name}
              </Td>
              <Td>{user.solvedProblems.length}</Td>
              <Td>{user.rating}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect()
  const users = await User.find()
    .sort({ rating: -1 })
    .limit(100)
  
  return {
    props: {
      users: JSON.parse(JSON.stringify(users))
    }
  }
} 