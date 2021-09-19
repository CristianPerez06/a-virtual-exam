import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { ROLES } from '../../common/constants'
import { useAuthContext, useAlert } from '../../hooks'
import SignUpForm from './components/SignUpForm'
import SignUpSuccess from './components/SignUpSuccess'
import { getTranslatableErrors } from '../../common/cognitoErrorHandlers'

const SignUp = (props) => {
  // Props and params
  const { intl } = props
  const { formatMessage } = intl

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [signUpInProgress, setSignUpInProgress] = useState(true)

  // Hooks
  const { cognito } = useAuthContext()
  const { alertError } = useAlert()

  // Handlers
  const onSuccess = (data) => {
    setIsLoading(false)
    setSignUpInProgress(false)
  }

  const onError = (err) => {
    const { code } = err
    const translatableError = getTranslatableErrors(code)
    alertError(formatMessage({ id: translatableError.id }))
    setIsLoading(false)
  }

  const onSubmit = values => {
    const { username, password, email, name, lastname, nickname } = values
    const attributes = [
      { name: 'email', value: email },
      { name: 'name', value: name },
      { name: 'family_name', value: lastname },
      { name: 'nickname', value: nickname }
    ]
    const customAttributes = [
      { name: 'role', value: ROLES.GUEST }
    ]
    setIsLoading(true)

    cognito.signUp(username, password, attributes, customAttributes)
      .then(data => onSuccess(data))
      .catch(err => onError(err))
  }

  return (
    <div className='sign-up d-flex justify-content-center row text-center'>
      {signUpInProgress && (
        <div className='sign-up-form bg-light col-md-12 col-xs-12'>
          {signUpInProgress && <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />}
        </div>
      )}

      <div className='info pt-3 col-md-12 col-xs-12'>
        {!isLoading && !signUpInProgress && <SignUpSuccess />}
      </div>
    </div>
  )
}

export default injectIntl(SignUp)
