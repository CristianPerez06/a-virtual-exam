const { EXERCISES_VALIDATION_PARAMETERS } = require('../../utilities/constants')

const getExamMetrics = (dateStrFrom, dateStrTo) => {
  return [
    {
      $project: {
        courseId: 1,
        courseName: 1,
        completed: 1,
        score: 1,
        updated: {
          $dateFromString: {
            dateString: '$updated'
          }
        }
      }
    },
    {
      $match: {
        completed: true,
        updated: {
          $gte: new Date(dateStrFrom),
          $lt: new Date(dateStrTo)
        }
      }
    },
    {
      $group: {
        _id: '$courseId',
        courseName: {
          $first: '$courseName'
        },
        total: {
          $sum: 1
        },
        totalPassed: {
          $sum: {
            $cond: [
              { $gte: ['$score', EXERCISES_VALIDATION_PARAMETERS.PASSING_SCORE] },
              1,
              0
            ]
          }
        },
        totalFailed: {
          $sum: {
            $cond: [
              { $lt: ['$score', EXERCISES_VALIDATION_PARAMETERS.PASSING_SCORE] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        courseId: '$_id',
        courseName: 1,
        total: 1,
        totalPassed: 1,
        totalFailed: 1
      }
    },
    {
      $limit: 10
    }
  ]
}

const getExamsReportData = (dateStrFrom, dateStrTo) => {
  return [
    {
      $project: {
        _id: 1,
        name: 1,
        courseId: 1,
        courseName: 1,
        created: 1,
        completed: 1,
        score: 1,
        exercises: 1,
        updated: {
          $dateFromString: {
            dateString: '$updated'
          }
        }
      }
    },
    {
      $match: {
        updated: {
          $gte: new Date(dateStrFrom),
          $lt: new Date(dateStrTo)
        },
        completed: true
      }
    },
    {
      $group: {
        _id: '$courseId',
        name: {
          $first: '$courseName'
        },
        total: {
          $sum: 1
        },
        addedScores: {
          $sum: '$score'
        },
        totalPassedExams: {
          $sum: {
            $cond: {
              if: {
                $gte: [
                  '$score', 6
                ]
              },
              then: 1,
              else: 0
            }
          }
        },
        totalFailedExams: {
          $sum: {
            $cond: {
              if: {
                $lt: [
                  '$score', 6
                ]
              },
              then: 1,
              else: 0
            }
          }
        },
        maxScore: {
          $max: '$score'
        },
        minScore: {
          $min: '$score'
        },
        exercises: {
          $push: '$exercises'
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        total: 1,
        totalPassedExams: 1,
        totalFailedExams: 1,
        avgScore: {
          $divide: [
            '$addedScores', '$total'
          ]
        },
        avgPassedExams: {
          $divide: [
            '$totalPassedExams', '$total'
          ]
        },
        avgFailedExams: {
          $divide: [
            '$totalFailedExams', '$total'
          ]
        },
        maxScore: 1,
        minScore: 1,
        exercises: {
          $reduce: {
            input: '$exercises',
            initialValue: [],
            in: {
              $concatArrays: [
                '$$value', '$$this'
              ]
            }
          }
        }
      }
    }
  ]
}

module.exports = {
  getExamMetrics,
  getExamsReportData
}
