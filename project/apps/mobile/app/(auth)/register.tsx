import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Card, Badge } from '@streamlink/ui';
import { theme } from '@streamlink/ui';
import { useAuthStore } from '../../src/store/auth';
import { api } from '../../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'VIEWER' | 'STREAMER' | 'BOTH'>('VIEWER');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.register(email, password, displayName, role);
      await login(response.user, response.access_token);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the StreamLink community</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            helperText="Must be at least 6 characters"
          />

          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>I am a...</Text>
            <View style={styles.roleOptions}>
              <RoleOption
                label="Viewer"
                description="Watch and engage with content"
                selected={role === 'VIEWER'}
                onPress={() => setRole('VIEWER')}
              />
              <RoleOption
                label="Streamer"
                description="Create and share content"
                selected={role === 'STREAMER'}
                onPress={() => setRole('STREAMER')}
              />
              <RoleOption
                label="Both"
                description="Watch and create content"
                selected={role === 'BOTH'}
                onPress={() => setRole('BOTH')}
              />
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="small"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const RoleOption = ({ 
  label, 
  description, 
  selected, 
  onPress 
}: { 
  label: string; 
  description: string; 
  selected: boolean; 
  onPress: () => void; 
}) => (
  <Button
    title={label}
    onPress={onPress}
    variant={selected ? 'primary' : 'outline'}
    style={[styles.roleButton, selected && styles.selectedRole]}
  >
    <View>
      <Text style={[styles.roleButtonLabel, selected && styles.selectedRoleText]}>
        {label}
      </Text>
      <Text style={[styles.roleButtonDescription, selected && styles.selectedRoleDescription]}>
        {description}
      </Text>
    </View>
  </Button>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: theme.spacing.xl,
  },
  roleSection: {
    marginVertical: theme.spacing.lg,
  },
  roleLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  roleButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: theme.spacing.md,
  },
  selectedRole: {
    borderColor: theme.colors.primary,
  },
  roleButtonLabel: {
    ...theme.typography.button,
    fontSize: 14,
  },
  roleButtonDescription: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  selectedRoleText: {
    color: theme.colors.background,
  },
  selectedRoleDescription: {
    color: theme.colors.background,
    opacity: 0.8,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
});