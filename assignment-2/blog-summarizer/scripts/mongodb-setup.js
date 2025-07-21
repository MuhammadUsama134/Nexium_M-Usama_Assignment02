// MongoDB setup script for blog_summarizer database
// Run this in MongoDB Compass or MongoDB shell

// Connect to the blog_summarizer database
const db = db.getSiblingDB("blog_summarizer")

// Create blog_contents collection with schema validation
db.createCollection("blog_contents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["url", "title", "content", "scraped_at", "summary_id"],
      properties: {
        url: {
          bsonType: "string",
          description: "Blog URL - required and must be a string",
        },
        title: {
          bsonType: "string",
          maxLength: 500,
          description: "Blog title - required, max 500 characters",
        },
        content: {
          bsonType: "string",
          description: "Full blog content - required",
        },
        scraped_at: {
          bsonType: "date",
          description: "Timestamp when content was scraped - required",
        },
        summary_id: {
          bsonType: "string",
          description: "Reference to summary in Supabase - required",
        },
        word_count: {
          bsonType: "int",
          minimum: 0,
          description: "Number of words in content",
        },
        metadata: {
          bsonType: "object",
          properties: {
            domain: {
              bsonType: "string",
              description: "Domain of the scraped URL",
            },
            scraping_method: {
              bsonType: "string",
              description: "Method used for scraping",
            },
            content_type: {
              bsonType: "string",
              description: "Type of content scraped",
            },
          },
        },
      },
    },
  },
})

// Create indexes for better performance
db.blog_contents.createIndex({ url: 1 }, { unique: true })
db.blog_contents.createIndex({ scraped_at: -1 })
db.blog_contents.createIndex({ summary_id: 1 })
db.blog_contents.createIndex({ word_count: -1 })
db.blog_contents.createIndex({ "metadata.domain": 1 })

// Create text index for content search
db.blog_contents.createIndex(
  {
    title: "text",
    content: "text",
  },
  {
    weights: {
      title: 10,
      content: 1,
    },
    name: "content_text_index",
  },
)

// Create compound indexes for common queries
db.blog_contents.createIndex({ "metadata.domain": 1, scraped_at: -1 })
db.blog_contents.createIndex({ word_count: -1, scraped_at: -1 })

// Create a collection for processing logs (optional)
db.createCollection("processing_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["url", "status", "timestamp"],
      properties: {
        url: {
          bsonType: "string",
          description: "Processed URL",
        },
        status: {
          bsonType: "string",
          enum: ["success", "failed", "processing"],
          description: "Processing status",
        },
        timestamp: {
          bsonType: "date",
          description: "Processing timestamp",
        },
        error_message: {
          bsonType: "string",
          description: "Error message if processing failed",
        },
        processing_time: {
          bsonType: "int",
          minimum: 0,
          description: "Processing time in milliseconds",
        },
      },
    },
  },
})

// Create indexes for processing logs
db.processing_logs.createIndex({ url: 1 })
db.processing_logs.createIndex({ timestamp: -1 })
db.processing_logs.createIndex({ status: 1, timestamp: -1 })

print("MongoDB setup completed successfully!")
print("Collections created:")
print("- blog_contents (with validation and indexes)")
print("- processing_logs (with validation and indexes)")
print("Indexes created for optimal performance.")
