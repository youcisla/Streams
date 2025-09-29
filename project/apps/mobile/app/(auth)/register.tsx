import { Button, Card, Input, theme } from '@streamlink/ui';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../src/services/api';
import { useAuthStore } from '../../src/store/auth';

type RoleOptionKey = 'VIEWER' | 'STREAMER' | 'BOTH';

interface RoleOptionConfig {
  key: RoleOptionKey;
  label: string;
  description: string;
}

const RegisterScreen = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<RoleOptionKey>('VIEWER');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = useMemo<RoleOptionConfig[]>(
    () => [
      {
        key: 'VIEWER',
        label: 'Viewer',
        description: 'Watch and engage with streams',
      },
      {
        key: 'STREAMER',
        label: 'Streamer',
        description: 'Broadcast and monetize your content',
      },
      {
        key: 'BOTH',
        label: 'I do both',
        description: 'Switch between watching and streaming',
      },
    ],
    [],
  );

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedDisplayName = displayName.trim();

    if (!trimmedDisplayName || !trimmedEmail || !password) {
      Alert.alert('Missing information', 'Please fill out display name, email, and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.register(trimmedEmail, password, trimmedDisplayName, role);
      await login(response.user, response.access_token);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      Alert.alert('Registration failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join the StreamLink community in seconds</Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            placeholder="Jane Doe"
            returnKeyType="next"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            returnKeyType="next"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            helperText="At least 6 characters"
            placeholder="Enter a secure password"
            returnKeyType="done"
          />

          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>I am joining as</Text>
            <View style={styles.roleOptions}>
              {roleOptions.map((option) => (
                <RoleOption
                  key={option.key}
                  label={option.label}
                  description={option.description}
                  selected={role === option.key}
                  onPress={() => setRole(option.key)}
                />
              ))}
            </View>
          </View>

          <Button
            title="Create account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.submitButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign in"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            size="small"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

type RoleOptionProps = {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

const RoleOption = ({ label, description, selected, onPress }: RoleOptionProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.roleButton, selected && styles.selectedRole]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={`${label} role option`}
    activeOpacity={0.85}
  >
    <Text style={[styles.roleButtonLabel, selected && styles.selectedRoleText]}>{label}</Text>
    <Text style={[styles.roleButtonDescription, selected && styles.selectedRoleDescription]}>
      {description}
    </Text>
  </TouchableOpacity>
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
    gap: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  roleSection: {
    gap: theme.spacing.sm,
  },
  roleLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  roleButton: {
    flexBasis: '30%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  selectedRole: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  roleButtonLabel: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  roleButtonDescription: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  selectedRoleText: {
    color: theme.colors.surface,
  },
  selectedRoleDescription: {
    color: theme.colors.surface,
    opacity: 0.85,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default RegisterScreen;
