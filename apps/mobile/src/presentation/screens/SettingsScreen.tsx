import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  StatusBar
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { steeringConfig, updateSteeringConfig } = useControllerStore();

  const sensitivities = [0.5, 1.0, 1.5, 2.0, 3.0];
  const deadZones = [0.02, 0.05, 0.08, 0.12, 0.18];
  const smoothings = [0.0, 0.15, 0.25, 0.4, 0.6];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.bgRoot} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Controller Tuning</Text>
          <Text style={styles.subtitle}>Calibrate sensitivity and dead zone response curves</Text>
        </View>

        {/* Sensitivity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Steering Sensitivity: <Text style={styles.valHighlight}>{steeringConfig.sensitivity.toFixed(1)}x</Text>
          </Text>
          <View style={styles.chipsRow}>
            {sensitivities.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  Math.abs(steeringConfig.sensitivity - s) < 0.05 && styles.chipActive
                ]}
                onPress={() => updateSteeringConfig({ sensitivity: s })}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    Math.abs(steeringConfig.sensitivity - s) < 0.05 && styles.chipTextActive
                  ]}
                >
                  {s}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dead Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Dead Zone Threshold: <Text style={styles.valHighlight}>{steeringConfig.deadZone.toFixed(2)}</Text>
          </Text>
          <View style={styles.chipsRow}>
            {deadZones.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.chip,
                  Math.abs(steeringConfig.deadZone - d) < 0.01 && styles.chipActive
                ]}
                onPress={() => updateSteeringConfig({ deadZone: d })}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    Math.abs(steeringConfig.deadZone - d) < 0.01 && styles.chipTextActive
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Smoothing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Smoothing Filter: <Text style={styles.valHighlight}>{steeringConfig.smoothing === 0 ? 'Instant (Off)' : steeringConfig.smoothing.toFixed(2)}</Text>
          </Text>
          <View style={styles.chipsRow}>
            {smoothings.map((sm) => (
              <TouchableOpacity
                key={sm}
                style={[
                  styles.chip,
                  Math.abs(steeringConfig.smoothing - sm) < 0.01 && styles.chipActive
                ]}
                onPress={() => updateSteeringConfig({ smoothing: sm })}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    Math.abs(steeringConfig.smoothing - sm) < 0.01 && styles.chipTextActive
                  ]}
                >
                  {sm === 0 ? 'Off' : `${sm}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Invert Steering Toggle */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleTitle}>Invert Steering Direction</Text>
            <Text style={styles.toggleSubtitle}>Reverse left / right phone tilt orientation</Text>
          </View>
          <Switch
            value={steeringConfig.invert}
            onValueChange={(val) => updateSteeringConfig({ invert: val })}
            trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryContainer }}
            thumbColor={steeringConfig.invert ? Theme.colors.primary : '#FFFFFF'}
          />
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backBtnText}>SAVE & CLOSE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgRoot
  },
  content: {
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.textPrimary
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2
  },
  section: {
    marginBottom: 22
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.textSecondary,
    marginBottom: 10
  },
  valHighlight: {
    color: Theme.colors.primary,
    fontWeight: '900'
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  chip: {
    backgroundColor: Theme.colors.bgCard,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  chipActive: {
    backgroundColor: Theme.colors.primaryContainer,
    borderColor: Theme.colors.primary
  },
  chipText: {
    color: Theme.colors.textSecondary,
    fontWeight: '800',
    fontSize: 13
  },
  chipTextActive: {
    color: Theme.colors.onPrimaryContainer,
    fontWeight: '900'
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.bgCard,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  toggleTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800'
  },
  toggleSubtitle: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2
  },
  backBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  backBtnText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1
  }
});
