import { MongoClient, Db, ObjectId } from 'mongodb';
import { config } from 'dotenv';

config();

export class MongoDBService {
  private client: MongoClient;
  private db: Db | null = null;
  private static instance: MongoDBService;

  private constructor() {
    const mongoUri = process.env.DB_MONGO_URI;
    console.log('🚀 ~ MongoDBService ~ constructor ~ mongoUri:', mongoUri);
    if (!mongoUri) {
      throw new Error('Mongo Url is not found');
    }
    this.client = new MongoClient(mongoUri);
  }

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  public async connect(): Promise<void> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  public getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(collectionName);
  }

  public toObjectId(id: string | ObjectId): ObjectId {
    return typeof id === 'string' ? new ObjectId(id) : id;
  }

  public isValidObjectId(id: string): boolean {
    return ObjectId.isValid(id);
  }

  public async findMany(
    collectionName: string,
    filter: Record<string, any> = {},
    options: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
      projection?: Record<string, any>;
    } = {}
  ) {
    const collection = this.getCollection(collectionName);
    return await collection
      .find(filter, {
        sort: options.sort,
        limit: options.limit,
        skip: options.skip,
        projection: options.projection,
      })
      .toArray();
  }
}
