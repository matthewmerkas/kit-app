import { environment } from '../../environments/environment'

export const localFilter = (objects: any[], filters: any): any => {
  const valid = (object: any): boolean => {
    for (const key of Object.keys(filters)) {
      if (typeof object[key] === 'string' && typeof filters[key] === 'string') {
        if (!object[key].includes(filters[key])) {
          return false
        }
      } else if (
        typeof object[key] === 'boolean' &&
        typeof filters[key] === 'boolean'
      ) {
        if (!object[key] === filters[key]) {
          return false
        }
      } else {
        return false
      }
    }
    return true
  }

  const filtered = []
  for (const object of objects) {
    if (valid(object)) {
      filtered.push(object)
    }
  }
  return filtered
}

export const getHost = (): string =>
  environment.apiUrl
    .replace('http://', '')
    .replace('https://', '')
    .replace('/kit', '')
    .replace('/api', '')
