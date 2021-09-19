import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { useAuthContext, useAlert } from '../../hooks'
import SendRecoveryCodeForm from './components/SendRecoveryCodeForm'
import ConfirmPasswordForm from './components/ConfirmPasswordForm'
import { getTranslatableErrors } from '../../common/cognitoErrorHandlers'

const SignUp = (props) => {
  // Props and params
  const { intl } = props
  const { formatMessage } = intl

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [confirmedPassword, setConfirmedPassword] = useState(false)

  // Hooks
  const { cognito } = useAuthContext()
  const { alertSuccess, alertError } = useAlert()

  // Handlers
  const onForgotPasswordSuccess = (data) => {
    setIsLoading(false)
    setCodeSent(true)
    alertSuccess(formatMessage({ id: 'recovery_code_sent' }))
  }

  const onConfirmPasswordSuccess = (data) => {
    setIsLoading(false)
    setConfirmedPassword(true)
    alertSuccess(formatMessage({ id: 'password_updated' }))
  }

  const onError = (err) => {
    const { code } = err
    const translatableError = getTranslatableErrors(code)
    alertError(formatMessage({ id: translatableError.id }))
    setIsLoading(false)
  }

  const onSubmitRecoveryCode = values => {
    const { email } = values
    setEmail(email)
    setIsLoading(true)
    cognito.forgotPassword(email)
      .then(data => onForgotPasswordSuccess(data))
      .catch(err => onError(err))
  }

  const onSubmitConfirmPassword = values => {
    const { recoveryCode, newPassword } = values
    setIsLoading(true)

    cognito.confirmPassword(email, recoveryCode, newPassword)
      .then(data => onConfirmPasswordSuccess(data))
      .catch(err => onError(err))
  }

  return (
    <div className='forgot-password d-flex justify-content-center row text-center'>
      <div className='forgot-password-form bg-light col-md-12 col-xs-12'>
        {!codeSent
          ? <SendRecoveryCodeForm isLoading={isLoading} onSubmit={onSubmitRecoveryCode} />
          : <ConfirmPasswordForm isLoading={isLoading} email={email} disabled={confirmedPassword} onSubmit={onSubmitConfirmPassword} />}
        <Link className='nav-link' to='/login'>
          <FormattedMessage id='button.go_signin_page' />
        </Link>
      </div>
    </div>
  )
}

export default injectIntl(SignUp)
