import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const MESSAGES = [
  {
    id: 1, sender: 'Sarah J.', time: '09:15 AM', avatarBg: '#C9997C', initials: 'SJ',
    text: "I'm putting some old paint cans out by the curb if anyone needs them for small touch-ups!",
    isNew: false,
  },
  {
    id: 2, type: 'divider', label: '3 NEW MESSAGES',
  },
  {
    id: 3, sender: 'Jessica', time: '10:01 AM', avatarBg: '#A89BC9', initials: 'JE',
    text: 'Has anyone used the new hardware store on 5th street? Looking for some specialized drill bits.',
    isNew: true,
  },
  {
    id: 4, sender: 'Mike Johnson', time: '10:03 AM', avatarBg: '#7B9FB5', initials: 'MJ',
    text: 'Yeah, they have a great selection! Slightly pricey though, but very convenient.',
    isNew: true,
  },
  {
    id: 5, sender: 'Tom R.', time: '10:05 AM', avatarBg: '#9C6FB5', initials: 'TR',
    text: 'Anyone has a pressure washer I can rent this weekend?',
    isNew: true,
  },
];

export default function CommunityGroupChatScreen({ navigation, route }) {
  const [msg, setMsg] = useState('');
  const groupName = route?.params?.groupName || 'Austin DIY Network';
  const members = route?.params?.members || '1,204 members';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.groupIconWrap}>
          <Ionicons name="people-outline" size={20} color="#3B82F6" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.memberCount}>{members}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() =>
            Alert.alert(groupName, undefined, [
              { text: 'View Members', onPress: () => {} },
              { text: 'Leave Group', style: 'destructive', onPress: () => {} },
              { text: 'Cancel', style: 'cancel' },
            ])
          }
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={MESSAGES}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateSep}>
              <Text style={styles.dateSepText}>Today</Text>
            </View>
          }
          renderItem={({ item }) => {
            if (item.type === 'divider') {
              return (
                <View style={styles.newMsgDivider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>{item.label}</Text>
                  <View style={styles.dividerLine} />
                </View>
              );
            }
            return (
              <View style={styles.msgWrap}>
                <Text style={styles.senderName}>
                  {item.sender} <Text style={styles.msgTime}>{item.time}</Text>
                </Text>
                <View style={styles.msgRow}>
                  <View style={styles.bubble}>
                    <Text style={styles.bubbleText}>{item.text}</Text>
                  </View>
                  <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
                    <Text style={styles.avatarText}>{item.initials}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

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
            />
          </View>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => { if (msg.trim()) setMsg(''); }}
          >
            <Ionicons name="paper-plane" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F0E8' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: 10,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  groupIconWrap: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: '#DBEAFE',
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  groupName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  memberCount: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  moreBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  list: { padding: 16, gap: 16 },

  dateSep: {
    alignItems: 'center', marginBottom: 8,
  },
  dateSepText: {
    fontSize: 12, color: Colors.textSecondary, fontWeight: '500',
    backgroundColor: '#E8E0D0', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },

  newMsgDivider: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.primaryDark + '40' },
  dividerLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark, letterSpacing: 0.5 },

  msgWrap: { gap: 4 },
  senderName: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginLeft: 4 },
  msgTime: { fontSize: 11, fontWeight: '400', color: Colors.textMuted },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  avatar: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 12 },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, height: 40, justifyContent: 'center',
  },
  input: { fontSize: 14, color: Colors.textPrimary },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
});
