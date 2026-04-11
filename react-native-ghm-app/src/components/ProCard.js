import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/typography';
import { BorderRadius, Spacing } from '../theme/spacing';

export function ProCard({ name, category, rating, reviewCount, verified, pricePerHour, earliestArrival, distance, onBook }) {
  // Use a predictable avatar based on name length for demo purposes
  const avatarId = name ? (name.length % 70) + 10 : 15;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onBook} activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: `https://i.pravatar.cc/150?img=${avatarId}` }} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {verified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primaryDark} style={styles.verifiedIcon} />
            )}
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.category}>{category}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.starGold} />
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.reviews}>({reviewCount} reviews)</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Starting at</Text>
          <Text style={styles.priceValue}>${pricePerHour}<Text style={styles.priceUnit}>/hr</Text></Text>
        </View>
        
        {distance && (
          <View style={styles.distanceWrap}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
    marginRight: Spacing.md,
  },
  info: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  name: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  verifiedIcon: { marginLeft: 4 },
  heartBtn: { padding: 4, marginRight: -4 },
  category: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 13, fontWeight: 'bold', color: Colors.textPrimary, marginLeft: 4 },
  reviews: { fontSize: 13, color: Colors.textMuted, marginLeft: 2 },
  
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  priceLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  priceValue: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primaryDark },
  priceUnit: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary },
  
  distanceWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, gap: 4 },
  distanceText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
});
