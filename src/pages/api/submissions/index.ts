import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ message: '请先登录' })
  }

  if (req.method === 'POST') {
    try {
      const { problemId, code, language } = req.body
      
      const problem = await prisma.problem.findUnique({
        where: { id: problemId }
      })

      if (!problem) {
        return res.status(404).json({ message: '题目不存在' })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user?.email }
      })

      if (!user) {
        return res.status(404).json({ message: '用户不存在' })
      }

      // 创建提交记录
      const submission = await prisma.submission.create({
        data: {
          userId: user.id,
          problemId: problemId,
          code,
          language,
          status: 'Pending'
        }
      })

      // TODO: 实际的代码评测逻辑
      // 这里简单模拟评测结果
      const result = {
        status: Math.random() > 0.5 ? 'Accepted' : 'Wrong Answer',
        executionTime: Math.floor(Math.random() * 1000),
        memoryUsage: Math.floor(Math.random() * 100),
      }

      // 更新提交状态
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: result.status,
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
        }
      })

      // 如果通过测试，更新用户解题记录
      if (result.status === 'Accepted') {
        const solved = await prisma.problem.findFirst({
          where: {
            id: problemId,
            solvedBy: {
              some: {
                id: user.id
              }
            }
          }
        })

        if (!solved) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              rating: { increment: 50 },
              solvedProblems: {
                connect: { id: problemId }
              }
            }
          })
        }
      }

      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: '服务器错误' })
    }
  }

  return res.status(405).json({ message: '方法不允许' })
} 