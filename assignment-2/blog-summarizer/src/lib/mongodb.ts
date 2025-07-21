import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI!

if (!uri) {
  throw new Error("Missing MongoDB URI environment variable")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the value
  // across module reloads caused by HMR (Hot Module Replacement)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function connectToMongoDB(): Promise<Db> {
  try {
    const client = await clientPromise
    return client.db("blog_summarizer")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export interface BlogContent {
  _id?: string
  url: string
  title: string
  content: string
  scraped_at: Date
  summary_id: string
  word_count: number
  metadata: {
    domain: string
    scraping_method: string
    content_type: string
  }
}