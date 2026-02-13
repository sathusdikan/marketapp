import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import { User, Store, Shield, Eye, EyeOff, ArrowRight, CreditCard, Sparkles, Upload, Building2, Phone, MapPin, BadgeCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { UserRole } from '@/types';

type RoleOption = {
  role: UserRole;
  title: string;
  subtitle: string;
  icon: typeof User;
  color: string;
  gradient: readonly [string, string];
};

type AuthMode = 'signin' | 'register';

const roleOptions: RoleOption[] = [
  { 
    role: 'customer', 
    title: 'Customer', 
    subtitle: 'Government Employee', 
    icon: User, 
    color: Colors.customerAccent,
    gradient: ['#3B82F6', '#60A5FA'] as const,
  },
  { 
    role: 'shop', 
    title: 'Shop Owner', 
    subtitle: 'Registered Merchant', 
    icon: Store, 
    color: Colors.shopAccent,
    gradient: ['#F97316', '#FB923C'] as const,
  },
  { 
    role: 'admin', 
    title: 'Admin', 
    subtitle: 'System Administrator', 
    icon: Shield, 
    color: Colors.adminAccent,
    gradient: ['#8B5CF6', '#A78BFA'] as const,
  },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
  const [shopName, setShopName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (selectedRole === 'admin' && authMode === 'register') {
      setAuthMode('signin');
    }
  }, [selectedRole]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(selectedRole, email, password);
      
      if (selectedRole === 'customer') {
        router.replace('/(customer)');
      } else if (selectedRole === 'shop') {
        router.replace('/(shop)');
      } else {
        router.replace('/(admin)');
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(selectedRole, email, password);
      
      if (selectedRole === 'customer') {
        router.replace('/(customer)');
      } else if (selectedRole === 'shop') {
        router.replace('/(shop)');
      }
    } catch (error) {
      console.log('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleOption = roleOptions.find(r => r.role === selectedRole);
  const showRegisterOption = selectedRole !== 'admin';

  const renderRegisterFields = () => {
    if (authMode !== 'register') return null;

    return (
      <>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <User size={18} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textLight}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Phone size={18} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textLight}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address</Text>
          <View style={styles.inputWrapper}>
            <MapPin size={18} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Enter your address"
              placeholderTextColor={Colors.textLight}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        {selectedRole === 'customer' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Government Employee ID</Text>
              <View style={styles.inputWrapper}>
                <BadgeCheck size={18} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your employee ID"
                  placeholderTextColor={Colors.textLight}
                  value={employeeId}
                  onChangeText={setEmployeeId}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Department</Text>
              <View style={styles.inputWrapper}>
                <Building2 size={18} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your department"
                  placeholderTextColor={Colors.textLight}
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <Upload size={20} color={Colors.customerAccent} />
              <Text style={styles.uploadButtonText}>Upload Job Card (PDF/Image)</Text>
            </TouchableOpacity>
          </>
        )}

        {selectedRole === 'shop' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Shop Name</Text>
              <View style={styles.inputWrapper}>
                <Store size={18} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your shop name"
                  placeholderTextColor={Colors.textLight}
                  value={shopName}
                  onChangeText={setShopName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>License Number</Text>
              <View style={styles.inputWrapper}>
                <BadgeCheck size={18} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your license number"
                  placeholderTextColor={Colors.textLight}
                  value={licenseNumber}
                  onChangeText={setLicenseNumber}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <Upload size={20} color={Colors.shopAccent} />
              <Text style={[styles.uploadButtonText, { color: Colors.shopAccent }]}>
                Upload Shop Verification Document
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm your password"
              placeholderTextColor={Colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={['#050D18', '#0A1628', '#132743']}
        style={[styles.header, { paddingTop: insets.top + 24 }]}
      >
        <View style={styles.headerPattern}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.patternCircle, { 
              left: `${10 + i * 18}%`,
              top: `${20 + (i % 2) * 30}%`,
              opacity: 0.08 + (i * 0.015),
              backgroundColor: Colors.accent,
            }]} />
          ))}
        </View>
        
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.accent, Colors.accentLight]}
              style={styles.logoGradient}
            >
              <CreditCard size={28} color={Colors.textInverse} />
            </LinearGradient>
            <View>
              <Text style={styles.brandName}>GovCredit</Text>
              <View style={styles.premiumBadge}>
                <Sparkles size={10} color={Colors.gold} />
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
            </View>
          </View>
          <Text style={styles.tagline}>Credit Marketplace for{'\n'}Government Employees</Text>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}>
            <Text style={styles.sectionTitle}>Select Portal</Text>
            <View style={styles.roleContainer}>
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.role;
                return (
                  <TouchableOpacity
                    key={option.role}
                    style={[
                      styles.roleCard,
                      isSelected && styles.roleCardSelected,
                    ]}
                    onPress={() => setSelectedRole(option.role)}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={option.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.roleSelectedGradient}
                      />
                    )}
                    <View style={[
                      styles.roleIcon, 
                      { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : option.color + '20' }
                    ]}>
                      <Icon size={20} color={isSelected ? Colors.textInverse : option.color} />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[
                        styles.roleTitle,
                        isSelected && styles.roleTextSelected
                      ]}>{option.title}</Text>
                      <Text style={[
                        styles.roleSubtitle,
                        isSelected && styles.roleSubtitleSelected
                      ]}>{option.subtitle}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedCheck}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {showRegisterOption && (
              <View style={styles.authToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.authToggleButton,
                    authMode === 'signin' && styles.authToggleButtonActive,
                  ]}
                  onPress={() => setAuthMode('signin')}
                >
                  <Text style={[
                    styles.authToggleText,
                    authMode === 'signin' && styles.authToggleTextActive,
                  ]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.authToggleButton,
                    authMode === 'register' && styles.authToggleButtonActive,
                  ]}
                  onPress={() => setAuthMode('register')}
                >
                  <Text style={[
                    styles.authToggleText,
                    authMode === 'register' && styles.authToggleTextActive,
                  ]}>Register</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              {authMode === 'signin' ? 'Login Credentials' : 'Registration Details'}
            </Text>

            {renderRegisterFields()}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.textLight} />
                  ) : (
                    <Eye size={20} color={Colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {authMode === 'signin' && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={authMode === 'signin' ? handleLogin : handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedRoleOption?.gradient || [Colors.accent, Colors.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading 
                    ? (authMode === 'signin' ? 'Signing in...' : 'Registering...') 
                    : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
                </Text>
                {!isLoading && <ArrowRight size={20} color={Colors.textInverse} />}
              </LinearGradient>
            </TouchableOpacity>

            {authMode === 'register' && (
              <View style={styles.termsNote}>
                <Text style={styles.termsText}>
                  By registering, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            )}

            <View style={styles.demoNote}>
              <View style={styles.demoIconContainer}>
                <Sparkles size={16} color={Colors.accent} />
              </View>
              <Text style={styles.demoNoteText}>
                {authMode === 'signin' 
                  ? `Demo Mode: Click Sign In to explore the ${selectedRoleOption?.title} portal`
                  : `Complete the form to register as a ${selectedRoleOption?.title}`}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoSection: {
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  logoGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textInverse,
    letterSpacing: 0.5,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.gold,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  roleContainer: {
    gap: 10,
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  roleCardSelected: {
    borderColor: 'transparent',
  },
  roleSelectedGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: 14,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  roleTextSelected: {
    color: Colors.textInverse,
  },
  roleSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  roleSubtitleSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  authToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  authToggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  authToggleText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  authToggleTextActive: {
    color: Colors.textInverse,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: Colors.text,
  },
  inputWithIcon: {
    flex: 1,
    padding: 18,
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: 18,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: 18,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.customerAccent,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  termsNote: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  demoNote: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.accent + '15',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    gap: 12,
  },
  demoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent + '25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
