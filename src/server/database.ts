import * as Mongo from "mongodb"

const mongo = Mongo.MongoClient
const url = process.env.MONGODB_URI || "mongodb://localhost:27017"

let db: Mongo.Db
let collection: Mongo.Collection

export default {
  // Connect to the database
  async connect(): Promise<void> {
    const client = await mongo.connect(url, { useNewUrlParser: true })
    db = client.db(process.env.MONGO_DB_NAME)
    collection = db.collection("data-points")
  },

  // Log some data
  async logData(
    date: Date,
    awake: boolean,
    batLvl?: number,
    slrLvl?: number,
    power?: boolean,
    pattern?: number,
  ): Promise<void> {
    // Check if it's still sleeping. if so, don't log any data.
    const lastEntry = await collection.findOne({}, { sort: { date: -1 } })

    if (lastEntry && !awake && !lastEntry.awake) return

    collection.insertOne({
      date,
      awake,
      batLvl,
      slrLvl,
      power,
      pattern,
    })
  },

  // Get all entries
  async getEntries() {
    return collection
      .find()
      .sort({ date: -1 })
      .limit(1000)
      .toArray()
  },
}
