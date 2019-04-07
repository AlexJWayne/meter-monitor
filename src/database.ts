import * as Mongo from "mongodb"
import { MongoClient, Db } from "mongodb"

const mongo = Mongo.MongoClient
const url = "mongodb://localhost:27017"

let db: Mongo.Db

export default {
  // Connect to the database
  async connect(): Promise<void> {
    const client = await mongo.connect(url)
    db = client.db("meter-monitor")
  },

  // Log some data
  async logData(
    date: Date,
    awake: boolean,
    batLvl?: number,
    slrLvl?: number,
    power?: boolean,
  ): Promise<void> {
    const collection = db.collection("data-points")
    collection.insertOne({
      date,
      awake,
      batLvl,
      slrLvl,
      power,
    })
  },

  // Get all entries
  async getEntries() {
    const collection = db.collection("data-points")
    return collection.find().toArray()
  },
}
