import React, {useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from 'react-native-heroicons/outline';
import TextInput, {TextInputRef} from './index';
import * as Yup from 'yup';

// Example validation schemas
const emailSchema = Yup.string()
  .email('Please enter a valid email address')
  .required('Email is required');

const phoneSchema = Yup.string()
  .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits')
  .required('Phone number is required');

const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/\d/, 'Password must contain at least one number')
  .required('Password is required');

const TextInputExamples = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const emailRef = useRef<TextInputRef>(null);
  const passwordRef = useRef<TextInputRef>(null);

  const handleValidation =
    (field: string) => (isValid: boolean, error?: string) => {
      console.warn(`${field} validation:`, isValid, error);
    };

  return (
    <View style={styles.container}>
      {/* Basic Text Input */}
      <TextInput
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        prefixIcon={<UserIcon size={20} color="#717780" />}
        required
        testID="name-input"
      />

      {/* Email Input with Validation */}
      <TextInput
        ref={emailRef}
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        mode="email"
        prefixIcon={<EnvelopeIcon size={20} color="#717780" />}
        validationSchema={emailSchema}
        onValidation={handleValidation('email')}
        required
        testID="email-input"
      />

      {/* Password Input */}
      <TextInput
        ref={passwordRef}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        isPassword
        validationSchema={passwordSchema}
        onValidation={handleValidation('password')}
        required
        testID="password-input"
      />

      {/* Phone Input */}
      <TextInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        mode="phone"
        prefixIcon={<PhoneIcon size={20} color="#717780" />}
        validationSchema={phoneSchema}
        onValidation={handleValidation('phone')}
        testID="phone-input"
      />

      {/* Multiline Text Input */}
      <TextInput
        label="Bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        maxLength={200}
        showCharacterCount
        message="Optional: Share a brief description about yourself"
        testID="bio-input"
      />

      {/* Input with Warning */}
      <TextInput
        label="Username"
        placeholder="Choose a username"
        warning="Username should be at least 3 characters long"
        testID="username-input"
      />

      {/* Input with Error */}
      <TextInput
        label="Confirm Password"
        placeholder="Confirm your password"
        isPassword
        error="Passwords do not match"
        testID="confirm-password-input"
      />

      {/* Disabled Input */}
      <TextInput
        label="Account Type"
        value="Premium User"
        disabled
        message="This field cannot be edited"
        testID="account-type-input"
      />

      {/* Number Input */}
      <TextInput
        label="Age"
        placeholder="Enter your age"
        mode="number"
        maxLength={3}
        returnKeyType="done"
        testID="age-input"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6F7',
  },
});

export default TextInputExamples;
