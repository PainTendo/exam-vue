import { post } from '@/utils/request'

export function getAllOrganization() {
  return post('/exam/api/organization/all')
}

