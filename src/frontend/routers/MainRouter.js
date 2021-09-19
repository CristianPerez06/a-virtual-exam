import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthRouter, UnauthRouter } from '../routers'
import { Loading } from '../components/common'
import { ACCOUNT_ACTION_TYPES } from '../common/constants'
import { useAuthContext } from '../hooks'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MainRouter = () => {
  // Hooks
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState()
  const { dispatch, cognito } = useAuthContext()

  useEffect(() => {
    const getCurrentSession = async () => {
      try {
        const session = await cognito.getSession()
        const { user, accessToken } = session
        dispatch({
          type: ACCOUNT_ACTION_TYPES.LOGIN,
          payload: { user: user.username, token: accessToken.jwtToken, role: session['custom:role'] }
        })
        setUser(user.username)
      } catch {
        dispatch({
          type: ACCOUNT_ACTION_TYPES.LOGOUT,
          payload: {}
        })
        setUser(null)
      }
      setIsLoading(false)
    }

    getCurrentSession()
  }, [dispatch, cognito])

  if (isLoading) { return <Loading /> }

  return (
    <Router>
      {user ? <AuthRouter /> : <UnauthRouter />}
      <ToastContainer />
    </Router>
  )
}

export default MainRouter
