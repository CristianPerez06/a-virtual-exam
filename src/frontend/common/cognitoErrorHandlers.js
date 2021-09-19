import { COGNITO_ERROR_CODES } from '../common/constants'

export const getTranslatableErrors = (cognitoError) => {
  let errorCode = { id: 'common_error.internal_server_error' }

  switch (cognitoError) {
    case COGNITO_ERROR_CODES.USERNAME_EXISTS:
      errorCode = { id: 'cognito_error.username_exists' }
      break
    case COGNITO_ERROR_CODES.INVALID_PASSWORD_EXCEPTION:
      errorCode = { id: 'cognito_error.invalid_parameter_exception' }
      break
    case COGNITO_ERROR_CODES.NOT_AUTHORIZED:
      errorCode = { id: 'cognito_error.not_authorized_exception' }
      break
    case COGNITO_ERROR_CODES.INVALID_PARAMETER_EXCEPTION:
      errorCode = { id: 'cognito_error.invalid_parameter_exception' }
      break
    case COGNITO_ERROR_CODES.CODE_MISMATCH_EXCEPTION:
      errorCode = { id: 'cognito_error.code_mismatch_exception' }
      break
    case COGNITO_ERROR_CODES.EXPIRED_CODE:
      errorCode = { id: 'cognito_error.expired_code' }
      break
  }

  return errorCode
}
