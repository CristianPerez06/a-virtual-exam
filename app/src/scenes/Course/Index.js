import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CourseEditor from './CourseEditor'
import CoursesList from './CoursesList'
import { PageNotFound } from '../../components/common'

const Index = () => {
  return (
    <Switch>
      <Route
        name='List courses'
        path='/course/list'
        render={(props) => <CoursesList {...props} />}
      />
      <Route
        name='Course editor'
        path='/course/new'
        render={(props) => <CourseEditor {...props} isCreating />}
      />
      <Route
        name='Edit course'
        path='/course/:id'
        render={(props) => <CourseEditor {...props} isCreating={false} />}
      />
      <Route name='Page Not Found' component={PageNotFound} />
    </Switch>
  )
}

export default Index