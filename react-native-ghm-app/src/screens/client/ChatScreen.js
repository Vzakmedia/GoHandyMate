import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, Alert, Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import {
  getMessages,
  sendMessage,
  subscribeToMessages,
  initials,
} from '../../lib/api';

export default function ChatScreen({ navigation, route }) {
  const { user, profile } = useAuth();
  const { conversationId, proName = 'Pro', otherUserId, phone } = route?.params ?? {};

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  const proInitials = initials(proName);

  // ─── Load messages ────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!conversationId) { setLoading(false); return; }
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.warn('ChatScreen load error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ─── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    const channel = subscribeToMessages(conversationId, (newMsg) => {
      setMessages((prev) => {
        // avoid duplicate if the sender is me (already added optimistically)
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => channel.unsubscribe();
  }, [conversationId]);

  // ─── Scroll to bottom whenever messages change ─────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 50);
    }
  }, [messages.length]);

  // ─── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = msg.trim();
    if (!text || !conversationId || !user?.id) return;

    // Optimistic update
    const optimistic = {
      id: `temp-${Date.now()}`,
      content: text,
      sender_id: user.id,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMsg('');
    setSending(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const saved = await sendMessage(conversationId, user.id, text);
      // Replace optimistic with real message
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch (err) {
      Alert.alert('Error', 'Message could not be sent. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setMsg(text); // restore input
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowUser]}>
        {!isMe && (
          <View style={styles.msgAvatar}>
            <Text style={styles.msgAvatarText}>{proInitials}</Text>
          </View>
        )}
        <View>
          <View style={[styles.bubble, isMe ? styles.bubbleUser : styles.bubblePro]}>
            <Text style={[styles.bubbleText, isMe && styles.bubbleTextUser]}>
              {item.content}
            </Text>
          </View>
          <Text style={[styles.msgTime, isMe && { textAlign: 'right' }]}>
            {formatTime(item.created_at)}
            {isMe && item.is_read && '  ✓✓'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{proInitials}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{proName}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => {
              if (phone) {
                Linking.openURL(`tel:${phone}`);
              } else {
                Alert.alert('Unavailable', 'No phone number is available for this professional.');
              }
            }}
          >
            <Ionicons name="call-outline" size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() =>
              Alert.alert(proName, undefined, [
                { text: 'View Booking Details', onPress: () => navigation.navigate('BookingDetails') },
                { text: 'Report Issue', onPress: () => Alert.alert('Report', 'Your report has been submitted.') },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          >
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primaryDark} />
          </View>
        ) : !conversationId ? (
          <View style={styles.noConvWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.noConvText}>No conversation found</Text>
            <Text style={styles.noConvSub}>Start a booking to begin chatting with this pro</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.dateSep}>
                <Text style={styles.dateText}>TODAY</Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons name="chatbubble-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSub}>Say hello 👋</Text>
              </View>
            }
            renderItem={renderMessage}
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => Alert.alert('Attachments', 'Photo & file sharing coming soon.')}
          >
            <Ionicons name="add" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={msg}
              onChangeText={setMsg}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={1000}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, (!msg.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!msg.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="paper-plane" size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  noConvWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  noConvText: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  noConvSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { fontSize: 12, color: Colors.success, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  callBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  moreBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  list: { padding: 16, gap: 12, flexGrow: 1 },
  dateSep: { alignItems: 'center', marginBottom: 12 },
  dateText: {
    fontSize: 12, color: Colors.textMuted, fontWeight: '600',
    backgroundColor: Colors.border, paddingHorizontal: 14, paddingVertical: 5, borderRadius: BorderRadius.full,
  },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 },
  emptyChatText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyChatSub: { fontSize: 13, color: Colors.textMuted },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgAvatar: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#7B9FB5',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  msgAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 11 },
  bubble: { maxWidth: 260, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubblePro: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  bubbleUser: { backgroundColor: Colors.primaryDark },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  bubbleTextUser: { color: Colors.white },
  msgTime: { fontSize: 10, color: Colors.textMuted, marginTop: 3, paddingHorizontal: 4 },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1, backgroundColor: Colors.background, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14,
    paddingVertical: 8, maxHeight: 100, justifyContent: 'center',
  },
  input: { fontSize: 14, color: Colors.textPrimary, maxHeight: 84 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
});
