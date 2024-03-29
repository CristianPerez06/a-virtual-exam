import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks'

const useCognitoUsers = () => {
  // State
  const [cognitoUsers, setCognitoUsers] = useState([])
  const [fetchingCognitoUsers, setFetchingCognitoUsers] = useState(true)

  // Hooks
  const { cognito } = useAuthContext()

  useEffect(() => {
    setFetchingCognitoUsers(true)

    cognito.getUsersList()
      .then(data => {
        const { Users } = data
        setCognitoUsers(Users)
        setFetchingCognitoUsers(false)
      })
      .catch(err => {
        setFetchingCognitoUsers(false)
        console.log(err)
        return []
      })
  }, [cognito])

  return [cognitoUsers, fetchingCognitoUsers]
}

export default useCognitoUsers
