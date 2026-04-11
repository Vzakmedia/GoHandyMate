import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialSchedule = DAYS.reduce((acc, day) => {
  acc[day] = {
    active: !['Saturday', 'Sunday'].includes(day),
    start: '08:00 AM',
    end: '06:00 PM',
  };
  return acc;
}, {});

export default function WorkingHoursScreen({ navigation }) {
  const [schedule, setSchedule] = useState(initialSchedule);

  const toggleDay = (day) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], active: !prev[day].active } }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Working Hours</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.desc}>Set your regular weekly availability for jobs and appointments.</Text>

        {/* Timezone */}
        <TouchableOpacity style={styles.timezoneRow}>
          <Ionicons name="globe-outline" size={18} color={Colors.textSecondary} style={{ marginRight: 10 }} />
          <Text style={styles.timezoneText}>Pacific Time (US & Canada)</Text>
          <Ionicons name="chevron-down" size={18} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Schedule Card */}
        <View style={styles.scheduleCard}>
          {DAYS.map((day, i) => {
            const isActive = schedule[day].active;
            return (
              <View key={day}>
                <View style={styles.dayBlock}>
                  <View style={styles.dayTopRow}>
                    <Text style={[styles.dayName, !isActive && styles.dayNameMuted]}>{day}</Text>
                    <Switch
                      value={isActive}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{ false: Colors.border, true: Colors.primaryDark }}
                      thumbColor={Colors.white}
                      ios_backgroundColor={Colors.border}
                    />
                  </View>
                  {isActive ? (
                    <View style={styles.timeRow}>
                      <TouchableOpacity style={styles.timeInput}>
                        <Text style={styles.timeText}>{schedule[day].start}</Text>
                        <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                      </TouchableOpacity>
                      <Text style={styles.toText}>to</Text>
                      <TouchableOpacity style={styles.timeInput}>
                        <Text style={styles.timeText}>{schedule[day].end}</Text>
                        <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.unavailableText}>Unavailable</Text>
                  )}
                </View>
                {i < DAYS.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </View>

        {/* Time Off & Exceptions */}
        <View style={styles.timeOffCard}>
          <View style={styles.timeOffHeader}>
            <Ionicons name="calendar-clear-outline" size={18} color={Colors.textPrimary} />
            <Text style={styles.timeOffTitle}>Time Off & Exceptions</Text>
          </View>
          <Text style={styles.timeOffSub}>No upcoming time off scheduled.</Text>
          <TouchableOpacity style={styles.addTimeOffBtn}>
            <Ionicons name="add" size={16} color={Colors.textPrimary} />
            <Text style={styles.addTimeOffText}>Add Time Off</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  saveText: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },

  scroll: { padding: 16 },

  desc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, lineHeight: 18 },

  timezoneRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 14,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 16,
  },
  timezoneText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  scheduleCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 16,
  },
  dayBlock: { paddingHorizontal: 16, paddingVertical: 14 },
  dayTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dayName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  dayNameMuted: { color: Colors.textMuted },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.background, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 10,
  },
  timeText: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  toText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  unavailableText: { fontSize: 13, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.borderLight },

  timeOffCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  timeOffHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  timeOffTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  timeOffSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  addTimeOffBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingVertical: 12,
  },
  addTimeOffText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
});
