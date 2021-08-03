import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import { injectIntl, FormattedMessage } from 'react-intl'
import mapStudents from '../../common/utils'
import { useCognitoUsers } from '../../hooks'
import { Link } from 'react-router-dom'
import { Loading, Table, NoResults } from '../../components/common'

const StudentsList = (props) => {
  // Props and params
  const { intl } = props
  const { formatMessage } = intl

  // Hooks
  const [cognitoUsers, fetchingCognitoUsers] = useCognitoUsers()

  // State
  const [students, setStudents] = useState([])

  const columnTranslations = {
    idNumber: formatMessage({ id: 'student_id_number' }),
    student: formatMessage({ id: 'common_entity.student' }),
    action: formatMessage({ id: 'action' }),
    manage: formatMessage({ id: 'button.manage_exams' })
  }

  const columns = React.useMemo(
    () => {
      return [
        {
          Header: columnTranslations.idNumber,
          accessor: 'value',
          Cell: ({ row }) => row.original.value
        },
        {
          Header: columnTranslations.student,
          accessor: 'label',
          Cell: ({ row }) => row.original.label
        },
        {
          Header: columnTranslations.action,
          Cell: ({ row }) => (
            <div className='d-flex justify-content-center'>
              <Link to={`/students/manage-exams/${row.original.value}`}>
                <Button color='info'>{columnTranslations.manage}</Button>
              </Link>
            </div>
          )
        }
      ]
    },
    [columnTranslations]
  )

  useEffect(() => {
    if (!fetchingCognitoUsers) {
      const mappedStudents = mapStudents(cognitoUsers)
      setStudents(mappedStudents)
    }
  }, [cognitoUsers, fetchingCognitoUsers])

  return (
    <div className='students-list'>
      {fetchingCognitoUsers && <Loading />}
      {!fetchingCognitoUsers &&
        <Card className='mx-auto shadow mb-3 bg-white rounded'>
          <CardHeader className='d-flex justify-content-between align-items-center bg-light'>
            <p className='h4'>
              <FormattedMessage id='common_entity.students' />
            </p>
          </CardHeader>
          <CardBody className='d-flex flex-column'>
            <div id='students-list'>
              {students.length === 0
                ? <NoResults />
                : <Table columns={columns} data={students} />}
            </div>
          </CardBody>
        </Card>}
    </div>
  )
}

export default injectIntl(StudentsList)
