import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
  TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
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

export default function ProChatScreen({ navigation, route }) {
  const { user } = useAuth();
  const { conversationId, clientName = 'Customer', otherUserId } = route?.params ?? {};

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  const clientInitials = initials(clientName);

  // ─── Load messages ────────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!conversationId) { setLoading(false); return; }
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.warn('ProChatScreen load error:', err.message);
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
        if (prev.find((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => channel.unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 50);
    }
  }, [messages.length]);

  // ─── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = message.trim();
    if (!text || !conversationId || !user?.id) return;

    const optimistic = {
      id: `temp-${Date.now()}`,
      content: text,
      sender_id: user.id,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage('');
    setSending(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const saved = await sendMessage(conversationId, user.id, text);
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
    } catch (err) {
      Alert.alert('Error', 'Message could not be sent. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isPro = item.sender_id === user?.id;  // pro is the logged-in user
    if (item.type === 'image') {
      return (
        <View style={styles.imageMessage}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
          </View>
          <Text style={styles.msgTime}>{formatTime(item.created_at)}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.messageRow, isPro && styles.messageRowPro]}>
        <View style={[styles.bubble, isPro ? styles.bubblePro : styles.bubbleClient]}>
          <Text style={[styles.bubbleText, isPro && styles.bubbleTextPro]}>
            {item.content}
          </Text>
        </View>
        <View style={[styles.metaRow, isPro && styles.metaRowPro]}>
          <Text style={styles.msgTime}>{formatTime(item.created_at)}</Text>
          {isPro && (
            <Ionicons
              name={item.is_read ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={item.is_read ? Colors.primaryDark : Colors.textMuted}
            />
          )}
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
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{clientInitials}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.headerName}>{clientName}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call-outline" size={18} color={Colors.primaryDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primaryDark} />
          </View>
        ) : !conversationId ? (
          <View style={styles.noConvWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.noConvText}>No conversation available</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.dateSeparator}>
                <Text style={styles.dateText}>Today</Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSub}>Start the conversation 👋</Text>
              </View>
            }
            renderItem={renderMessage}
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.inputActionBtn}>
            <Ionicons name="add" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder={`Message ${clientName.split(' ')[0]}...`}
              placeholderTextColor={Colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity style={styles.inputActionBtn}>
            <Ionicons name="camera-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, (!message.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || sending}
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
  noConvText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { position: 'relative' },
  avatarInner: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8A87C',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success },
  onlineText: { fontSize: 12, color: Colors.success, fontWeight: '500' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  callBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  moreBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  messageList: { padding: 16, gap: 12 },
  dateSeparator: { alignItems: 'center', marginBottom: 12 },
  dateText: {
    fontSize: 12, color: Colors.textMuted, backgroundColor: Colors.background,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  emptyChat: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyChatText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptyChatSub: { fontSize: 13, color: Colors.textMuted },

  messageRow: { alignItems: 'flex-start', maxWidth: '78%' },
  messageRowPro: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleClient: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  bubblePro: { backgroundColor: Colors.primaryDark },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  bubbleTextPro: { color: Colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 4 },
  metaRowPro: { justifyContent: 'flex-end' },
  msgTime: { fontSize: 11, color: Colors.textMuted },

  imageMessage: { maxWidth: '70%' },
  imagePlaceholder: {
    width: 200, height: 140, backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  inputActionBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1, backgroundColor: Colors.background,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 8, maxHeight: 100,
  },
  input: { fontSize: 14, color: Colors.textPrimary, maxHeight: 84 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
});
