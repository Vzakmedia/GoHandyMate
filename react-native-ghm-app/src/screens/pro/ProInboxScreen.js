import React from 'react'; // eslint-disable-line
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

const CONVERSATIONS = [
  { id: 1, name: 'Alex Johnson', lastMsg: "I'll be there around 2 PM.", time: '2m ago', unread: 1 },
  { id: 2, name: 'Sarah Chen', lastMsg: 'What time does the appointment start?', time: '1h ago', unread: 0 },
  { id: 3, name: 'Marcus Thompson', lastMsg: 'Thank you! See you then.', time: 'Yesterday', unread: 0 },
];

export default function ProInboxScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
      </View>
      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ProChat', { clientName: item.name })}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.content}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={[styles.lastMsg, item.unread > 0 && styles.lastMsgUnread]} numberOfLines={1}>{item.lastMsg}</Text>
            </View>
            {item.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: { paddingHorizontal: Spacing.base, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary },
  list: { paddingVertical: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryMedium, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  avatarText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.lg },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: FontWeight.semibold, fontSize: FontSize.md, color: Colors.textPrimary },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  lastMsg: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 3 },
  lastMsgUnread: { color: Colors.textPrimary, fontWeight: FontWeight.medium },
  badge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  sep: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 80 },
});
