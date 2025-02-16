import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const hashedPassword = await hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: '测试用户',
      password: hashedPassword,
    },
  })

  // 创建测试题目
  const problems = await Promise.all([
    prisma.problem.upsert({
      where: { id: 'problem1' },
      update: {},
      create: {
        title: '两数之和',
        description: '给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。',
        difficulty: 'Easy',
        testCases: [
          { input: '[2,7,11,15]\n9', output: '[0,1]' },
          { input: '[3,2,4]\n6', output: '[1,2]' },
        ],
      },
    }),
    prisma.problem.upsert({
      where: { id: 'problem2' },
      update: {},
      create: {
        title: '反转链表',
        description: '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
        difficulty: 'Medium',
        testCases: [
          { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: '[1,2]', output: '[2,1]' },
        ],
      },
    }),
  ])

  console.log({ user, problems })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 