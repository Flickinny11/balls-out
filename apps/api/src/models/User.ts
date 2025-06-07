export interface UserData {
  id?: string;
  email: string;
  password: string;
  name: string;
  avatar_url?: string;
  subscription_tier: string;
  credits: number;
  preferences?: any;
  created_at?: Date;
  updated_at?: Date;
}

export class User {
  static async create(userData: Omit<UserData, 'id'>): Promise<UserData> {
    // In production, this would insert into PostgreSQL
    const user: UserData = {
      id: this.generateId(),
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Simulate database save
    console.log('User created:', user.email);
    return user;
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    // In production, this would query PostgreSQL
    // For now, return null to simulate user not found
    console.log('Looking for user:', email);
    return null;
  }

  static async findById(id: string): Promise<UserData | null> {
    // In production, this would query PostgreSQL
    console.log('Looking for user by ID:', id);
    return null;
  }

  static async update(id: string, updates: Partial<UserData>): Promise<UserData> {
    // In production, this would update PostgreSQL record
    const user: UserData = {
      id,
      email: 'user@example.com',
      password: 'hashed',
      name: updates.name || 'User',
      subscription_tier: 'free',
      credits: 3.0,
      preferences: updates.preferences || {},
      updated_at: new Date()
    };

    console.log('User updated:', id);
    return user;
  }

  static async delete(id: string): Promise<void> {
    // In production, this would delete from PostgreSQL
    console.log('User deleted:', id);
  }

  private static generateId(): string {
    return 'user_' + Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}