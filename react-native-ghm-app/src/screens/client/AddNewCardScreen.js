import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';

export default function AddNewCardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={styles.headerBtnRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.previewTop}>
             <View style={{ width: 44, height: 28, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
             <Ionicons name="wifi" size={24} color={Colors.white} style={{ transform: [{rotate: '90deg'}] }} />
          </View>
          <Text style={styles.previewNum}>••••  ••••  ••••  ••••</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <View>
                 <Text style={styles.previewLabel}>CARDHOLDER NAME</Text>
                 <Text style={styles.previewValue}>Name</Text>
             </View>
             <View>
                 <Text style={styles.previewLabel}>EXPIRY</Text>
                 <Text style={styles.previewValue}>MM/YY</Text>
             </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput style={styles.input} placeholder="1234 5678 9012 3456" keyboardType="number-pad" placeholderTextColor={Colors.textMuted} />
        </View>

        <View style={styles.row2}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput style={styles.input} placeholder="MM / YY" placeholderTextColor={Colors.textMuted} />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: Spacing.md }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput style={styles.input} placeholder="•••" keyboardType="number-pad" secureTextEntry placeholderTextColor={Colors.textMuted} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput style={styles.input} placeholder="Name as on card" autoCapitalize="words" placeholderTextColor={Colors.textMuted} />
        </View>

        <View style={styles.spacer} />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() =>
            Alert.alert('Card Saved', 'Your card has been added successfully.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ])
          }
        >
          <Text style={styles.saveBtnText}>Save Card</Text>
        </TouchableOpacity>
        <View style={{ height: Spacing.xl }} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FDFBF7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerBtn: { width: 40, alignItems: 'flex-start' },
  headerBtnRight: { width: 40 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  
  cardPreview: {
    backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.xl, padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  previewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  previewNum: { color: Colors.white, fontSize: 22, letterSpacing: 2, marginBottom: Spacing['2xl'], fontWeight: 'bold' },
  previewLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  previewValue: { color: Colors.white, fontWeight: 'bold', fontSize: FontSize.sm },
  
  row2: { flexDirection: 'row' },
  
  inputContainer: { marginBottom: Spacing.lg },
  inputLabel: { fontWeight: 'bold', fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: 14, fontSize: FontSize.md, color: Colors.textPrimary, 
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  
  spacer: { flex: 1, minHeight: Spacing.xl },
  saveBtn: { 
    alignItems: 'center', justifyContent: 'center', 
    paddingVertical: 16, backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.lg 
  },
  saveBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: FontSize.md },
});
