# a-virtual-exam
Virtual exam is an app that allows students to take their exams online. 

### Frontend

- Javascript
- React
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

### Backend

- Javascript
- Node
- Express
- GraphQL
- apollo-server-express
- mongodb

### DB

- Mongo DB

## Installation

1. Rename the `.env.file` inside root folder to `.env` and fill the empty values:

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
 
3. Go to root folder
4. type `npm install`
5. Run the server: type `npm run back`
6. Run the client: type `npm run front`


