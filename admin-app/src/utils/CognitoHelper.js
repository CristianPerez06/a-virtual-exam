import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { COGNITO_CODES } from '../common/constants'

class Cognito {
  constructor () {
    this.pool = new CognitoUserPool({
      UserPoolId: 'us-east-2_vUtKc2Ydz',
      ClientId: '10hno18t9psaht9i5trb8eoquf'
    })
    this.user = null
    this.login = this.login.bind(this)
    this.loginAndChangePassword = this.loginAndChangePassword.bind(this)
    this.logout = this.logout.bind(this)
    this.forgotPassword = this.forgotPassword.bind(this)
    this.confirmPassword = this.confirmPassword.bind(this)
    this.signUp = this.signUp.bind(this)
    this.getSession = this.getSession.bind(this)
  }

  login (userName, password) {
    return new Promise((resolve, reject) => {
      this.user = new CognitoUser({ Username: userName, Pool: this.pool })
      const authDetails = new AuthenticationDetails({ Username: userName, Password: password })
      const authCallbacks = {
        onSuccess: data => {
          resolve(data)
        },
        onFailure: err => {
          reject(err)
        },
        newPasswordRequired: data => {
          resolve({
            ...data,
            code: COGNITO_CODES.NEW_PASSWORD_REQUIRED
          })
        }
      }

      this.user.authenticateUser(authDetails, authCallbacks)
    })
  }

  loginAndChangePassword (userName, password, newPassword) {
    return new Promise((resolve, reject) => {
      this.user = new CognitoUser({ Username: userName, Pool: this.pool })
      const authDetails = new AuthenticationDetails({ Username: userName, Password: password })

      const authCallbacks = {
        onSuccess: data => {
          resolve(data)
        },
        onFailure: err => {
          reject(err)
        },
        newPasswordRequired: userAttr => {
          const challengeCallbacks = {
            onSuccess: data => resolve(data),
            onFailure: err => reject(err)
          }
          this.user.completeNewPasswordChallenge(newPassword, null, challengeCallbacks)
        }
      }
      this.user.authenticateUser(authDetails, authCallbacks)
    })
  }

  logout () {
    if (this.user) {
      this.user.storage.clear()
      this.user.signOut()
    }
  }

  forgotPassword (userName) {
    return new Promise((resolve, reject) => {
      this.user = new CognitoUser({ Username: userName, Pool: this.pool })
      const callbacks = {
        onSuccess: data => resolve(data),
        onFailure: err => reject(err)
      }
      this.user.forgotPassword(callbacks)
    })
  }

  confirmPassword (userName, verificationCode, newPassword) {
    return new Promise((resolve, reject) => {
      this.user = new CognitoUser({ Username: userName, Pool: this.pool })

      const callbacks = {
        onSuccess: data => resolve(data),
        onFailure: err => reject(err)
      }
      this.user.confirmPassword(verificationCode, newPassword, callbacks)
    })
  }

  signUp (username, password, attributes = [], customAttributes = []) {
    const attrList = attributes.map(attr => {
      return new CognitoUserAttribute({ Name: attr.name, Value: attr.value })
    })
    const customAttrList = customAttributes.map(attr => {
      return new CognitoUserAttribute({ Name: `custom:${attr.name}`, Value: attr.value })
    })

    return new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) reject(err)
        resolve(data)
      }
      this.pool.signUp(username, password, [...attrList, ...customAttrList], null, callback)
    })
  }

  getSession () {
    return new Promise((resolve, reject) => {
      const user = this.pool.getCurrentUser()
      if (user) {
        user.getSession(async (err, session) => {
          if (err) {
            reject(err)
          } else {
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attributes) => {
                if (err) {
                  reject(err)
                } else {
                  const results = {}

                  for (const attribute of attributes) {
                    const { Name, Value } = attribute
                    results[Name] = Value
                  }

                  resolve(results)
                }
              })
            })
            resolve({
              user,
              ...session,
              ...attributes
            })
          }
        })
      } else {
        // TO DO - Do something with error
        const err = 'something happened'
        reject(err)
      }
    })
  }
}

export default Cognito