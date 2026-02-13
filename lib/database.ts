import { supabase } from './supabase';

// Example database operations
// You can expand these based on your actual database schema

export const database = {
  // Generic fetch function
  async fetch<T>(table: string, options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }) {
    let query = supabase.from(table).select(options?.select || '*');
    
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? true 
      });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    return { data: data as T[], error };
  },

  // Generic insert function
  async insert<T>(table: string, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    return { data: result as T, error };
  },

  // Generic update function
  async update<T>(table: string, id: string, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    return { data: result as T, error };
  },

  // Generic delete function
  async delete(table: string, id: string) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Example: User operations
  users: {
    async create(userData: { email: string; name?: string }) {
      return database.insert('users', userData);
    },
    
    async getById(id: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    },
    
    async updateProfile(id: string, profileData: { name?: string; avatar_url?: string }) {
      return database.update('users', id, profileData);
    },
  },

  // Example: Transaction operations (based on your app)
  transactions: {
    async getAll(userId?: string) {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          products:transaction_products(
            product_name,
            quantity,
            price
          )
        `);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      return { data, error };
    },
    
    async create(transactionData: any) {
      return database.insert('transactions', transactionData);
    },
  },
};
