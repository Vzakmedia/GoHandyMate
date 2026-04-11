import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';

export default function AddNewAddressScreen({ navigation }) {
  const [isDefault, setIsDefault] = useState(false);
  const [activeLabel, setActiveLabel] = useState('Home');

  const addressLabels = [
    { id: 'Home', icon: 'home' },
    { id: 'Work', icon: 'briefcase' },
    { id: 'Other', icon: 'location' }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
        <View style={styles.headerBtnRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="location" size={48} color={Colors.error} style={{ marginTop: -20 }} />
          <View style={styles.markerShadow} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput style={styles.input} placeholder="e.g. 123 Main St, Austin" placeholderTextColor={Colors.textMuted} defaultValue="1234 Maplewood Drive, Austin, TX 78704" />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Apt, Suite, Floor (Optional)</Text>
            <TextInput style={styles.input} placeholder="e.g. Apt 4B" placeholderTextColor={Colors.textMuted} />
          </View>

          {/* Labels */}
          <Text style={styles.labelTitle}>Address Label</Text>
          <View style={styles.labelRow}>
            {addressLabels.map((l) => {
              const isActive = activeLabel === l.id;
              return (
                <TouchableOpacity 
                  key={l.id} 
                  style={[styles.labelChip, isActive && styles.labelChipActive]}
                  onPress={() => setActiveLabel(l.id)}
                >
                  <Ionicons name={isActive ? l.icon : `${l.icon}-outline`} size={18} color={isActive ? Colors.primaryDark : Colors.textSecondary} />
                  <Text style={[styles.labelChipText, isActive && styles.labelChipTextActive]}>{l.id}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Default toggle */}
          <View style={styles.defaultRow}>
            <Text style={styles.defaultLabel}>Set as default address</Text>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: '#D1D5DB', true: '#2D6A4F' }}
              thumbColor={Colors.white}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Area */}
      <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() =>
              Alert.alert('Address Saved', 'Your address has been saved.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ])
            }
          >
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
      </View>
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
  
  scroll: { paddingBottom: 100 },
  
  mapPlaceholder: {
    height: 220, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center',
  },
  markerShadow: { width: 14, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.2)', marginTop: 4 },
  
  form: { padding: Spacing.xl },
  
  inputContainer: { marginBottom: Spacing.xl },
  inputLabel: { fontWeight: 'bold', fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: 14, fontSize: FontSize.md, color: Colors.textPrimary, 
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  
  labelTitle: { fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.sm },
  labelRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  labelChip: { 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.borderLight, 
    backgroundColor: Colors.white, gap: 6 
  },
  labelChipActive: { borderColor: Colors.primaryDark, backgroundColor: '#E8F3EF', borderWidth: 1.5 },
  labelChipText: { color: Colors.textSecondary, fontWeight: 'bold', fontSize: FontSize.sm },
  labelChipTextActive: { color: Colors.primaryDark },
  
  defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  defaultLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: 'bold' },
  
  bottomBar: {
    padding: Spacing.xl, backgroundColor: '#FDFBF7',
    borderTopWidth: 1, borderTopColor: Colors.borderLight, // Optional
  },
  saveBtn: { 
    alignItems: 'center', justifyContent: 'center', 
    paddingVertical: 16, backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.lg 
  },
  saveBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: FontSize.md },
});
