import fs from 'fs'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongodb from 'mongodb'

import { generate } from './lib/json-schema.js'

const { MongoClient } = mongodb
const mongod = new MongoMemoryServer();

const client = new MongoClient(await mongod.getUri(), { useUnifiedTopology: true })
await client.connect()

const db = client.db("test");
const movies = db.collection("movies");
await movies.insertMany([
  { name: "Red", town: "kanto", meta: { year: '1993' } },
  { name: true, town: new Date(), optional: true, meta: { year: '1993' } }
]);

const jsonSchema = await generate(movies.find())

if (!fs.existsSync('./dist')){
  fs.mkdirSync('./dist');
}
fs.writeFileSync('./dist/json-schema.json', JSON.stringify(jsonSchema, null, 2))

await client.close();
await mongod.stop();