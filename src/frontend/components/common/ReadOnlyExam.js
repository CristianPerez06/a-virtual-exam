import React, { useState, useEffect } from 'react'
import { Form, Label } from 'reactstrap'
import { ButtonGoTo } from '../../components/common'
import { EXAM_SETTINGS } from '../../common/constants'
import { injectIntl, FormattedMessage } from 'react-intl'
import ReadOnlyExamExercise from './ReadOnlyExamExercise'
import { useCognitoUsers } from '../../hooks'
import mapStudents from '../../common/utils'

const ReadOnlyExam = (props) => {
  // Props and params
  const { exam, goBackPath } = props

  // State
  const [studentName, setStudentName] = useState()

  // Hooks
  const [cognitoUsers, fetchingCognitoUsers] = useCognitoUsers()

  useEffect(() => {
    if (!fetchingCognitoUsers) {
      try {
        const mappedStudents = mapStudents(cognitoUsers)
        const examStudent = mappedStudents.find(x => x.value === exam.idNumber)
        setStudentName(examStudent.label)
      } catch (err) {
        console.log(err)
      }
    }
  }, [cognitoUsers, fetchingCognitoUsers, exam])

  return (
    <Form>
      <div className='student-info h4'>
        <span className='d-block'>
          <b><FormattedMessage id='common_entity.student' />:</b> <span> {exam.idNumber} </span> {studentName && <span> - {studentName} </span>}
        </span>
      </div>
      <hr />
      <div className='timer d-flex justify-content-between'>
        <span className='h4'>
          <div className={`text-${exam.score >= EXAM_SETTINGS.PASSING_SCORE ? 'success' : 'danger'}`}>
            <em>
              {exam.score >= EXAM_SETTINGS.PASSING_SCORE
                ? <FormattedMessage id='exams_passed' />
                : <FormattedMessage id='exams_failed' />}
            </em>
          </div>
        </span>

        <div className='border border-secondary shadow p-2 mb-1 bg-white rounded text-right'>
          <i><FormattedMessage id='score' />: {exam.score}</i>
        </div>
      </div>
      <hr />
      <Label className='h4'>{exam.name}</Label>
      {exam.exercises.map((exercise, exerciseIndex) => {
        return (
          <ReadOnlyExamExercise
            key={exerciseIndex}
            exercise={exercise}
            index={exerciseIndex + 1}
          />
        )
      })}
      <div id='buttons' className='d-flex justify-content-center'>
        <ButtonGoTo
          path={goBackPath}
          color='secondary'
          translatableTextId='button.go_to_list'
        />
      </div>
    </Form>
  )
}

export default injectIntl(ReadOnlyExam)
