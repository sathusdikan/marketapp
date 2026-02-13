# Supabase Setup Guide

This guide will help you connect your React Native app to Supabase for authentication and database operations.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login to your account
4. Create a new organization (if needed)
5. Create a new project:
   - Choose a database password
   - Select a region closest to your users
   - Wait for the project to be created

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public key**
3. You'll need these for the next step

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace with your actual credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up Database Tables

Go to the Supabase SQL Editor and run these queries to create basic tables:

```sql
-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Create policy for users to see their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Transactions table
CREATE TABLE public.transactions (
  id uuid default gen_random_uuid() not null primary key,
  user_id uuid references auth.users not null,
  shop_name text not null,
  total_amount numeric not null,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transaction products table
CREATE TABLE public.transaction_products (
  id uuid default gen_random_uuid() not null primary key,
  transaction_id uuid references public.transactions not null,
  product_name text not null,
  quantity integer not null,
  price numeric not null
);

-- Enable RLS for transactions
alter table public.transactions enable row level security;
alter table public.transaction_products enable row level security;

-- Policies for transactions
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can create own transactions" on public.transactions for insert with check (auth.uid() = user_id);
```

## Step 5: Using Supabase in Your App

### Authentication

```typescript
import { useSupabase } from '@/contexts/SupabaseContext';

function MyComponent() {
  const { signIn, signUp, user, signOut } = useSupabase();
  
  const handleSignIn = async () => {
    const { data, error } = await signIn('user@example.com', 'password');
    if (error) console.error(error);
  };
  
  return (
    <View>
      {user ? <Text>Welcome {user.email}</Text> : <Text>Please sign in</Text>}
      <Button onPress={handleSignIn} title="Sign In" />
    </View>
  );
}
```

### Database Operations

```typescript
import { database } from '@/lib/database';

// Fetch transactions
const { data: transactions, error } = await database.transactions.getAll();

// Create a transaction
const { data: newTransaction, error } = await database.transactions.create({
  user_id: user.id,
  shop_name: 'Test Shop',
  total_amount: 100,
  status: 'completed'
});
```

## Step 6: Test Your Connection

1. Start your app: `npm start` or `bun start`
2. Try signing up with a new account
3. Check your Supabase dashboard to see the new user
4. Test database operations

## Additional Features

### Real-time Subscriptions

```typescript
// Listen to real-time changes
const subscription = supabase
  .channel('transactions')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'transactions' },
    (payload) => console.log('New transaction!', payload.new)
  )
  .subscribe();

// Don't forget to unsubscribe
return () => subscription.unsubscribe();
```

### File Storage

```typescript
// Upload a file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', file, {
    cacheControl: '3600',
    upsert: false
  });

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('avatar1.png');
```

## Troubleshooting

### Common Issues

1. **"Invalid JWT" error**: Make sure your environment variables are set correctly
2. **RLS policy violations**: Check that your Row Level Security policies are properly configured
3. **CORS issues**: Ensure your app's URL is added to Supabase CORS settings

### Debug Tips

- Check the Supabase dashboard logs for errors
- Use `console.log` to debug API responses
- Test queries in the Supabase SQL Editor first

## Next Steps

- Set up proper error handling
- Add loading states
- Implement offline support
- Add more complex database relationships
- Set up Supabase Edge Functions for server-side logic

For more information, visit the [Supabase documentation](https://supabase.com/docs).
