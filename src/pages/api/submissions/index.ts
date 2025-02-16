import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submission'
import Problem from '@/models/Problem'
import User from '@/models/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ message: '请先登录' })
  }

  await dbConnect()

  if (req.method === 'POST') {
    try {
      const { problemId, code, language } = req.body
      
      const problem = await Problem.findById(problemId)
      if (!problem) {
        return res.status(404).json({ message: '题目不存在' })
      }

      const user = await User.findOne({ email: session.user?.email })
      if (!user) {
        return res.status(404).json({ message: '用户不存在' })
      }

      // 创建提交记录
      const submission = await Submission.create({
        user: user._id,
        problem: problemId,
        code,
        language,
      })

      // TODO: 实际的代码评测逻辑
      // 这里简单模拟评测结果
      const result = {
        status: Math.random() > 0.5 ? 'Accepted' : 'Wrong Answer',
        executionTime: Math.floor(Math.random() * 1000),
        memoryUsage: Math.floor(Math.random() * 100),
      }

      submission.status = result.status
      submission.executionTime = result.executionTime
      submission.memoryUsage = result.memoryUsage
      await submission.save()

      // 如果通过测试，更新用户解题记录
      if (result.status === 'Accepted') {
        if (!user.solvedProblems.includes(problemId)) {
          user.solvedProblems.push(problemId)
          user.rating += 50
          await user.save()
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