import React from 'react'
import XlsxPopulate from 'xlsx-populate'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Button } from 'reactstrap'
import { useAlert } from '../../../hooks'

const Reports = (props) => {
  // Props and params
  const { data, disabled = true, intl } = props
  const { formatMessage } = intl

  // Hooks
  const { alertError } = useAlert()

  const commonStyles = {
    fontColor: '000000',
    border: true,
    horizontalAlignment: 'left'
  }

  const fillWorkbook = (workbook, reportItem, itemIndex, sheetName) => {
    // Header
    workbook.sheet(0)
      .range(`A${itemIndex}:B${itemIndex}`)
      .merged(true)
      .value(reportItem.name)
      .style({
        ...commonStyles,
        bold: true,
        fontSize: 14,
        horizontalAlignment: 'center',
        fill: { type: 'solid', color: '808080' }
      })

    // Data
    workbook.sheet(0)
      .cell(`A${itemIndex + 1}`)
      .value(formatMessage({ id: 'report_exams_total' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 1}`)
      .value(reportItem.total)
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .range(`C${itemIndex + 1}:D${itemIndex + 1}`)
    //   .merged(true)
    //   .value(formatMessage({ id: 'report_high_approval_exercise' }))
    //   .style({
    //     bold: true,
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 1}`)
    //   .value('')
    //   .style({
    //     ...commonStyles
    //   })

    workbook.sheet(0)
      .cell(`A${itemIndex + 2}`)
      .value(formatMessage({ id: 'report_total_passed_exams' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 2}`)
      .value(reportItem.totalPassedExams)
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .cell(`C${itemIndex + 2}`)
    //   .value(formatMessage({ id: 'report_id' }))
    //   .style({
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 2}`)
    //   // .value(reportItem.exerciseHighApprovalId)
    //   .value('1234')
    //   .style({
    //     ...commonStyles
    //   })

    workbook.sheet(0)
      .cell(`A${itemIndex + 3}`)
      .value(formatMessage({ id: 'report_total_failed_exams' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 3}`)
      .value(reportItem.totalFailedExams)
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .cell(`C${itemIndex + 3}`)
    //   .value(formatMessage({ id: 'report_title' }))
    //   .style({
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 3}`)
    //   // .value(reportItem.exerciseHighApprovalTitle)
    //   .value('ExerciseHighApprovalTitle')
    //   .style({
    //     ...commonStyles
    //   })

    workbook.sheet(0)
      .cell(`A${itemIndex + 4}`)
      .value(formatMessage({ id: 'report_avg_passed_exams' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 4}`)
      .value((Math.round(reportItem.avgPassedExams * 100) / 100).toFixed(2) + '%')
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .range(`C${itemIndex + 4}:D${itemIndex + 4}`)
    //   .merged(true)
    //   .value(formatMessage({ id: 'report_low_approval_exercise' }))
    //   .style({
    //     bold: true,
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 4}`)
    //   .value('')
    //   .style({
    //     ...commonStyles
    //   })

    workbook.sheet(0)
      .cell(`A${itemIndex + 5}`)
      .value(formatMessage({ id: 'report_avg_failed_exams' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 5}`)
      .value((Math.round(reportItem.avgFailedExams * 100) / 100).toFixed(2) + '%')
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .cell(`C${itemIndex + 5}`)
    //   .value(formatMessage({ id: 'report_id' }))
    //   .style({
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 5}`)
    //   // .value(reportItem.exerciseLowApprovalId)
    //   .value('1234')
    //   .style({
    //     ...commonStyles
    //   })

    workbook.sheet(0)
      .cell(`A${itemIndex + 6}`)
      .value(formatMessage({ id: 'report_avg_score' }))
      .style({
        bold: true,
        ...commonStyles
      })

    workbook.sheet(0)
      .cell(`B${itemIndex + 6}`)
      .value(reportItem.avgScore)
      .value((Math.round(reportItem.avgFailedExams * 100) / 100).toFixed(2))
      .style({
        ...commonStyles
      })

    // workbook.sheet(0)
    //   .cell(`C${itemIndex + 6}`)
    //   .value(formatMessage({ id: 'report_title' }))
    //   .style({
    //     ...commonStyles
    //   })

    // workbook.sheet(0)
    //   .cell(`D${itemIndex + 6}`)
    //   // .value(reportItem.exerciseLowApprovalTitle)
    //   .value('ExerciseLowApprovalTitle')
    //   .style({
    //     ...commonStyles
    //   })

    return workbook
  }

  const getWorkbook = () => {
    return XlsxPopulate.fromBlankAsync()
  }

  const generate = (type) => {
    return getWorkbook()
      .then(function (workbook) {
        // Init workbook
        const sheetName = formatMessage({ id: 'report_filename' })
        workbook.sheet(0).name(sheetName)
        workbook.sheet(0).column('A').width(50)
        workbook.sheet(0).column('B').width(10)
        workbook.sheet(0).column('C').width(50)
        workbook.sheet(0).column('D').width(50)

        // Fill workbook
        let index = 1
        data.forEach(item => {
          workbook = fillWorkbook(workbook, item, index)
          index += 7
        })
        return workbook.outputAsync({ type: type })
      })
  }

  const generateBlob = () => {
    const fileName = formatMessage({ id: 'report_filename' }) + '.xlsx'

    return generate()
      .then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.href = url
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      })
      .catch(function (err) {
        alertError(formatMessage({ id: 'common_error.couldnt_generate_report' }))
        throw err
      })
  }

  const getReportData = () => {
    generateBlob()
  }

  return (
    <Button
      className='mt-4'
      disabled={disabled}
      onClick={getReportData}
    >
      <FormattedMessage id='button.generate_report' />
    </Button>
  )
}

export default injectIntl(Reports)
