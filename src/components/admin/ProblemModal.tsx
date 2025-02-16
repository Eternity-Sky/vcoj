import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem?: any;
}

export default function ProblemModal({ isOpen, onClose, problem }: ProblemModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: problem || {
      title: '',
      description: '',
      difficulty: 'Easy',
      testCases: [],
    },
  })
  const toast = useToast()

  React.useEffect(() => {
    reset(problem || {
      title: '',
      description: '',
      difficulty: 'Easy',
      testCases: [],
    })
  }, [problem, reset])

  const onSubmit = async (data: any) => {
    try {
      if (problem) {
        await axios.put(`/api/admin/problems/${problem.id}`, data)
      } else {
        await axios.post('/api/admin/problems', data)
      }
      toast({
        title: '保存成功',
        status: 'success',
        duration: 3000,
      })
      onClose()
    } catch (error) {
      toast({
        title: '保存失败',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{problem ? '编辑题目' : '新建题目'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>标题</FormLabel>
                <Input {...register('title')} />
              </FormControl>

              <FormControl>
                <FormLabel>描述</FormLabel>
                <Textarea {...register('description')} />
              </FormControl>

              <FormControl>
                <FormLabel>难度</FormLabel>
                <Select {...register('difficulty')}>
                  <option value="Easy">简单</option>
                  <option value="Medium">中等</option>
                  <option value="Hard">困难</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" w="full">
                保存
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 