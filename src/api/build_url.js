import {
  SERVER_URL,
} from 'ApolloConstant'

const buildUrl = (path) => {
  return SERVER_URL + path
}

export default buildUrl