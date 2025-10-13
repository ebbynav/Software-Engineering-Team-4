/**
 * KeyboardAwareForm Component
 *
 * A wrapper component that handles keyboard avoidance for forms, ensuring
 * inputs remain visible when the keyboard is displayed.
 *
 * ACCESSIBILITY FEATURES:
 * - Automatically scrolls to focused input
 * - Adjusts for keyboard height on both iOS and Android
 * - Maintains proper spacing from keyboard
 * - Supports nested ScrollView for long forms
 *
 * BEHAVIOR:
 * - On iOS: Uses KeyboardAvoidingView with "padding" behavior
 * - On Android: Uses KeyboardAvoidingView with "height" behavior
 * - Automatically scrolls to focused input with smooth animation
 * - Extra bottom padding prevents keyboard from covering submit button
 *
 * USAGE:
 * Wrap your form components with this wrapper to automatically handle
 * keyboard avoidance without manual configuration.
 */

import React, { useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

interface KeyboardAwareFormProps {
  /** Form content */
  children: React.ReactNode;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Enable scroll view (useful for long forms) */
  enableScroll?: boolean;
  /** Extra padding at bottom (default: 20) */
  bottomPadding?: number;
  /** Dismiss keyboard on tap outside (default: true) */
  dismissOnTap?: boolean;
}

export const KeyboardAwareForm: React.FC<KeyboardAwareFormProps> = ({
  children,
  style,
  enableScroll = true,
  bottomPadding = 20,
  dismissOnTap = true,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleDismissKeyboard = () => {
    if (dismissOnTap) {
      Keyboard.dismiss();
    }
  };

  const FormContent = (
    <View style={[styles.content, { paddingBottom: bottomPadding }]}>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {enableScroll ? (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {FormContent}
          </ScrollView>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          {FormContent}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

/**
 * Usage Example:
 *
 * ```tsx
 * import { KeyboardAwareForm } from '@/components/KeyboardAwareForm';
 * import { ThemedTextInput } from '@/components/TextInput';
 * import { PrimaryButton } from '@/components/PrimaryButton';
 *
 * const LoginModal = () => {
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *
 *   return (
 *     <KeyboardAwareForm>
 *       <ThemedTextInput
 *         label="Email"
 *         type="email"
 *         value={email}
 *         onChangeText={setEmail}
 *         placeholder="Enter your email"
 *       />
 *
 *       <ThemedTextInput
 *         label="Password"
 *         type="password"
 *         value={password}
 *         onChangeText={setPassword}
 *         placeholder="Enter your password"
 *       />
 *
 *       <PrimaryButton
 *         label="Sign In"
 *         onPress={handleLogin}
 *       />
 *     </KeyboardAwareForm>
 *   );
 * };
 * ```
 */
