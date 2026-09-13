import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TiltedSteeringWheelHudProps {
  steering: number; // -1.0 to +1.0
  theme: any;
  subTitle?: string;
}

export const TiltedSteeringWheelHud: React.FC<TiltedSteeringWheelHudProps> = ({
  steering,
  theme,
  subTitle
}) => {
  // Convert -1.0..+1.0 steering to degrees (-45° to +45°)
  const rotationDeg = Math.round(steering * 45);
  const steeringPercent = Math.round((steering + 1.0) * 50);

  return (
    <View style={styles.container}>
      {/* Outer Steering Wheel Ring with Dynamic Tilt Rotation */}
      <View
        style={[
          styles.wheelRing,
          {
            borderColor: theme.colors.primaryLight,
            transform: [{ rotate: `${rotationDeg}deg` }]
          }
        ]}
      >
        {/* Top Marker (12 o'clock notch) */}
        <View style={[styles.topMarker, { backgroundColor: theme.colors.primary }]} />
        
        {/* Left Spoke */}
        <View style={[styles.spokeHorizontal, styles.spokeLeft, { backgroundColor: theme.colors.primaryDark }]} />
        {/* Right Spoke */}
        <View style={[styles.spokeHorizontal, styles.spokeRight, { backgroundColor: theme.colors.primaryDark }]} />
        {/* Bottom Spoke */}
        <View style={[styles.spokeBottom, { backgroundColor: theme.colors.primaryDark }]} />

        {/* Center Hub */}
        <View style={[styles.wheelHub, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.borderActive }]}>
          <Text style={[styles.hubDegreeText, { color: theme.colors.textPrimary }]}>
            {rotationDeg > 0 ? `+${rotationDeg}°` : `${rotationDeg}°`}
          </Text>
        </View>
      </View>

      {/* Dynamic Linear Track Gauge */}
      <View style={[styles.trackContainer, { backgroundColor: theme.colors.bgInput, borderColor: theme.colors.border }]}>
        <View style={[styles.centerMark, { backgroundColor: theme.colors.primary }]} />
        <View
          style={[
            styles.indicatorBar,
            {
              backgroundColor: theme.colors.primaryLight,
              left: `${Math.max(2, Math.min(88, steeringPercent))}%`
            }
          ]}
        />
      </View>

      <View style={[styles.labelRow]}>
        <Text style={[styles.subLabel, { color: theme.colors.textDim }]}>
          {subTitle || `TILT: ${steering > 0 ? `+${steering.toFixed(2)}` : steering.toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2
  },
  wheelRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  topMarker: {
    position: 'absolute',
    top: -4,
    width: 6,
    height: 8,
    borderRadius: 3
  },
  spokeHorizontal: {
    position: 'absolute',
    height: 4,
    width: 22
  },
  spokeLeft: {
    left: 2
  },
  spokeRight: {
    right: 2
  },
  spokeBottom: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 20
  },
  wheelHub: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  hubDegreeText: {
    fontSize: 10,
    fontWeight: '900'
  },
  trackContainer: {
    width: 140,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6
  },
  centerMark: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2
  },
  indicatorBar: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    width: 14,
    borderRadius: 3
  },
  subLabel: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: 0.5
  }
});
