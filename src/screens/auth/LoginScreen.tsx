import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { ToastService } from '../../services/toast';
import { AuthService } from '../../services/auth';

interface LoginScreenProps {
  navigation: any;
}

const loginValidationSchema = Yup.object().shape({
  emailOrPhone: Yup.string()
    .required('Email or phone number is required')
    .test('email-or-phone', 'Please enter a valid email or phone number', function(value) {
      if (!value) return false;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) return true;
      
      const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    }),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: { emailOrPhone: string; password: string }, { setSubmitting }: any) => {
    try {
      const result = await AuthService.login(values.emailOrPhone, values.password);
      
      if (result.success) {
        ToastService.success('Welcome back!', 'Login Successful');
        navigation.navigate('Main');
      } else {
        ToastService.error(result.message || 'Login failed', 'Login Failed');
      }
    } catch (error) {
      ToastService.error('An error occurred. Please try again.', 'Login Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    ToastService.info(`${provider} login coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="leaf" size={26} color={COLORS.white} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to your GreenRide account</Text>

          {/* Form */}
          <Formik
            initialValues={{ emailOrPhone: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email or Phone</Text>
                  <Input
                    placeholder="name@example.com"
                    value={values.emailOrPhone}
                    onChangeText={handleChange('emailOrPhone')}
                    onBlur={handleBlur('emailOrPhone')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon="mail-outline"
                    error={touched.emailOrPhone && errors.emailOrPhone ? errors.emailOrPhone : undefined}
                    variant="default"
                    containerStyle={styles.inputContainer}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.passwordHeader}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <Input
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    leftIcon="lock-closed-outline"
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    secureTextEntry={!showPassword}
                    error={touched.password && errors.password ? errors.password : undefined}
                    variant="default"
                    containerStyle={styles.inputContainer}
                  />
                </View>

                <Button
                  title="Log In"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  fullWidth
                  style={styles.loginButton}
                />
              </View>
            )}
          </Formik>

          {/* Divider */}
          <Text style={styles.dividerText}>Or log in with</Text>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <View style={styles.googleIconCircle}>
                <Text style={styles.googleText}>G</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name="logo-apple" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBackground: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 0,
  },
  loginButton: {
    marginTop: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minHeight: 46,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginVertical: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 16,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.white,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    color: COLORS.white,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
  },
  signUpLink: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
});