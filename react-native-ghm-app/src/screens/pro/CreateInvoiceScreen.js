import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

const INITIAL_ITEMS = [
  { id: 1, label: 'Plumbing Repair Service', detail: '2 hrs × $85.00/hr', amount: 170.00 },
  { id: 2, label: 'Replacement Parts (Pipes & Fittings)', detail: '1 unit × $45.00', amount: 45.00 },
];

export default function CreateInvoiceScreen({ navigation }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [notes, setNotes] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const tax = 0;

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const addItem = () => {
    setItems([...items, { id: Date.now(), label: 'New Item', detail: '1 unit × $0.00', amount: 0 }]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Invoice</Text>
        <TouchableOpacity>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Client Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Client Details</Text>
          <Text style={styles.fieldLabel}>Billed To</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownPlaceholder}>Select a client</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Invoice Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Invoice Details</Text>

          <Text style={styles.fieldLabel}>Invoice Number</Text>
          <View style={styles.textField}>
            <Text style={styles.textFieldValue}>INV-0043</Text>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Issue Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateValue}>Oct 26, 2023</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Due Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.datePlaceholder}>Select date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {items.map((item, i) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <View style={styles.itemBottom}>
                    <Text style={styles.itemDetail}>{item.detail}</Text>
                    <Text style={styles.itemAmount}>${item.amount.toFixed(2)}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                  <Ionicons name="close" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              {i < items.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}

          <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
            <Ionicons name="add-circle-outline" size={18} color={Colors.primaryDark} />
            <Text style={styles.addItemText}>Add New Item</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (0%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <TouchableOpacity style={styles.addDiscountBtn}>
              <Text style={styles.addDiscountText}>Add +</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.previewBtn}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={() => navigation.navigate('InvoiceSent')}>
            <Ionicons name="paper-plane-outline" size={16} color={Colors.white} />
            <Text style={styles.sendText}>Send Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes / Terms</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add payment terms or a thank you note..."
            placeholderTextColor={Colors.textMuted}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
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
  saveDraftText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },

  scroll: { padding: 16 },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  fieldLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500', marginBottom: 6 },
  dropdown: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  dropdownPlaceholder: { fontSize: 14, color: Colors.textMuted },

  textField: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingHorizontal: 14, paddingVertical: 13, marginBottom: 14,
  },
  textFieldValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },

  dateRow: { flexDirection: 'row', gap: 12 },
  dateField: { flex: 1 },
  dateInput: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingHorizontal: 12, paddingVertical: 13,
  },
  dateValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  datePlaceholder: { fontSize: 14, color: Colors.textMuted },

  itemRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemDetail: { fontSize: 12, color: Colors.textSecondary },
  itemAmount: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  removeBtn: { padding: 4 },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight },

  addItemBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12,
  },
  addItemText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },

  summaryCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  addDiscountBtn: {},
  addDiscountText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },

  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  previewBtn: {
    flex: 1, backgroundColor: Colors.primaryLight, borderRadius: BorderRadius.xl,
    paddingVertical: 14, alignItems: 'center',
  },
  previewText: { fontSize: 15, fontWeight: '600', color: Colors.primaryDark },
  sendBtn: {
    flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, paddingVertical: 14,
  },
  sendText: { fontSize: 15, fontWeight: '600', color: Colors.white },

  notesInput: {
    fontSize: 14, color: Colors.textPrimary, minHeight: 80,
    textAlignVertical: 'top', lineHeight: 20,
  },
});
