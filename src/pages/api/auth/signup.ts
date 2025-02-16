import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '方法不允许' })
  }

  try {
    const { name, email, password } = req.body

    // 验证输入
    if (!name || !email || !password) {
      return res.status(400).json({ message: '请填写所有必填字段' })
    }

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被注册' })
    }

    // 创建新用户
    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: '服务器错误' })
  }
} 