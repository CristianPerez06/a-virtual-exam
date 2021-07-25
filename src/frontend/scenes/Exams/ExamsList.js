import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import { useHistory, Link } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import { LIST_ASSIGNED_EXAMS } from '../../common/requests/assignedExams'
import { CREATE_EXAM, LIST_EXAMS } from '../../common/requests/exams'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useAlert } from '../../hooks'
import { ModalWrapper, LoadingInline, Table, NoResults } from '../../components/common'
import { getTranslatableErrors } from '../../common/graphqlErrorHandlers'
import { COOKIE_NAMES } from '../../common/constants'
import { syncCacheOnCreate, syncCacheOnDeleteAssignedExam } from './cacheHelpers'
import Cookies from 'js-cookie'
import { format } from 'date-fns'

const ExamsList = (props) => {
  // Props and params
  const { intl } = props
  const { formatMessage } = intl
  const idNumber = Cookies.get(COOKIE_NAMES.USER)

  // State
  const [assignedExams, setAssignedExams] = useState([])
  const [exams, setExams] = useState([])
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [filters, setFilters] = useState({})

  // Hooks
  const history = useHistory()
  const { alertError } = useAlert()

  // Button handlers
  const onStartClicked = (values) => {
    const { id, examTemplateId } = values
    setFilters({ assignedExamId: id, examTemplateId, idNumber })
    setConfirmModalIsOpen(true)
  }

  const onConfirmStartClicked = () => {
    createExam({
      variables: { ...filters },
      update: (cache, result) => {
        // Update AssignedExams Cache
        const variables = { idNumber: idNumber }
        const updatedExamsList = syncCacheOnCreate(cache, result.data.createExam, variables)

        // Update Exams Cache
        const assignedExamItem = { id: filters.assignedExamId, __typename: 'AssignedExam' }
        const updatedAssignedExamsList = syncCacheOnDeleteAssignedExam(cache, assignedExamItem, variables)

        setAssignedExams(updatedAssignedExamsList.data)
        setExams(updatedExamsList.data)
      }
    })
  }

  const onCancelClicked = () => {
    // if (deleting) return
    setFilters({})
    setConfirmModalIsOpen(!confirmModalIsOpen)
  }

  // Handlers
  const onSuccess = (result) => {
    setConfirmModalIsOpen(false)
    history.push({ pathname: `/exams/${result.createExam.id}` })
  }

  const onFetchAssignedExamsSuccess = (result) => {
    if (!result) return
    setAssignedExams(result.listAssignedExams.data)
  }

  const onFetchExamsSuccess = (result) => {
    if (!result) return
    setExams(result.listExams.data)
  }

  const onError = (err) => {
    const { graphQLErrors } = err
    const translatableError = getTranslatableErrors(graphQLErrors)
    setConfirmModalIsOpen(false)
    alertError(formatMessage({ id: translatableError.id }))
  }

  // Queries and mutations
  const { loading: fetchingAssignedExams } = useQuery(
    LIST_ASSIGNED_EXAMS,
    {
      variables: { idNumber: idNumber },
      fetchPolicy: 'network-only',
      onCompleted: onFetchAssignedExamsSuccess,
      onError
    }
  )
  const { loading: fetchingExams } = useQuery(
    LIST_EXAMS,
    {
      variables: { idNumber: idNumber },
      fetchPolicy: 'network-only',
      onCompleted: onFetchExamsSuccess,
      onError
    }
  )
  const [createExam, { loading: creatingExam }] = useMutation(CREATE_EXAM, { onCompleted: onSuccess, onError })

  // Other
  const columnsAssignedExamTranslations = {
    dateAssigned: formatMessage({ id: 'date_assigned' }),
    courseName: formatMessage({ id: 'course_name' }),
    examTemplateName: formatMessage({ id: 'exam_template_name' }),
    action: formatMessage({ id: 'action' }),
    start: formatMessage({ id: 'button.start' })
  }

  const columnsAssignedExam = [
    {
      Header: columnsAssignedExamTranslations.dateAssigned,
      accessor: 'created',
      Cell: ({ row }) => format(new Date(row.original.created), 'yyyy-MM-dd')
    },
    {
      Header: columnsAssignedExamTranslations.courseName,
      accessor: 'courseName',
      Cell: ({ row }) => row.values.courseName
    },
    {
      Header: columnsAssignedExamTranslations.examTemplateName,
      accessor: 'examTemplateName',
      Cell: ({ row }) => row.values.examTemplateName
    },
    {
      Header: columnsAssignedExamTranslations.action,
      Cell: ({ row }) => (
        <div className='d-flex justify-content-center'>
          <Button
            className='ml-1'
            color='primary'
            disabled={creatingExam}
            onClick={() => {
              onStartClicked({ ...row.original })
            }}
          >
            {columnsAssignedExamTranslations.start}
            {creatingExam && (filters.assignedExamId === row.original.id) && <LoadingInline className='ml-3' />}
          </Button>
        </div>
      )
    }
  ]

  const columnsExamTranslations = {
    dateStarted: formatMessage({ id: 'date_started' }),
    dateFinished: formatMessage({ id: 'date_finished' }),
    courseName: formatMessage({ id: 'course_name' }),
    examName: formatMessage({ id: 'exam_name' }),
    action: formatMessage({ id: 'action' }),
    score: formatMessage({ id: 'score' }),
    goToExam: formatMessage({ id: 'button.go_to_exam' }),
    goToExamDetails: formatMessage({ id: 'button.details' })
  }

  const columnsExam = [
    {
      Header: columnsExamTranslations.dateStarted,
      accessor: 'dateStarted',
      Cell: ({ row }) => {
        return (
          <div className='row'>
            <div className='col-md-12 col-xs-12'>
              {format(new Date(row.original.created), 'yyyy-MM-dd')}
            </div>
            <div className='col-md-12 col-xs-12'>
              {format(new Date(row.original.created), 'h:mm a')}
            </div>
          </div>
        )
      }
    },
    {
      Header: columnsExamTranslations.dateFinished,
      accessor: 'dateFinished',
      Cell: ({ row }) => {
        return (row.original.updated && row.original.completed === true)
          ? (
            <>
              <div className='col-md-12 col-xs-12'>
                {format(new Date(row.original.updated), 'yyyy-MM-dd')}
              </div>
              <div className='col-md-12 col-xs-12'>
                {format(new Date(row.original.updated), 'h:mm a')}
              </div>
            </>
            )
          : '-'
      }
    },
    {
      Header: columnsExamTranslations.courseName,
      accessor: 'courseName',
      Cell: ({ row }) => row.original.courseName
    },
    {
      Header: columnsExamTranslations.examName,
      accessor: 'name',
      Cell: ({ row }) => row.original.name
    },
    {
      Header: columnsExamTranslations.score,
      accessor: 'score',
      Cell: ({ row }) => (row.original).score ?? '-'
    },
    {
      Header: columnsExamTranslations.action,
      Cell: ({ row }) => {
        return (
          <div className='d-flex justify-content-center'>
            {row.original.updated && row.original.completed === true
              ? (
                <Link to={`/exams/${row.original.id}/details`}>
                  <Button color='outline-secondary' className='m-2' disabled={creatingExam}>
                    {columnsExamTranslations.goToExamDetails}
                  </Button>
                </Link>
                )
              : (
                <Link to={`/exams/${row.original.id}`}>
                  <Button color='secondary' className='m-2' disabled={creatingExam}>
                    {columnsExamTranslations.goToExam}
                  </Button>
                </Link>
                )}
          </div>
        )
      }
    }
  ]

  return (
    <div className='exams-list'>
      <Card className='mx-auto shadow mb-3 bg-white rounded'>
        <CardHeader className='d-flex justify-content-between align-items-center bg-light'>
          <p className='h4'>
            <FormattedMessage id='common_entity.exams' />
          </p>
        </CardHeader>
        <CardBody className='d-flex flex-column'>

          {/* Pending exams */}
          <div className='row mb-3'>
            <div className='col-md-12 col-xs-12'>
              <p className='text-center h5 mb-0'>
                <FormattedMessage id='pending_exams' />
              </p>
              {fetchingAssignedExams && <div className='mt-2 mb-3 text-center'><LoadingInline color='grey' /></div>}
              {!fetchingAssignedExams && assignedExams.length === 0 && <NoResults />}
              {!fetchingAssignedExams && assignedExams.length !== 0 && <Table columns={columnsAssignedExam} data={assignedExams} />}
            </div>
          </div>

          {/* Exams */}
          <div className='row mt-4'>
            <div className='col-md-12 col-xs-12'>
              <p className='text-center h5 mb-0'>
                <FormattedMessage id='exams_initiated_finalized' />
              </p>
              {fetchingExams && <div className='mt-2 mb-3 text-center'><LoadingInline color='grey' /></div>}
              {!fetchingExams && exams.length === 0 && <NoResults />}
              {!fetchingExams && exams.length !== 0 && <Table columns={columnsExam} data={exams} />}
            </div>
          </div>

          {/* Delete modal */}
          <div id='delete-modal'>
            <ModalWrapper
              modalIsOpen={confirmModalIsOpen}
              headerTextId='common_title.start_exam_confirmation'
              bodyTextId='confirm_start_exam'
              buttonTextId='button.confirm_start'
              buttonColor='success'
              onCloseClick={() => onCancelClicked()}
              onConfirmClick={() => onConfirmStartClicked()}
            />
          </div>

        </CardBody>
      </Card>
    </div>
  )
}

export default injectIntl(ExamsList)
