import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TiltedSteeringWheelHud } from '../TiltedSteeringWheelHud';

interface TemplateProps {
  theme: any;
  liveSteering: number;
  calibrate: () => void;
  setButtonState: (updates: any) => void;
}

export const Bbr1Template: React.FC<TemplateProps> = ({
  theme,
  liveSteering,
  calibrate,
  setButtonState
}) => {
  return (
    <View style={styles.container}>
      {/* Left Control Zone: Handbrake (RB) + Brake / Reverse (LT) */}
      <View style={styles.leftZone}>
        <TouchableOpacity
          style={[styles.handbrakeBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.borderActive }]}
          activeOpacity={0.7}
          onPressIn={() => setButtonState({ handbrake: true, buttons: { RB: true } })}
          onPressOut={() => setButtonState({ handbrake: false, buttons: { RB: false } })}
        >
          <Text style={[styles.handbrakeText, { color: theme.colors.textPrimary }]}>
            DRIFT HANDBRAKE (RB)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.brakePedal, { backgroundColor: theme.colors.brake, borderColor: '#FB7185' }]}
          activeOpacity={0.8}
          onPressIn={() => setButtonState({ brake: 1.0, buttons: { LT: true } })}
          onPressOut={() => setButtonState({ brake: 0.0, buttons: { LT: false } })}
        >
          <Text style={styles.pedalIcon}>🛑</Text>
          <Text style={styles.pedalTitle}>BRAKE / REVERSE</Text>
          <Text style={styles.pedalSub}>LEFT TRIGGER (LT)</Text>
        </TouchableOpacity>
      </View>

      {/* Center Zone: Tilted Steering Wheel Joypad HUD + Utilities */}
      <View style={styles.centerZone}>
        <TiltedSteeringWheelHud steering={liveSteering} theme={theme} subTitle="BBR 1 RACING HUD" />

        <View style={styles.centerActions}>
          <TouchableOpacity
            style={[styles.utilBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ pause: true, buttons: { START: true } })}
            onPressOut={() => setButtonState({ pause: false, buttons: { START: false } })}
          >
            <Text style={[styles.utilBtnText, { color: theme.colors.textPrimary }]}>PAUSE ⏸️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.utilBtn, { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }]}
            activeOpacity={0.7}
            onPress={calibrate}
          >
            <Text style={[styles.utilBtnText, { color: theme.colors.onPrimaryContainer, fontWeight: '900' }]}>
              RESET 🎯
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Control Zone: Boost (Y) + Power-Up (A) + Gas Pedal (RT) */}
      <View style={styles.rightZone}>
        <View style={styles.topActionRow}>
          {/* Boost / Special Ability */}
          <TouchableOpacity
            style={[styles.boostBtn, { backgroundColor: theme.colors.boost, borderColor: '#FDE68A' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ boost: true, buttons: { Y: true } })}
            onPressOut={() => setButtonState({ boost: false, buttons: { Y: false } })}
          >
            <Text style={styles.actionIcon}>⚡</Text>
            <Text style={styles.actionText}>BOOST (Y)</Text>
          </TouchableOpacity>

          {/* Power-up Item */}
          <TouchableOpacity
            style={[styles.powerUpBtn, { backgroundColor: theme.colors.powerUp, borderColor: '#BAE6FD' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ powerUp: true, buttons: { A: true } })}
            onPressOut={() => setButtonState({ powerUp: false, buttons: { A: false } })}
          >
            <Text style={styles.actionIcon}>💥</Text>
            <Text style={styles.actionText}>POWER-UP (A)</Text>
          </TouchableOpacity>
        </View>

        {/* Large Throttle / Gas Pedal (RT) */}
        <TouchableOpacity
          style={[styles.gasPedal, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryLight }]}
          activeOpacity={0.8}
          onPressIn={() => setButtonState({ accelerate: 1.0, buttons: { RT: true } })}
          onPressOut={() => setButtonState({ accelerate: 0.0, buttons: { RT: false } })}
        >
          <Text style={styles.pedalIcon}>🏎️</Text>
          <Text style={styles.pedalTitle}>ACCELERATE</Text>
          <Text style={styles.pedalSub}>RIGHT TRIGGER (RT)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 12
  },
  leftZone: {
    flex: 2,
    justifyContent: 'space-between',
    gap: 10
  },
  handbrakeBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2
  },
  handbrakeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  brakePedal: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 4
  },
  centerZone: {
    flex: 1.5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4
  },
  centerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  utilBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  utilBtnText: {
    fontSize: 10,
    fontWeight: '800'
  },
  rightZone: {
    flex: 2.8,
    justifyContent: 'space-between',
    gap: 10
  },
  topActionRow: {
    flexDirection: 'row',
    gap: 10,
    height: 64
  },
  boostBtn: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2
  },
  powerUpBtn: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 2
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900'
  },
  gasPedal: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 4
  },
  pedalIcon: {
    fontSize: 28,
    marginBottom: 2
  },
  pedalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  pedalSub: {
    color: '#E0D6F5',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2
  }
});
