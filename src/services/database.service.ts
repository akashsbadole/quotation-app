// Database Service Layer
// Handles all database operations with proper error handling and data validation

export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  filename?: string; // for SQLite
}

export interface QueryResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rowCount?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface FilterOptions {
  [key: string]: any;
}

class DatabaseService {
  private config: DatabaseConfig;
  private connection: any = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  // Initialize database connection
  async initialize(): Promise<boolean> {
    try {
      // In a real implementation, this would establish actual database connection
      // For now, we'll simulate with localStorage for demo purposes
      console.log('Database service initialized with config:', this.config);
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      return false;
    }
  }

  // Generic query execution
  async executeQuery<T = any>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    try {
      // Simulate database query execution
      console.log('Executing query:', query, 'with params:', params);
      
      // In a real implementation, this would execute the actual SQL query
      // For demo purposes, we'll return mock data based on the query type
      
      return {
        success: true,
        data: [] as T,
        rowCount: 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  // Create record
  async create<T = any>(table: string, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
      
      // Simulate record creation
      const newRecord = {
        id: Date.now(), // Mock ID generation
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as T;

      // Store in localStorage for demo
      this.storeInLocalStorage(table, newRecord);

      return {
        success: true,
        data: newRecord,
        rowCount: 1
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Create operation failed'
      };
    }
  }

  // Read records with pagination and filtering
  async findMany<T = any>(
    table: string, 
    options: {
      filters?: FilterOptions;
      pagination?: PaginationOptions;
      includes?: string[];
    } = {}
  ): Promise<QueryResult<T[]>> {
    try {
      // Get data from localStorage for demo
      const records = this.getFromLocalStorage(table) || [];
      
      let filteredRecords = records;

      // Apply filters
      if (options.filters) {
        filteredRecords = records.filter((record: any) => {
          return Object.entries(options.filters!).every(([key, value]) => {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string' && value.includes('%')) {
              // Handle LIKE queries
              const searchValue = value.replace(/%/g, '');
              return record[key]?.toString().toLowerCase().includes(searchValue.toLowerCase());
            }
            return record[key] === value;
          });
        });
      }

      // Apply sorting
      if (options.pagination?.sortBy) {
        const { sortBy, sortOrder = 'ASC' } = options.pagination;
        filteredRecords.sort((a: any, b: any) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];
          if (sortOrder === 'DESC') {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }

      // Apply pagination
      if (options.pagination) {
        const { page, limit } = options.pagination;
        const offset = (page - 1) * limit;
        filteredRecords = filteredRecords.slice(offset, offset + limit);
      }

      return {
        success: true,
        data: filteredRecords,
        rowCount: filteredRecords.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Read operation failed'
      };
    }
  }

  // Find single record by ID
  async findById<T = any>(table: string, id: number | string): Promise<QueryResult<T>> {
    try {
      const records = this.getFromLocalStorage(table) || [];
      const record = records.find((r: any) => r.id.toString() === id.toString());

      if (!record) {
        return {
          success: false,
          error: 'Record not found'
        };
      }

      return {
        success: true,
        data: record,
        rowCount: 1
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Find operation failed'
      };
    }
  }

  // Update record
  async update<T = any>(table: string, id: number | string, data: Partial<T>): Promise<QueryResult<T>> {
    try {
      const records = this.getFromLocalStorage(table) || [];
      const index = records.findIndex((r: any) => r.id.toString() === id.toString());

      if (index === -1) {
        return {
          success: false,
          error: 'Record not found'
        };
      }

      const updatedRecord = {
        ...records[index],
        ...data,
        updated_at: new Date().toISOString()
      };

      records[index] = updatedRecord;
      this.setInLocalStorage(table, records);

      return {
        success: true,
        data: updatedRecord,
        rowCount: 1
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update operation failed'
      };
    }
  }

  // Delete record
  async delete(table: string, id: number | string): Promise<QueryResult<void>> {
    try {
      const records = this.getFromLocalStorage(table) || [];
      const filteredRecords = records.filter((r: any) => r.id.toString() !== id.toString());

      this.setInLocalStorage(table, filteredRecords);

      return {
        success: true,
        rowCount: records.length - filteredRecords.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete operation failed'
      };
    }
  }

  // Bulk operations
  async bulkCreate<T = any>(table: string, records: Partial<T>[]): Promise<QueryResult<T[]>> {
    try {
      const createdRecords = records.map(record => ({
        id: Date.now() + Math.random(), // Mock ID generation
        ...record,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as T[];

      const existingRecords = this.getFromLocalStorage(table) || [];
      this.setInLocalStorage(table, [...existingRecords, ...createdRecords]);

      return {
        success: true,
        data: createdRecords,
        rowCount: createdRecords.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bulk create operation failed'
      };
    }
  }

  // Transaction support
  async transaction<T = any>(operations: (() => Promise<QueryResult<any>>)[]): Promise<QueryResult<T>> {
    try {
      const results = [];
      
      // Execute all operations
      for (const operation of operations) {
        const result = await operation();
        if (!result.success) {
          // Rollback would happen here in a real implementation
          throw new Error(result.error);
        }
        results.push(result.data);
      }

      return {
        success: true,
        data: results as T,
        rowCount: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  // Helper methods for localStorage simulation
  private storeInLocalStorage<T>(table: string, record: T): void {
    const existingRecords = this.getFromLocalStorage(table) || [];
    existingRecords.push(record);
    this.setInLocalStorage(table, existingRecords);
  }

  private getFromLocalStorage(table: string): any[] {
    try {
      const data = localStorage.getItem(`db_${table}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setInLocalStorage(table: string, data: any[]): void {
    try {
      localStorage.setItem(`db_${table}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Database health check
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      // Simulate health check
      return {
        healthy: true,
        message: 'Database connection is healthy'
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Health check failed'
      };
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      // Close database connection
      this.connection = null;
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService({
  type: 'sqlite',
  database: 'quotemanager.db',
  filename: './data/quotemanager.db'
});

// Initialize database on module load
databaseService.initialize().then(success => {
  if (success) {
    console.log('Database service ready');
  } else {
    console.error('Database service initialization failed');
  }
});

export default DatabaseService;
