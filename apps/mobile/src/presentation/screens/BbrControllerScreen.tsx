import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

export const BbrControllerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    playerSlot,
    gameProfile,
    liveSteering,
    calibrate,
    setButtonState,
    stopController
  } = useControllerStore();

  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleExit = async () => {
    await stopController();
    navigation.goBack();
  };

  // Convert steering [-1.0, 1.0] to visual percentage for the steering bar
  const steeringPercent = Math.round((liveSteering + 1.0) * 50);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      {/* Sleek Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>GYNOO</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileText}>
              {gameProfile === 'bbr2' ? 'BBR 2' : gameProfile === 'standard' ? 'GAMEPAD' : 'BBR 1'}
            </Text>
          </View>
        </View>

        {/* Glowing Steering Meter */}
        <View style={styles.steeringMeterContainer}>
          <View style={styles.steeringTrack}>
            <View style={styles.steeringCenterMark} />
            <View
              style={[
                styles.steeringIndicator,
                { left: `${Math.max(0, Math.min(92, steeringPercent))}%` }
              ]}
            />
          </View>
          <Text style={styles.steeringValueText}>
            STEER: {liveSteering > 0 ? `+${liveSteering.toFixed(2)}` : liveSteering.toFixed(2)}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.playerBadge}>
            <Text style={styles.playerText}>PLAYER {playerSlot ?? 1}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={calibrate}>
            <Text style={styles.iconText}>🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleExit}>
            <Text style={styles.iconClose}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showHint ? (
        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>🏎️ TILT PHONE LEFT & RIGHT TO STEER</Text>
        </View>
      ) : null}

      {/* Main Controller Surface */}
      <View style={styles.controlSurface}>
        {/* Left Thumb Zone: BRAKE & HANDBRAKE */}
        <View style={styles.leftControlZone}>
          <TouchableOpacity
            style={styles.handbrakeButton}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ handbrake: true })}
            onPressOut={() => setButtonState({ handbrake: false })}
          >
            <Text style={styles.handbrakeText}>HANDBRAKE (RB)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.brakeButton}
            activeOpacity={0.8}
            onPressIn={() => setButtonState({ brake: 1.0 })}
            onPressOut={() => setButtonState({ brake: 0.0 })}
          >
            <Text style={styles.brakeIcon}>🛑</Text>
            <Text style={styles.brakeText}>BRAKE / REVERSE</Text>
          </TouchableOpacity>
        </View>

        {/* Center Zone: Pause & Recalibrate */}
        <View style={styles.centerControlZone}>
          <TouchableOpacity
            style={styles.centerButton}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ pause: true })}
            onPressOut={() => setButtonState({ pause: false })}
          >
            <Text style={styles.centerButtonText}>PAUSE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.recalibrateButton}
            onPress={calibrate}
            activeOpacity={0.7}
          >
            <Text style={styles.recalibrateText}>CALIBRATE</Text>
          </TouchableOpacity>
        </View>

        {/* Right Thumb Zone: ACCELERATE, POWER-UP & SPECIAL BOOST */}
        <View style={styles.rightControlZone}>
          <View style={styles.topRightRow}>
            {/* Boost Special Ability */}
            <TouchableOpacity
              style={styles.boostButton}
              activeOpacity={0.7}
              onPressIn={() => setButtonState({ boost: true })}
              onPressOut={() => setButtonState({ boost: false })}
            >
              <Text style={styles.boostIcon}>⚡</Text>
              <Text style={styles.boostText}>BOOST (Y)</Text>
            </TouchableOpacity>

            {/* Power-Up Item */}
            <TouchableOpacity
              style={styles.powerUpButton}
              activeOpacity={0.7}
              onPressIn={() => setButtonState({ powerUp: true })}
              onPressOut={() => setButtonState({ powerUp: false })}
            >
              <Text style={styles.powerUpIcon}>💥</Text>
              <Text style={styles.powerUpText}>POWER-UP (A)</Text>
            </TouchableOpacity>
          </View>

          {/* Large Gas / Accelerate Pad in Raven Purple */}
          <TouchableOpacity
            style={styles.accelerateButton}
            activeOpacity={0.8}
            onPressIn={() => setButtonState({ accelerate: 1.0 })}
            onPressOut={() => setButtonState({ accelerate: 0.0 })}
          >
            <Text style={styles.accelerateIcon}>🏁</Text>
            <Text style={styles.accelerateText}>ACCELERATE (RT)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090412'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Theme.colors.bgCard,
    borderBottomWidth: 1.5,
    borderBottomColor: Theme.colors.border
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.colors.white,
    letterSpacing: 2
  },
  profileBadge: {
    backgroundColor: '#261245',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.colors.borderActive
  },
  profileText: {
    fontSize: 10,
    fontWeight: '800',
    color: Theme.colors.lavender
  },
  steeringMeterContainer: {
    flex: 1,
    maxWidth: 240,
    marginHorizontal: 12,
    alignItems: 'center'
  },
  steeringTrack: {
    width: '100%',
    height: 12,
    backgroundColor: '#090412',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  steeringCenterMark: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Theme.colors.borderActive
  },
  steeringIndicator: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    width: 16,
    backgroundColor: Theme.colors.primaryLight,
    borderRadius: 4,
    shadowColor: Theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  steeringValueText: {
    fontSize: 9,
    fontWeight: '800',
    color: Theme.colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  playerBadge: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  playerText: {
    fontSize: 11,
    fontWeight: '900',
    color: Theme.colors.white
  },
  iconButton: {
    padding: 6
  },
  iconText: {
    fontSize: 16
  },
  iconClose: {
    fontSize: 16,
    color: Theme.colors.white,
    fontWeight: '800'
  },
  hintBanner: {
    backgroundColor: Theme.colors.primaryDark,
    paddingVertical: 6,
    alignItems: 'center'
  },
  hintText: {
    color: Theme.colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1
  },
  controlSurface: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 12
  },
  leftControlZone: {
    flex: 2,
    justifyContent: 'space-between',
    gap: 10
  },
  handbrakeButton: {
    backgroundColor: '#1d0e33',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.borderActive
  },
  handbrakeText: {
    color: Theme.colors.white,
    fontSize: 12,
    fontWeight: '900'
  },
  brakeButton: {
    flex: 1,
    backgroundColor: Theme.colors.brake,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.brakeGlow,
    shadowColor: Theme.colors.brake,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  brakeIcon: {
    fontSize: 32,
    marginBottom: 4
  },
  brakeText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '900'
  },
  centerControlZone: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  centerButton: {
    backgroundColor: Theme.colors.bgCard,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Theme.colors.border
  },
  centerButtonText: {
    color: Theme.colors.white,
    fontSize: 11,
    fontWeight: '800'
  },
  recalibrateButton: {
    backgroundColor: Theme.colors.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.primaryLight
  },
  recalibrateText: {
    color: Theme.colors.white,
    fontSize: 11,
    fontWeight: '900'
  },
  rightControlZone: {
    flex: 3,
    justifyContent: 'space-between',
    gap: 10
  },
  topRightRow: {
    flexDirection: 'row',
    gap: 10,
    height: 70
  },
  boostButton: {
    flex: 1,
    backgroundColor: '#b45309',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.boost
  },
  boostIcon: {
    fontSize: 20
  },
  boostText: {
    color: Theme.colors.white,
    fontSize: 11,
    fontWeight: '900'
  },
  powerUpButton: {
    flex: 1,
    backgroundColor: '#0e7490',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.powerUp
  },
  powerUpIcon: {
    fontSize: 20
  },
  powerUpText: {
    color: Theme.colors.white,
    fontSize: 11,
    fontWeight: '900'
  },
  accelerateButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primaryGlow,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  accelerateIcon: {
    fontSize: 32,
    marginBottom: 4
  },
  accelerateText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '900'
  }
});
