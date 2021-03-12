import util from 'util'
import parseSchema from 'mongodb-schema'

const parseSchemaAsync = util.promisify(parseSchema)

const arrayIfMany = arr => arr.length > 1 ? arr : arr[0]

export const resolveFields = (fields) => fields.reduce((acc, field) => {
  return { 
    ...acc, 
    properties: { 
      ...acc.properties,
      [field.name]: (field.type === 'Document') 
        ? resolveFields(field.types[0].fields)
        : { bsonType: arrayIfMany(field.types.map(type => type.bsonType)) } 
    }
  }
}, { bsonType: "object", properties: {} })

export const generate = async (cursor) => {
  const schema = await parseSchemaAsync(cursor, { semanticTypes: true })
  return resolveFields(schema.fields)
}