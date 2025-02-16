import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  
  if (!session?.user?.email) {
    return res.status(401).json({ message: '请先登录' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (user?.role !== 'admin') {
    return res.status(403).json({ message: '权限不足' })
  }

  if (req.method === 'POST') {
    try {
      const problem = await prisma.problem.create({
        data: req.body
      })
      return res.status(201).json(problem)
    } catch (error) {
      return res.status(500).json({ message: '创建失败' })
    }
  }

  return res.status(405).json({ message: '方法不允许' })
} 