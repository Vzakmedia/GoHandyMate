/**
 * GoHandyMate – Supabase API Service Layer
 * Central module for all database queries. Import from any screen.
 */
import { supabase } from './supabase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a relative time string from an ISO date */
export function timeAgo(date) {
  if (!date) return '';
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Get initials from a full name */
export function initials(name) {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Format a dollar amount */
export function formatMoney(amount) {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
}

// ─── Profiles ────────────────────────────────────────────────────────────────

/** Fetch the logged-in user's profile row */
export async function getMyProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data; // null if no profile yet — caller should handle gracefully
}

/** Update the logged-in user's profile */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Handymen ────────────────────────────────────────────────────────────────

/** Fetch the handyman profile for the logged-in pro user */
export async function getMyHandymanProfile(userId) {
  const { data, error } = await supabase
    .from('handymen')
    .select('*, profiles(*)')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
}

/** Fetch top-rated active handymen, optionally filtered by category */
export async function getTopHandymen(limit = 10, category = null) {
  let query = supabase
    .from('handymen')
    .select(`
      id, rating, total_reviews, total_jobs, hourly_rate, is_verified,
      years_experience, response_time_minutes, bio,
      profiles(full_name, avatar_url, location_city),
      handyman_services(service_name, category_id, service_categories(name))
    `)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Fetch a single handyman's full profile by handyman ID */
export async function getHandymanById(handymanId) {
  const { data, error } = await supabase
    .from('handymen')
    .select(`
      *,
      profiles(full_name, avatar_url, location_city, phone, email),
      handyman_services(*, service_categories(name, icon)),
      reviews(rating, comment, created_at, profiles(full_name, avatar_url))
    `)
    .eq('id', handymanId)
    .single();
  if (error) throw error;
  return data;
}

/** Fetch stats for a handyman using the DB helper function */
export async function getHandymanStats(handymanId) {
  const { data, error } = await supabase
    .rpc('get_handyman_stats', { p_handyman_id: handymanId });
  if (error) throw error;
  return data?.[0] ?? {
    total_earnings: 0,
    pending_earnings: 0,
    completed_jobs: 0,
    pending_jobs: 0,
    new_requests: 0,
    avg_rating: 0,
  };
}

/** Get handyman's available payout balance */
export async function getAvailableBalance(handymanId) {
  const { data, error } = await supabase
    .rpc('get_handyman_available_balance', { p_handyman_id: handymanId });
  if (error) throw error;
  return data ?? 0;
}

// ─── Service Categories ───────────────────────────────────────────────────────

/** Fetch all service categories ordered by sort_order */
export async function getServiceCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

/** Fetch all bookings for the logged-in customer */
export async function getMyBookings(customerId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, service_category, status, scheduled_at, total_amount,
      created_at, notes, address_snapshot,
      handymen(
        id, rating,
        profiles(full_name, avatar_url, phone)
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch bookings assigned to a handyman (all statuses) */
export async function getHandymanBookings(handymanId, statusFilter = null) {
  let query = supabase
    .from('bookings')
    .select(`
      id, service_category, status, scheduled_at, total_amount,
      handyman_payout, notes, created_at,
      profiles!bookings_customer_id_fkey(full_name, avatar_url, phone)
    `)
    .eq('handyman_id', handymanId)
    .order('scheduled_at', { ascending: false });

  if (statusFilter) {
    query = query.in('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Create a new booking */
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update a booking's status */
export async function updateBookingStatus(bookingId, newStatus) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Conversations & Messages ─────────────────────────────────────────────────

/** Fetch all conversations for the current user */
export async function getMyConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id, last_message, last_message_at,
      customer:profiles!conversations_customer_id_fkey(id, full_name, avatar_url),
      handyman:profiles!conversations_handyman_user_id_fkey(id, full_name, avatar_url)
    `)
    .or(`customer_id.eq.${userId},handyman_user_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch messages in a conversation */
export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, sender_id, is_read, created_at, attachment_url')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Send a new message */
export async function sendMessage(conversationId, senderId, content, attachmentUrl = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      attachment_url: attachmentUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get unread message count for a user across all conversations */
export async function getUnreadMessageCount(userId) {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false)
    .neq('sender_id', userId);
  // Note: Simplified — ideally filtered by conversations user is part of
  if (error) return 0;
  return count ?? 0;
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** Fetch notifications for the current user */
export async function getMyNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

/** Mark a single notification as read */
export async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

/** Mark all notifications as read for the user */
export async function markAllNotificationsRead(userId) {
  const { error } = await supabase
    .rpc('mark_all_notifications_read', { p_user_id: userId });
  if (error) throw error;
}

/** Get count of unread notifications */
export async function getUnreadNotificationCount(userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) return 0;
  return count ?? 0;
}

// ─── Promotions ───────────────────────────────────────────────────────────────

/** Fetch active promotions */
export async function getActivePromotions() {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Validate a promotion code */
export async function validatePromoCode(code, userId, bookingValue) {
  const { data, error } = await supabase
    .rpc('validate_promotion', {
      p_code: code,
      p_user_id: userId,
      p_booking_value: bookingValue,
    });
  if (error) throw error;
  return data;
}

// ─── Earnings / Transactions ──────────────────────────────────────────────────

/** Fetch transactions for a handyman */
export async function getMyTransactions(handymanId, limit = 30) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, bookings(service_category, scheduled_at)')
    .eq('handyman_id', handymanId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/** Fetch payout history for a handyman */
export async function getMyPayouts(handymanId) {
  const { data, error } = await supabase
    .from('payouts')
    .select('*')
    .eq('handyman_id', handymanId)
    .order('initiated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

/** Fetch reviews for a handyman */
export async function getHandymanReviews(handymanId, limit = 10) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_customer_id_fkey(full_name, avatar_url)')
    .eq('handyman_id', handymanId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/** Submit a review for a completed booking */
export async function submitReview(bookingId, customerId, handymanId, rating, comment) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ booking_id: bookingId, customer_id: customerId, handyman_id: handymanId, rating, comment })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Realtime subscriptions ───────────────────────────────────────────────────

/** Subscribe to new messages in a conversation */
export function subscribeToMessages(conversationId, callback) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

/** Subscribe to a user's notifications */
export function subscribeToNotifications(userId, callback) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => callback(payload.new)
    )
    .subscribe();
}

/** Subscribe to booking status changes for a handyman */
export function subscribeToBookingUpdates(handymanId, callback) {
  return supabase
    .channel(`bookings:handyman:${handymanId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `handyman_id=eq.${handymanId}` },
      (payload) => callback(payload.new)
    )
    .subscribe();
}
