import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SectionTitle from '../../components/SectionTitle';
import Card from '../../components/Card';
import InputField from '../../components/InputField';
import ButtonPrimary from '../../components/ButtonPrimary';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import globalStyles from '../../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation will be handled automatically by AuthContext state change
    } catch (error) {
      Alert.alert('Login Error', error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signIn('demo@pnc.com', 'demo123');
      // Navigation will be handled automatically by AuthContext state change
    } catch (error) {
      Alert.alert('Demo Login Error', 'Failed to start demo session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Signing in..." overlay />;
  }

  return (
    <View style={globalStyles.container}>
      <StatusBar style="light" backgroundColor={colors.pnc.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <SectionTitle
          title="PNC Productivity"
          subtitle="Sign in to continue"
          size="large"
          color="white"
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.loginCard}>
          <SectionTitle
            title="Welcome Back"
            subtitle="Sign in to access your productivity tools"
            size="medium"
          />

          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@pnc.com"
            keyboardType="email-address"
            leftIcon="email"
            required
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            leftIcon="lock"
            required
          />

          <ButtonPrimary
            title="Sign In"
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <Text style={styles.dividerText}>or</Text>

          <ButtonPrimary
            title="Demo Access"
            onPress={handleDemoLogin}
            variant="outline"
            style={styles.demoButton}
          />

          <Text style={styles.disclaimerText}>
            This is a hackathon prototype. In production, authentication would be integrated with PNC's enterprise SSO system.
          </Text>
        </Card>

        <Card style={styles.featuresCard}>
          <SectionTitle
            title="What's Inside"
            subtitle="AI-powered tools for product management"
            size="medium"
          />

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>AI-Generated PRDs</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>RICE Prioritization</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Feedback Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Launch Planning</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.pnc.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60, // Account for status bar
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 20,
  },
  loginCard: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  dividerText: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginVertical: 16,
    fontSize: 16,
  },
  demoButton: {
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  featuresCard: {
    marginBottom: 20,
  },
  featuresList: {
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
  },
  featureText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default LoginScreen;