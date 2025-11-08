import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

export default StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  
  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  
  // Spacing
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mt24: { marginTop: 24 },
  mx16: { marginHorizontal: 16 },
  mx20: { marginHorizontal: 20 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  px16: { paddingHorizontal: 16 },
  px20: { paddingHorizontal: 20 },
  py16: { paddingVertical: 16 },
  py20: { paddingVertical: 20 },
  
  // Text Styles
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: fonts.weight.bold,
  },
  textSemibold: {
    fontWeight: fonts.weight.semibold,
  },
  textMedium: {
    fontWeight: fonts.weight.medium,
  },
  textPrimary: {
    color: colors.text.primary,
  },
  textSecondary: {
    color: colors.text.secondary,
  },
  textWhite: {
    color: colors.white,
  },
  textPNC: {
    color: colors.pnc.primary,
  },
  
  // Background Styles
  bgPrimary: {
    backgroundColor: colors.pnc.primary,
  },
  bgSecondary: {
    backgroundColor: colors.background.secondary,
  },
  bgWhite: {
    backgroundColor: colors.white,
  },
  
  // Shadow Styles
  shadow: {
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shadowLarge: {
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  
  // Border Styles
  borderRadius8: {
    borderRadius: 8,
  },
  borderRadius12: {
    borderRadius: 12,
  },
  borderRadius16: {
    borderRadius: 16,
  },
  
  // Screen Header Styles
  screenHeader: {
    backgroundColor: colors.pnc.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
  },
  screenTitle: {
    fontSize: fonts.size['2xl'],
    fontWeight: fonts.weight.bold,
    color: colors.white,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: fonts.size.base,
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  
  // Form Styles
  formContainer: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.semibold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  
  // Card variations
  cardDefault: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardPrimary: {
    backgroundColor: colors.pnc.primary,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  // Status indicators
  statusHigh: {
    backgroundColor: colors.rice.high,
  },
  statusMedium: {
    backgroundColor: colors.rice.medium,
  },
  statusLow: {
    backgroundColor: colors.rice.low,
  },
  statusCritical: {
    backgroundColor: colors.rice.critical,
  },
  
  // Utility classes
  flex1: {
    flex: 1,
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
});