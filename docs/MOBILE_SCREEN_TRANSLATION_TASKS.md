# 📱 Mobile App Screen Translation Tasks

## 🌍 **Target Languages (Same as Web Version)**

- ✅ **English (en)** - Already implemented
- ✅ **Korean (ko)** - Already implemented
- ✅ **Vietnamese (vi)** - Already implemented
- ✅ **Chinese (zh)** - Already implemented

---

## 📋 **All Mobile App Screens Inventory**

### 🔐 **Authentication Screens** (`app/(auth)/`)

| Screen                 | File                     | Current Status    | Translation Keys Needed |
| ---------------------- | ------------------------ | ----------------- | ----------------------- |
| **Welcome**            | `welcome.tsx`            | ❌ Not translated | 15+ auth keys           |
| **Login**              | `login.tsx`              | ❌ Not translated | 20+ auth keys           |
| **Sign Up**            | `signup.tsx`             | ❌ Not translated | 25+ auth keys           |
| **Forgot Password**    | `forgot-password.tsx`    | ❌ Not translated | 10+ auth keys           |
| **Reset Password**     | `reset-password.tsx`     | ❌ Not translated | 8+ auth keys            |
| **Email Verification** | `email-verification.tsx` | ❌ Not translated | 8+ auth keys            |

### 🎯 **Onboarding Screens** (`app/onboarding/`)

| Screen              | File                 | Current Status    | Translation Keys Needed |
| ------------------- | -------------------- | ----------------- | ----------------------- |
| **Welcome**         | `welcome.tsx`        | ❌ Not translated | 10+ onboarding keys     |
| **Profile Setup**   | `profile.tsx`        | ❌ Not translated | 15+ profile keys        |
| **Goals Selection** | `goals.tsx`          | ❌ Not translated | 12+ goal keys           |
| **Preferences**     | `preferences.tsx`    | ❌ Not translated | 20+ preference keys     |
| **Connect Strava**  | `connect-strava.tsx` | ❌ Not translated | 8+ integration keys     |

### 📱 **Main App Screens** (`app/(tabs)/`)

| Screen                | File                   | Current Status          | Translation Keys Needed |
| --------------------- | ---------------------- | ----------------------- | ----------------------- |
| **Home Dashboard**    | `index.tsx`            | ⚠️ Partially translated | 15+ home keys           |
| **Profile Main**      | `profile/index.tsx`    | ❌ Not translated       | 20+ profile keys        |
| **Profile Settings**  | `profile/settings.tsx` | ⚠️ Partially translated | 30+ settings keys       |
| **Training Overview** | `training/index.tsx`   | ❌ Not translated       | 15+ training keys       |
| **Training Program**  | `training/program.tsx` | ❌ Not translated       | 25+ training keys       |
| **Training Run**      | `training/run.tsx`     | ❌ Not translated       | 20+ workout keys        |
| **Chat Interface**    | `chat.tsx`             | ❌ Not translated       | 15+ chat keys           |

### 🏃 **Activity & Settings Screens**

| Screen              | File                 | Current Status          | Translation Keys Needed |
| ------------------- | -------------------- | ----------------------- | ----------------------- |
| **Activity Detail** | `activity/[id].tsx`  | ❌ Not translated       | 20+ activity keys       |
| **Settings Main**   | `settings/index.tsx` | ⚠️ Partially translated | 15+ settings keys       |
| **Not Found**       | `+not-found.tsx`     | ❌ Not translated       | 5+ error keys           |

**Total Screens**: 18 screens requiring translation

---

## 🎯 **Translation Implementation Tasks**

### **Phase 1: Critical Authentication Flow (Week 1-2)**

#### **Task 1.1: Authentication Screens Translation**

**Priority**: 🔴 **Critical** - Essential for app access

**Subtasks:**

- [ ] **Welcome Screen** (`welcome.tsx`)
  - [ ] Translate welcome messages and taglines
  - [ ] Translate action buttons (Sign In, Sign Up, Get Started)
  - [ ] Translate app introduction text
  - [ ] Test text length in Korean and Chinese

- [ ] **Login Screen** (`login.tsx`)
  - [ ] Translate form labels (Email, Password)
  - [ ] Translate placeholders and input hints
  - [ ] Translate error messages and validation text
  - [ ] Translate "Forgot Password" and "Remember Me"
  - [ ] Translate social login options
  - [ ] Test form layout with longer German text

- [ ] **Sign Up Screen** (`signup.tsx`)
  - [ ] Translate registration form labels
  - [ ] Translate Terms of Service and Privacy Policy links
  - [ ] Translate password requirements
  - [ ] Translate confirmation messages
  - [ ] Translate social registration options

- [ ] **Forgot Password Screen** (`forgot-password.tsx`)
  - [ ] Translate instructions and descriptions
  - [ ] Translate form labels and buttons
  - [ ] Translate success and error messages

- [ ] **Reset Password Screen** (`reset-password.tsx`)
  - [ ] Translate form labels (New Password, Confirm Password)
  - [ ] Translate instructions and validation
  - [ ] Translate success messages

- [ ] **Email Verification Screen** (`email-verification.tsx`)
  - [ ] Translate verification instructions
  - [ ] Translate "Resend Email" button
  - [ ] Translate status messages

**Required Translation Keys**: 86+ authentication keys
**Estimated Time**: 12-16 hours
**Languages**: Korean (ko), Vietnamese (vi), Chinese (zh)

---

### **Phase 2: Onboarding Experience (Week 3)**

#### **Task 2.1: Onboarding Flow Translation**

**Priority**: 🔴 **High** - First user experience

**Subtasks:**

- [ ] **Onboarding Welcome** (`welcome.tsx`)
  - [ ] Translate welcome messages and app features
  - [ ] Translate "Get Started" and navigation buttons
  - [ ] Translate app benefit descriptions

- [ ] **Profile Setup** (`profile.tsx`)
  - [ ] Translate personal information form labels
  - [ ] Translate input placeholders (Name, Age, Weight, Height)
  - [ ] Translate units and measurements
  - [ ] Translate validation messages

- [ ] **Goals Selection** (`goals.tsx`)
  - [ ] Translate goal categories (Improve Endurance, Lose Weight, etc.)
  - [ ] Translate goal descriptions
  - [ ] Translate selection interface text

- [ ] **Preferences Setup** (`preferences.tsx`)
  - [ ] Translate notification settings
  - [ ] Translate unit preferences (Metric/Imperial)
  - [ ] Translate theme and app settings
  - [ ] Translate privacy settings

- [ ] **Connect Strava** (`connect-strava.tsx`)
  - [ ] Translate integration instructions
  - [ ] Translate connect/skip buttons
  - [ ] Translate benefit descriptions

**Required Translation Keys**: 65+ onboarding keys
**Estimated Time**: 8-12 hours
**Languages**: Korean (ko), Vietnamese (vi), Chinese (zh)

---

### **Phase 3: Core App Features (Week 4-5)**

#### **Task 3.1: Main Dashboard Translation**

**Priority**: 🔴 **High** - Primary user interface

**Subtasks:**

- [ ] **Home Screen** (`index.tsx`)
  - [ ] Complete existing partial translations
  - [ ] Translate activity feed labels
  - [ ] Translate stats and metrics
  - [ ] Translate quick action buttons
  - [ ] Translate empty states and placeholders

**Required Translation Keys**: 15+ home keys
**Estimated Time**: 4-6 hours

#### **Task 3.2: Profile Section Translation**

**Subtasks:**

- [ ] **Profile Main** (`profile/index.tsx`)
  - [ ] Translate profile information display
  - [ ] Translate running statistics labels
  - [ ] Translate achievement sections
  - [ ] Translate edit and settings buttons

- [ ] **Profile Settings** (`profile/settings.tsx`)
  - [ ] Complete existing partial translations
  - [ ] Translate all settings categories
  - [ ] Translate toggle options and descriptions
  - [ ] Translate account management options
  - [ ] Fix any remaining hardcoded strings

**Required Translation Keys**: 50+ profile keys
**Estimated Time**: 8-10 hours

---

### **Phase 4: Training Features (Week 6)**

#### **Task 4.1: Training Module Translation**

**Priority**: 🟡 **Medium** - Core functionality

**Subtasks:**

- [ ] **Training Overview** (`training/index.tsx`)
  - [ ] Translate workout dashboard labels
  - [ ] Translate training plan categories
  - [ ] Translate progress tracking text
  - [ ] Translate quick actions

- [ ] **Training Program** (`training/program.tsx`)
  - [ ] Translate workout types (Easy Run, Interval, etc.)
  - [ ] Translate training schedule interface
  - [ ] Translate difficulty levels and descriptions
  - [ ] Translate progress indicators

- [ ] **Training Run** (`training/run.tsx`)
  - [ ] Translate live workout interface
  - [ ] Translate metrics (Duration, Distance, Pace, etc.)
  - [ ] Translate control buttons (Start, Pause, Stop)
  - [ ] Translate achievements and milestones

**Required Translation Keys**: 60+ training keys
**Estimated Time**: 10-12 hours

---

### **Phase 5: Communication & Activity (Week 7)**

#### **Task 5.1: Chat Interface Translation**

**Subtasks:**

- [ ] **Chat Screen** (`chat.tsx`)
  - [ ] Translate AI coach interface
  - [ ] Translate message input placeholders
  - [ ] Translate suggested questions
  - [ ] Translate conversation starters
  - [ ] Translate empty states

**Required Translation Keys**: 15+ chat keys
**Estimated Time**: 4-6 hours

#### **Task 5.2: Activity Features Translation**

**Subtasks:**

- [ ] **Activity Detail** (`activity/[id].tsx`)
  - [ ] Translate activity information display
  - [ ] Translate performance metrics
  - [ ] Translate map and route information
  - [ ] Translate AI analysis and insights
  - [ ] Translate sharing and export options

**Required Translation Keys**: 20+ activity keys
**Estimated Time**: 6-8 hours

---

### **Phase 6: Settings & Error Handling (Week 8)**

#### **Task 6.1: Settings & Error Pages**

**Subtasks:**

- [ ] **Settings Main** (`settings/index.tsx`)
  - [ ] Complete existing partial translations
  - [ ] Translate all configuration options
  - [ ] Translate about and support sections

- [ ] **Not Found Page** (`+not-found.tsx`)
  - [ ] Translate error messages
  - [ ] Translate navigation options
  - [ ] Translate help text

**Required Translation Keys**: 20+ settings/error keys
**Estimated Time**: 4-6 hours

---

## 🔧 **Technical Implementation Tasks**

### **Task T1: Translation Key Audit & Enhancement**

**Priority**: 🔴 **High**

**Subtasks:**

- [ ] Compare mobile translation keys with web version
- [ ] Identify missing keys from web auth.json, onboarding.json, etc.
- [ ] Add missing error messages and edge cases
- [ ] Standardize key naming conventions between web and mobile
- [ ] Add translation keys for all hardcoded strings

**Files to Update:**

- `mobile-app/i18n/locales/en.json` (reference)
- `mobile-app/i18n/locales/ko.json`
- `mobile-app/i18n/locales/vi.json`
- `mobile-app/i18n/locales/zh.json`

**Estimated Time**: 8-10 hours

### **Task T2: Screen Implementation Updates**

**Priority**: 🔴 **High**

**Process for Each Screen:**

1. **Import useI18n hook**:

```typescript
import { useI18n } from '@/hooks/useI18n';
```

2. **Add translation hook**:

```typescript
const { t } = useI18n();
```

3. **Replace hardcoded strings**:

```typescript
// Before
<Text>Sign In</Text>

// After
<Text>{t('auth.signIn')}</Text>
```

4. **Test in all languages**:

```typescript
// Test UI with Korean, Vietnamese, Chinese
```

**Estimated Time**: 40-50 hours (2-3 hours per screen)

### **Task T3: Quality Assurance Testing**

**Priority**: 🔴 **High**

**Testing Checklist per Language:**

- [ ] Text fits properly in UI components
- [ ] No text overflow or truncation
- [ ] Button sizes accommodate longer text
- [ ] Navigation labels are clear
- [ ] Form validation messages display correctly
- [ ] Error messages are culturally appropriate
- [ ] Numbers and dates format correctly

**Estimated Time**: 20-25 hours (5-6 hours per language)

---

## 📊 **Implementation Summary**

### **Translation Coverage by Screen**

| Screen Category     | Screens        | Current Status  | Translation Keys | Effort (Hours)  |
| ------------------- | -------------- | --------------- | ---------------- | --------------- |
| **Authentication**  | 6 screens      | 0% translated   | 86+ keys         | 12-16           |
| **Onboarding**      | 5 screens      | 0% translated   | 65+ keys         | 8-12            |
| **Main App**        | 7 screens      | 20% translated  | 135+ keys        | 22-28           |
| **Activities**      | 2 screens      | 0% translated   | 40+ keys         | 10-14           |
| **Settings/Errors** | 2 screens      | 30% translated  | 25+ keys         | 4-6             |
| **Total**           | **22 screens** | **10% average** | **351+ keys**    | **56-76 hours** |

### **Resource Requirements**

#### **Development Effort**

- **Screen Implementation**: 40-50 hours
- **Translation Key Updates**: 8-10 hours
- **Quality Assurance**: 20-25 hours
- **Testing & Bug Fixes**: 8-12 hours
- **Total Development**: **76-97 hours**

#### **Language-Specific Work (per language)**

- **Korean (ko)**: Review and enhance existing translations
- **Vietnamese (vi)**: Review and enhance existing translations
- **Chinese (zh)**: Review and enhance existing translations
- **Quality Review**: Native speaker validation (2-3 hours per language)

### **Total Project Timeline**

- **Development**: 8 weeks (76-97 hours)
- **Testing**: Parallel with development
- **Total**: **8 weeks** for complete translation coverage

---

## 🎯 **Priority Implementation Order**

### **Week 1-2: Authentication (Critical Path)**

- Complete all auth screens (Login, Sign Up, etc.)
- Essential for app access and user onboarding

### **Week 3: Onboarding Experience**

- First-time user experience screens
- Critical for user retention

### **Week 4-5: Core Features**

- Home dashboard and profile sections
- Primary user interaction areas

### **Week 6: Training Features**

- Core app functionality
- Important for user engagement

### **Week 7: Communication & Activities**

- Chat and activity detail screens
- Enhanced user experience

### **Week 8: Settings & Polish**

- Settings and error handling
- Complete the translation coverage

---

## ✅ **Success Criteria**

### **Completion Metrics**

- [ ] **100% screen translation coverage** (22/22 screens)
- [ ] **Zero hardcoded strings** in user-facing components
- [ ] **4 languages fully supported** (en, ko, vi, zh)
- [ ] **UI tested in all languages** with no overflow issues
- [ ] **Native speaker validation** for Korean, Vietnamese, Chinese

### **Quality Standards**

- [ ] All text fits properly in UI components
- [ ] Consistent terminology across all screens
- [ ] Culturally appropriate translations
- [ ] Proper number and date formatting
- [ ] Error messages are clear and helpful

### **Technical Standards**

- [ ] All screens use `useI18n()` hook consistently
- [ ] Translation keys follow standardized naming
- [ ] No translation key missing errors
- [ ] Proper fallbacks to English for missing keys
- [ ] Performance optimized for language switching

---

## 🚀 **Getting Started**

### **Immediate Next Steps (Week 1):**

1. **Audit current translations** - Compare with web version
2. **Start with login screen** - Highest priority for user access
3. **Set up testing process** - Test each language as you implement
4. **Create style guide** - Ensure consistent translation approach

### **Ready to Begin!**

Your mobile app i18n foundation is solid. This systematic approach will ensure complete translation coverage across all screens while maintaining the same language support as your web version. 🌍📱

The 4 languages (English, Korean, Vietnamese, Chinese) match perfectly with your web version, so users will have a consistent experience across platforms! 🎉
