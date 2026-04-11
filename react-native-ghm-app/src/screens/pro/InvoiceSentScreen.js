import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

export default function InvoiceSentScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate('ProApp')}>
        <Ionicons name="close" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={40} color={Colors.white} />
        </View>

        <Text style={styles.title}>Invoice Sent!</Text>
        <Text style={styles.subtitle}>
          Your invoice has been successfully sent to{'\n'}<Text style={styles.clientName}>John Doe</Text>.
        </Text>

        {/* Invoice Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice No.</Text>
            <Text style={styles.detailValue}>INV-0043</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date Sent</Text>
            <Text style={styles.detailValue}>Oct 26, 2023</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>$215.00</Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.copyBtn}>
          <Ionicons name="link-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.copyText}>Copy Invoice Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('ProApp')}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  closeBtn: {
    alignSelf: 'flex-end', margin: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },

  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryDark,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },

  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  clientName: { fontWeight: '700', color: Colors.textPrimary },

  detailsCard: {
    width: '100%', backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, padding: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 12 },
  detailLabel: { fontSize: 13, color: Colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },

  actions: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, paddingVertical: 15,
    borderWidth: 1, borderColor: Colors.border,
  },
  copyText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  doneBtn: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, paddingVertical: 16, alignItems: 'center',
  },
  doneText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
