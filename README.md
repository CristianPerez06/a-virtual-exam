# a-virtual-exam

A comprehensive online examination system that enables educators to create, manage, and administer digital exams while allowing students to take assessments remotely.

## Tech stack

- Javascript
- ReactJS
- bootstrap
- amazon-cognito-identity-js
- GraphQL
- react-apollo
- react-chartjs-2
- react-datepicker
- react-final-form
- react-icons
- react-images-uploading
- react-intl
- react-select
- react-table
- react-toastify
- react-timer-hook
- reactstrap
- NodeJS
- Express
- apollo-server-express
- mongodb

## Getting Started

1. In the root folder, locate the `.env.file` and rename it to `.env`.
2. Open the newly renamed `.env` file and provide values for all required environment variables (any fields that are currently empty).

```
# ------ SERVER ------
DB=virtual-exam
COGNITO_CLIENT_ID=
COGNITO_REGION=
COGNITO_USER_POOL_ID=

# only for dev
DEFAULT_CONNECTION_URL=
# only for prod
# CONNECTION_URL=

# ------ CLIENT ------
REACT_APP_COGNITO_ACCESS_KEY=
REACT_APP_COGNITO_CLIENT_ID=
REACT_APP_COGNITO_REGION=
REACT_APP_COGNITO_SECRET_ACCESS_KEY=
REACT_APP_COGNITO_USER_POOL_ID=
REACT_APP_BUCKET_S3_NAME=
REACT_APP_BUCKET_S3_REGION=

#prod
#REACT_APP_API=/graphql
#dev
REACT_APP_API=http://localhost:4000/graphql
```

3. Open a terminal and navigate to the root folder of the project.
4. Install all dependencies by running: `npm install`
5. Start the backend server by running: `npm run back`
6. In a new terminal window, start the frontend client by running: `npm run front`
