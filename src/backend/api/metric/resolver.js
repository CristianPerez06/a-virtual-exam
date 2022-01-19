const { prepMultipleResultsForUser } = require('../../utilities/prepResults')
const { getExamMetrics, getExamsReportData } = require('./aggregates')

const debug = require('debug')('a-virtual-exam:metric-resolver')

const resolver = {
  Query: {
    getExamMetrics: async (parent, args, context) => {
      debug('Running getMetrics query with params:', args)

      // Params
      const { dateFrom, dateTo } = args

      // Collection
      const collection = context.db.collection('exams')

      // Aggregate
      const aggregate = getExamMetrics(dateFrom, dateTo)
      debug('Aggregate: ', aggregate)

      // Exec
      const res = await collection.aggregate(aggregate).toArray()

      // Results
      const result = {
        data: res,
        count: res.length
      }

      return result
    },
    getExamsReportData: async (parent, args, context) => {
      debug('Running getExamsReportData query with params:', args)

      // Params
      const { dateFrom, dateTo } = args

      // Collection
      const collection = context.db.collection('exams')

      // Aggregates
      const reportsDataAggregate = getExamsReportData(dateFrom, dateTo)
      debug('ReportsDataAggregate: ', reportsDataAggregate)

      // Exec
      const reportDocs = await collection.aggregate(reportsDataAggregate).toArray()

      // Results
      return prepMultipleResultsForUser(reportDocs)
    }
  }
}

module.exports = {
  resolver
}
