
export async function authenticateUser(supabaseClient: any, req: Request) {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    
    if (error) {
      console.error('Authentication error:', error);
      return { user: null, error: 'Authentication failed' };
    }
    
    if (!user) {
      console.error('No user found in request');
      return { user: null, error: 'User not authenticated' };
    }
    
    return { user, error: null };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { user: null, error: 'Authentication failed' };
  }
}
