import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

export const GyroTestScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    rawGyro,
    neutralOffset,
    rawTilt,
    liveSteering,
    steeringConfig,
    calibrate,
    startController,
    stopController
  } = useControllerStore();

  useEffect(() => {
    startController();
    return () => {
      stopController();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.bgRoot} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Gyroscope Diagnostics</Text>
          <Text style={styles.subtitle}>Real-time sensor telemetry & filter pipeline</Text>
        </View>

        {/* Live Output Gauge */}
        <View style={styles.gaugeCard}>
          <Text style={styles.cardHeader}>Normalized Steering Output</Text>
          <Text style={[styles.bigValue, liveSteering === 0 ? styles.neutralColor : styles.activeColor]}>
            {liveSteering > 0 ? `+${liveSteering.toFixed(4)}` : liveSteering.toFixed(4)}
          </Text>
          <Text style={styles.gaugeSub}>Range: -1.0 (Full Left) to +1.0 (Full Right)</Text>

          {/* Visual Track */}
          <View style={styles.barTrack}>
            <View style={styles.centerLine} />
            <View
              style={[
                styles.barFill,
                {
                  left: liveSteering < 0 ? `${(liveSteering + 1) * 50}%` : '50%',
                  width: `${Math.abs(liveSteering) * 50}%`,
                  backgroundColor: liveSteering < 0 ? Theme.colors.brake : Theme.colors.primary
                }
              ]}
            />
          </View>
        </View>

        {/* Raw Sensor Metrics */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Raw Motion Sensor Readings</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Raw X (Pitch):</Text>
            <Text style={styles.metricVal}>{rawGyro.x.toFixed(4)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Raw Y (Roll / Steer):</Text>
            <Text style={styles.metricValHighlight}>{rawGyro.y.toFixed(4)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Raw Z (Yaw):</Text>
            <Text style={styles.metricVal}>{rawGyro.z.toFixed(4)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Neutral Bias Offset:</Text>
            <Text style={styles.metricVal}>{neutralOffset.toFixed(4)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Raw Tilt Deflection (Δ):</Text>
            <Text style={styles.metricValHighlight}>{rawTilt.toFixed(4)}</Text>
          </View>
        </View>

        {/* Processing Configuration */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeader}>Active Filter Settings</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Sensitivity:</Text>
            <Text style={styles.metricVal}>{steeringConfig.sensitivity.toFixed(2)}x</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Dead Zone:</Text>
            <Text style={styles.metricVal}>{steeringConfig.deadZone.toFixed(2)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Smoothing Alpha:</Text>
            <Text style={styles.metricVal}>{steeringConfig.smoothing.toFixed(2)}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Invert Direction:</Text>
            <Text style={styles.metricVal}>{steeringConfig.invert ? 'YES (Inverted)' : 'NO (Normal)'}</Text>
          </View>
        </View>

        {/* Recalibrate & Done */}
        <TouchableOpacity style={styles.recalibrateBtn} onPress={calibrate} activeOpacity={0.85}>
          <Text style={styles.recalibrateBtnText}>🎯 RECALIBRATE NEUTRAL POSITION</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
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
    marginBottom: 20
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
  gaugeCard: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: 6
  },
  bigValue: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 4
  },
  neutralColor: { color: Theme.colors.textMuted },
  activeColor: { color: Theme.colors.textPrimary },
  gaugeSub: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginBottom: 14
  },
  barTrack: {
    width: '100%',
    height: 16,
    backgroundColor: Theme.colors.bgSubtle,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Theme.colors.primary
  },
  barFill: {
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  sectionCard: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderSubtle
  },
  metricLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600'
  },
  metricVal: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '700'
  },
  metricValHighlight: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '900'
  },
  recalibrateBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  recalibrateBtnText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '900'
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 14
  },
  backBtnText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '700'
  }
});
