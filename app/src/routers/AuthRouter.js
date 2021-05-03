import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { Layout } from '../components/layout'
import { PageNotFound, Error, Loading } from '../components/common'
import { Home } from '../components'
import { AsyncCourses, AsyncUnits, AsyncSettings, AsyncExercises, AsyncExamTemplates } from './Lazyimports'
import { ACCOUNT_ACTION_TYPES } from '../common/constants'
import { useAuthContext } from '../hooks'

const AuthRouter = () => {
  // State
  const [isLoading, setIsLoading] = useState(true)

  // Hooks
  const location = useLocation()
  const { dispatch, cognito } = useAuthContext()

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const session = await cognito.getSession()
        const refresh = await cognito.refreshSession(session)
        const { user } = session
        const { accessToken } = refresh
        dispatch({
          type: ACCOUNT_ACTION_TYPES.LOGIN,
          payload: { user: user.username, token: accessToken.jwtToken }
        })
      } catch {
        dispatch({
          type: ACCOUNT_ACTION_TYPES.LOGOUT,
          payload: {}
        })
      }
      setIsLoading(false)
    }

    refreshSession()
  }, [location, dispatch, cognito])

  return (
    <Layout>
      {isLoading
        ? <Loading />
        : (
          <Switch>
            <Route path='/' exact name='Home' component={Home} />
            <Route exact path='/login'>
              <Redirect to='/' />
            </Route>
            <Route path='/courses' name='Course' component={AsyncCourses} />
            <Route path='/units' name='Unit' component={AsyncUnits} />
            <Route path='/exercises' name='Exercises' component={AsyncExercises} />
            <Route path='/exam-templates' name='Exam templates' component={AsyncExamTemplates} />
            <Route path='/settings' name='Settings' component={AsyncSettings} />
            <Route name='/error' component={Error} />
            <Route name='Page Not Found' component={PageNotFound} />
          </Switch>
        )}
    </Layout>
  )
}

export default AuthRouter
