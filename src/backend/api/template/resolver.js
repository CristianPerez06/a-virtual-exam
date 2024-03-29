const { ApolloError } = require('apollo-server-express')
const { ObjectId } = require('bson')
const { BACKEND_ERRORS } = require('../../utilities/constants')
const { addItemToList, removeItemFromList } = require('../../utilities/arrayHelpers')
const { prepSingleResultForUser, prepMultipleResultsForUser } = require('../../utilities/prepResults')
const { maintainIndex } = require('../../indexer')
const { getExamTemplates, getExercises } = require('./aggregates')

const debug = require('debug')('a-virtual-exam:exam-templates-resolver')

const init = () => {
  maintainIndex({
    shared: true,
    collectionName: 'exam-templates',
    indexVersion: 1,
    spec: { 'name.text': 'text' },
    options: {
      // weights: { 'name.text': 100 },
      name: 'search_index'
    }
  })
}

init()

const resolver = {
  Query: {
    getExamTemplate: async (parent, args, context) => {
      debug('Running getExamTemplate query with params:', args)

      // Params
      const { id } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Query
      const query = {
        _id: new ObjectId(id)
      }

      // Exec
      const docs = await collection
        .find(query)
        .toArray()

      // Results
      return prepSingleResultForUser(docs[0])
    },
    listExamTemplates: async (parent, args, context) => {
      debug('Running listExamTemplates query with params:', args)

      // Params
      const { name, courseId } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Aggregate
      let aggregate = getExamTemplates(name, courseId)
      aggregate = [
        ...aggregate,
        {
          $sort: { name: 1 }
        }
      ]
      debug('Aggregate: ', aggregate)

      // Exec
      const docs = await collection.aggregate(aggregate).toArray()

      // Results
      return prepMultipleResultsForUser(docs)
    },
    listValidExamTemplates: async (parent, args, context) => {
      debug('Running listExamTemplates query with params:', args)

      // Params
      const { name, courseId } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Aggregate
      const withExerciseValidations = true
      const aggregate = getExamTemplates(name, courseId, withExerciseValidations)
      debug('Aggregate: ', aggregate)

      // Exec
      const docs = await collection.aggregate(aggregate).toArray()

      // Results
      return prepMultipleResultsForUser(docs)
    },
    listExamTemplateExercises: async (parent, args, context) => {
      debug('Running listExamTemplateExercises query with params:', args)

      // Params
      const { id } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Aggregate
      const aggregate = [
        { $match: { _id: new ObjectId(id) } },
        ...getExercises
      ]

      // Exec
      const res = await collection.aggregate(aggregate).toArray()

      // Results
      const data = res.map(x => {
        const exerciseWithPoints = {
          ...x.exercise,
          points: x.exercise.points || 0
        }
        return prepSingleResultForUser(exerciseWithPoints)
      })

      return { id: id, data: data, count: data.length }
    }
  },

  Mutation: {
    createExamTemplate: async (parent, args, context) => {
      debug('Running createExamTemplate mutation with params:', args)

      // Args
      const { name, courseId } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Look up for duplicates
      const docWithSameName = await collection.findOne({ name: name })
      const isDuplicated = docWithSameName &&
        (docWithSameName.courseId || '').toString() === courseId &&
        docWithSameName.disabled !== true
      if (isDuplicated) {
        throw new ApolloError(BACKEND_ERRORS.DUPLICATED_ENTITY)
      }

      // Query
      const newItem = {
        _id: new ObjectId(),
        name: name,
        courseId: new ObjectId(courseId),
        created: new Date().toISOString()
      }

      // Exec
      const response = await collection.insertOne(newItem, { writeConcern: { w: 'majority' } })

      // Results
      if (response.result.ok !== 1) {
        debug('createExamTemplate error:', response.error.message)
        throw new Error(response.error.message)
      }
      return prepSingleResultForUser(response.ops[0])
    },
    updateExamTemplate: async (parent, args, context) => {
      debug('Running updateExamTemplate mutation with params:', args)

      // Args
      const { id, name, courseId } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Look up for duplicates
      const docWithSameName = await collection.findOne({ name: name })
      const isDuplicated = docWithSameName &&
        (docWithSameName.courseId || '').toString() === courseId &&
        docWithSameName.disabled !== true
      if (isDuplicated) {
        throw new ApolloError(BACKEND_ERRORS.DUPLICATED_ENTITY)
      }

      // Query
      const update = {
        $set: {
          name,
          courseId: new ObjectId(courseId),
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('updateExamTemplate error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }
      return prepSingleResultForUser(response.value)
    },
    disableExamTemplate: async (parent, args, context) => {
      debug('Running disableExamTemplate mutation with params:', args)

      // Args
      const { id } = args
      const objTempId = new ObjectId(id)

      // Collection
      const collection = context.db.collection('exam-templates')
      const assignedExamsCollection = context.db.collection('assigned-exams')

      // Validate related entities
      const findRelatedEntities = [{
        $match: {
          disabled: { $ne: true },
          examTemplateId: { $eq: objTempId }
        }
      }]
      const assignedExamsRelated = await assignedExamsCollection.aggregate(findRelatedEntities).toArray()
      debug('assignedExamsRelated: ', assignedExamsRelated)
      if (assignedExamsRelated.length !== 0) {
        throw new ApolloError(BACKEND_ERRORS.RELATED_ENTITY_EXISTS)
      }

      // Query
      const update = {
        $set: {
          disabled: true,
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('disableExamTemplate error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }
      return prepSingleResultForUser(response.value)
    },
    deleteExamTemplate: async (parent, args, context) => {
      debug('Running deleteExamTemplate mutation with params:', args)

      // Args
      const { id } = args

      // Collection
      const collection = context.db.collection('exam-templates')

      // Query
      const query = { _id: new ObjectId(id) }

      // Exec
      const { result } = await collection.deleteOne(query, { w: 'majority' })

      // Results
      if (result && result.n === 1 && result.ok === 1) {
        return { done: true }
      } else {
        debug('deleteExamTemplate error:', BACKEND_ERRORS.DELETE_FAILED)
        throw new Error(BACKEND_ERRORS.DELETE_FAILED)
      }
    },
    resetExamTemplate: async (parent, args, context) => {
      debug('Running resetExamTemplate mutation with params:', args)

      // Args
      const { id } = args
      const objTempId = new ObjectId(id)

      // Collection
      const collection = context.db.collection('exam-templates')

      // Query
      const update = {
        $set: {
          courseId: null,
          exercises: [],
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: objTempId }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('resetExamTemplate error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }

      return { done: true }
    },
    addExerciseToExamTemplate: async (parent, args, context) => {
      debug('Running addExerciseToExamTemplate mutation with params:', args)

      // Args
      const { templateId, exerciseId } = args
      const objTempId = new ObjectId(templateId)
      const objExercId = new ObjectId(exerciseId)

      // Collection
      const collection = context.db.collection('exam-templates')
      const examTemplate = await collection.findOne({ _id: objTempId })
      const examTemplateExercises = examTemplate.exercises || []

      const exercisesCollection = context.db.collection('exercises')
      const currentExercise = await exercisesCollection.findOne({ _id: objExercId })

      const unitsCollection = context.db.collection('units')
      const currentUnit = await unitsCollection.findOne({ _id: currentExercise.unitId })

      // Look up for duplicates
      const dupExercise = examTemplateExercises.find(x => x._id.toString() === objExercId.toString())
      if (dupExercise) {
        throw new ApolloError(BACKEND_ERRORS.DUPLICATED_ENTITY)
      }

      const newExercises = addItemToList(examTemplateExercises, { _id: objExercId })

      // Query
      const update = {
        $set: {
          exercises: newExercises,
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: objTempId }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('addExerciseToExamTemplate error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }

      const exerciseWithPoints = { ...currentExercise, unitName: currentUnit.name, points: 0 }
      return prepSingleResultForUser(exerciseWithPoints)
    },
    removeExerciseFromExamTemplate: async (parent, args, context) => {
      debug('Running removeExerciseFromExamTemplate mutation with params:', args)

      // Args
      const { templateId, exerciseId } = args
      const objTempId = new ObjectId(templateId)
      const objExercId = new ObjectId(exerciseId)

      // Collection
      const collection = context.db.collection('exam-templates')
      const examTemplate = await collection.findOne({ _id: objTempId })

      const exercisesCollection = context.db.collection('exercises')
      const currentExercise = await exercisesCollection.findOne({ _id: objExercId })

      // Query
      const examTemplateExercises = examTemplate.exercises || []
      const updatedExercisesList = removeItemFromList(examTemplateExercises, { _id: objExercId })

      const update = {
        $set: {
          exercises: updatedExercisesList,
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: objTempId }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('removeExerciseFromExamTemplate error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }

      return prepSingleResultForUser(currentExercise)
    },
    updateExerciseNote: async (parent, args, context) => {
      debug('Running updateExerciseNote mutation with params:', args)

      // Args
      const { id, exerciseId, exercisePoints } = args
      const objTempId = new ObjectId(id)
      const objExercId = new ObjectId(exerciseId)

      // Collection
      const collection = context.db.collection('exam-templates')
      const examTemplate = await collection.findOne({ _id: objTempId })

      const exercisesCollection = context.db.collection('exercises')
      const currentExercise = await exercisesCollection.findOne({ _id: objExercId })
      const floatDecimalPoints = parseFloat(exercisePoints)
      currentExercise.points = floatDecimalPoints

      const updatedExercises = examTemplate.exercises.map((exercise) => {
        if (exercise._id.toString() !== objExercId.toString()) return exercise

        exercise.points = floatDecimalPoints
        return exercise
      })

      // Query
      const update = {
        $set: {
          exercises: updatedExercises,
          updated: new Date().toISOString()
        }
      }

      // Exec
      const response = await collection.findOneAndUpdate({ _id: objTempId }, update, { returnDocument: 'after', w: 'majority' })

      // Results
      if (response.ok !== 1) {
        debug('updateExerciseNote error:', response.lastErrorObject)
        throw new Error(response.lastErrorObject)
      }

      return prepSingleResultForUser(currentExercise)
    }
  }
}

module.exports = {
  resolver
}
