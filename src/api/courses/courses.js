import { post } from '@/utils/request'

export function getAllCourses() {
  return post('/exam/api/courses/all')
}