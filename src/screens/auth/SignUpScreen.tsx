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

interface SignUpScreenProps {
  navigation: any;
}

const signUpValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }, { setSubmitting }: any) => {
    try {
      const result = await AuthService.register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      
      if (result.success) {
        ToastService.success('Account created successfully!', 'Welcome to GreenRide');
        navigation.navigate('Main');
      } else {
        ToastService.error(result.message || 'Registration failed', 'Sign Up Failed');
      }
    } catch (error) {
      ToastService.error('An error occurred. Please try again.', 'Sign Up Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialSignUp = (provider: 'google' | 'apple') => {
    ToastService.info(`${provider} sign up coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="leaf" size={26} color={COLORS.white} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>

            {/* Form */}
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={signUpValidationSchema}
              onSubmit={handleSignUp}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <Input
                      placeholder="Enter your full name"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      leftIcon="person-outline"
                      autoCapitalize="words"
                      error={touched.name && errors.name ? errors.name : undefined}
                      variant="default"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email or Phone Number</Text>
                    <Input
                      placeholder="Enter your email or phone"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      leftIcon="mail-outline"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={touched.email && errors.email ? errors.email : undefined}
                      variant="default"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
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

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <Input
                      placeholder="Confirm your password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      leftIcon="lock-closed-outline"
                      rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      secureTextEntry={!showConfirmPassword}
                      error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                      variant="default"
                      containerStyle={styles.inputContainer}
                    />
                  </View>

                  <Button
                    title="Sign Up"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    fullWidth
                    style={styles.signUpButton}
                  />
                </View>
              )}
            </Formik>

            {/* Divider */}
            <Text style={styles.dividerText}>Or sign up with</Text>

            {/* Social Sign Up */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('google')}
              >
                <View style={styles.googleIconCircle}>
                  <Text style={styles.googleText}>G</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignUp('apple')}
              >
                <Ionicons name="logo-apple" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
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
    marginBottom: 28,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  inputContainer: {
    marginBottom: 0,
  },
  signUpButton: {
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
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.text.secondary,
  },
  loginLink: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
  },
});