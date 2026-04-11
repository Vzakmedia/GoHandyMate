import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { Colors } from '../../theme/colors';
import { FontSize, FontWeight } from '../../theme/typography';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, initials } from '../../lib/api';
import { supabase } from '../../lib/supabase';

export default function PersonalInfoScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.full_name?.split(' ')[0] ?? '');
      setLastName(profile.full_name?.split(' ').slice(1).join(' ') ?? '');
      setPhone(profile.phone ?? '');
    }
    if (user) {
      setEmail(user.email ?? '');
    }
  }, [profile, user]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <TouchableOpacity
          style={styles.headerBtnRight}
          disabled={loading}
          onPress={async () => {
            if (!firstName.trim() || !lastName.trim()) {
              Alert.alert('Missing Info', 'Please fill in all required fields.');
              return;
            }
            try {
              setLoading(true);
              const fullName = `${firstName.trim()} ${lastName.trim()}`;
              await updateProfile(user.id, { full_name: fullName, phone });
              refreshProfile();
              Alert.alert('Saved', 'Your profile has been updated.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('Error', err.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <ActivityIndicator color={Colors.primaryDark} size="small" /> : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarWrap, !profile?.avatar_url && { backgroundColor: Colors.borderLight, borderRadius: 45, alignItems: 'center', justifyContent: 'center' }]}>
            {profile?.avatar_url ? (
              <ExpoImage
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            ) : (
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.textSecondary }}>
                {initials(profile?.full_name)}
              </Text>
            )}
            <View style={styles.cameraIconWrap}>
              <Ionicons name="camera" size={12} color={Colors.white} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.changePhotoBtn}
            disabled={uploading}
            onPress={async () => {
              try {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission needed', 'We need photo library permissions to change your avatar.');
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.6,
                  base64: true,
                });

                if (result.canceled) return;

                setUploading(true);
                const img = result.assets[0];
                const ext = img.uri.split('.').pop() || 'jpg';
                const fileName = `${user.id}-${Date.now()}.${ext}`;

                // Upload to Supabase Storage (assuming bucket 'avatars' exists - confirmed)
                const { data, error } = await supabase.storage
                  .from('avatars')
                  .upload(fileName, decode(img.base64), {
                    contentType: `image/${ext}`,
                  });

                if (error) throw error;

                // Get public URL
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
                
                // Update profile
                await updateProfile(user.id, { avatar_url: urlData.publicUrl });
                refreshProfile();
                
                Alert.alert('Success', 'Avatar updated!');
              } catch (err) {
                Alert.alert('Upload failed', err.message);
              } finally {
                setUploading(false);
              }
            }}
          >
            {uploading ? (
              <ActivityIndicator color={Colors.primaryDark} size="small" style={{ marginTop: 10 }} />
            ) : (
              <Text style={styles.changePhotoText}>Change Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputWrap}>
            <TextInput style={styles.passwordInput} value="••••••••" editable={false} secureTextEntry />
            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
          </View>
        </View>

        <View style={styles.spacer} />
        
        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert('Delete Account', 'This will permanently delete your account. Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {} },
            ])
          }
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
        <View style={{ height: Spacing['2xl'] }} />
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
  headerBtn: { width: 50, alignItems: 'flex-start' },
  headerBtnRight: { width: 50, alignItems: 'flex-end' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  saveText: { color: Colors.primaryDark, fontWeight: 'bold', fontSize: FontSize.md },
  
  scroll: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.borderLight },
  cameraIconWrap: { 
    position: 'absolute', bottom: 0, right: 0, 
    width: 24, height: 24, borderRadius: 12, 
    backgroundColor: Colors.primaryDark, 
    alignItems: 'center', justifyContent: 'center', 
    borderWidth: 2, borderColor: '#FDFBF7' 
  },
  changePhotoBtn: {},
  changePhotoText: { color: Colors.primaryDark, fontWeight: 'bold', fontSize: FontSize.md },
  
  inputContainer: { marginBottom: Spacing.lg },
  inputLabel: { fontWeight: 'bold', fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: 14, fontSize: FontSize.md, color: Colors.textPrimary, 
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  passwordInputWrap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: FontSize.lg, color: Colors.textPrimary, letterSpacing: 2 },
  
  spacer: { flex: 1, minHeight: Spacing.xl },
  deleteBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, 
    paddingVertical: 14, backgroundColor: '#FEE2E2', borderRadius: BorderRadius.lg 
  },
  deleteText: { color: Colors.error, fontWeight: 'bold', fontSize: FontSize.md },
});
