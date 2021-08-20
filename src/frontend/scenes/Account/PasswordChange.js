import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { ACCOUNT_ACTION_TYPES } from '../../common/constants'
import { useQueryParams, useAuthContext, useAlert } from '../../hooks'
import PasswordChangeForm from './components/PasswordChangeForm'
import { getTranslatableErrors } from '../../common/cognitoErrorHandlers'

const PasswordChange = (props) => {
  // Props and params
  const { intl } = props
  const { formatMessage } = intl
  const queryParams = useQueryParams()
  const id = queryParams.get('id')
  const email = queryParams.get('email')

  // State
  const [isLoading, setIsLoading] = useState(false)

  // Hooks
  const { dispatch, cognito } = useAuthContext()
  const history = useHistory()
  const { alertError } = useAlert()

  // handlers
  const onSuccess = (data) => {
    const { accessToken } = data

    setIsLoading(false) // TO DO - Review - States are being reset before accessing onSuccess/onError.
    dispatch({
      type: ACCOUNT_ACTION_TYPES.LOGIN,
      payload: { user: accessToken.payload.username, token: accessToken.jwtToken }
    })
    history.push('/')
  }

  const onError = (err) => {
    const { code } = err
    const translatableError = getTranslatableErrors(code)
    alertError(formatMessage({ id: translatableError.id }))
    setIsLoading(false)
  }

  const onSubmit = values => {
    const { password, newPassword } = values

    setIsLoading(true)
    cognito.loginAndChangePassword(id, password, newPassword)
      .then(data => onSuccess(data))
      .catch(err => onError(err))
  }

  return (
    <div className='password-change d-flex justify-content-center row text-center'>
      <div className='password-change-form bg-light col-md-12 col-xs-12'>
        <PasswordChangeForm isLoading={isLoading} idNumber={id} email={email} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export default injectIntl(PasswordChange)
