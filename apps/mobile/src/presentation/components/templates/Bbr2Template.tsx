import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TiltedSteeringWheelHud } from '../TiltedSteeringWheelHud';

interface TemplateProps {
  theme: any;
  liveSteering: number;
  calibrate: () => void;
  setButtonState: (updates: any) => void;
}

export const Bbr2Template: React.FC<TemplateProps> = ({
  theme,
  liveSteering,
  calibrate,
  setButtonState
}) => {
  return (
    <View style={styles.container}>
      {/* Left Control Zone: Handbrake + Jump (X) + Brake Pedal (LT) */}
      <View style={styles.leftZone}>
        <View style={styles.leftTopRow}>
          <TouchableOpacity
            style={[styles.smallActionBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.borderActive }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ handbrake: true, buttons: { RB: true } })}
            onPressOut={() => setButtonState({ handbrake: false, buttons: { RB: false } })}
          >
            <Text style={[styles.smallActionText, { color: theme.colors.textPrimary }]}>DRIFT (RB)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallActionBtn, { backgroundColor: '#1E293B', borderColor: '#38BDF8' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { X: true } })}
            onPressOut={() => setButtonState({ buttons: { X: false } })}
          >
            <Text style={[styles.smallActionText, { color: '#38BDF8' }]}>JUMP (X)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.brakePedal, { backgroundColor: theme.colors.brake, borderColor: '#FB7185' }]}
          activeOpacity={0.8}
          onPressIn={() => setButtonState({ brake: 1.0, buttons: { LT: true } })}
          onPressOut={() => setButtonState({ brake: 0.0, buttons: { LT: false } })}
        >
          <Text style={styles.pedalIcon}>🛑</Text>
          <Text style={styles.pedalTitle}>BRAKE / REV</Text>
          <Text style={styles.pedalSub}>LEFT TRIGGER (LT)</Text>
        </TouchableOpacity>
      </View>

      {/* Center Zone: Tilted Steering Wheel HUD & Controls */}
      <View style={styles.centerZone}>
        <TiltedSteeringWheelHud steering={liveSteering} theme={theme} subTitle="BBR 2 DUAL ITEM HUD" />

        {/* Driver Special Ability (Y) */}
        <TouchableOpacity
          style={[styles.driverSpecialBtn, { backgroundColor: theme.colors.boost, borderColor: '#FDE68A' }]}
          activeOpacity={0.7}
          onPressIn={() => setButtonState({ boost: true, buttons: { Y: true } })}
          onPressOut={() => setButtonState({ boost: false, buttons: { Y: false } })}
        >
          <Text style={styles.specialIcon}>⚡</Text>
          <Text style={styles.specialText}>DRIVER SPECIAL (Y)</Text>
        </TouchableOpacity>

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

      {/* Right Control Zone: Dual Power-Ups (A & B) + Accelerate (RT) */}
      <View style={styles.rightZone}>
        <View style={styles.dualItemRow}>
          {/* Item Slot 1 (A) */}
          <TouchableOpacity
            style={[styles.itemSlotBtn, { backgroundColor: theme.colors.powerUp, borderColor: '#38BDF8' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ powerUp: true, buttons: { A: true } })}
            onPressOut={() => setButtonState({ powerUp: false, buttons: { A: false } })}
          >
            <Text style={styles.itemBadge}>SLOT 1</Text>
            <Text style={styles.itemIcon}>💥</Text>
            <Text style={styles.itemKeyText}>ITEM (A)</Text>
          </TouchableOpacity>

          {/* Item Slot 2 (B) */}
          <TouchableOpacity
            style={[styles.itemSlotBtn, { backgroundColor: '#7C3AED', borderColor: '#C084FC' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { B: true } })}
            onPressOut={() => setButtonState({ buttons: { B: false } })}
          >
            <Text style={styles.itemBadge}>SLOT 2</Text>
            <Text style={styles.itemIcon}>🛡️</Text>
            <Text style={styles.itemKeyText}>ITEM (B)</Text>
          </TouchableOpacity>
        </View>

        {/* Large Throttle / Gas Pedal (RT) */}
        <TouchableOpacity
          style={[styles.gasPedal, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryLight }]}
          activeOpacity={0.8}
          onPressIn={() => setButtonState({ accelerate: 1.0, buttons: { RT: true } })}
          onPressOut={() => setButtonState({ accelerate: 0.0, buttons: { RT: false } })}
        >
          <Text style={styles.pedalIcon}>🏁</Text>
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
  leftTopRow: {
    flexDirection: 'row',
    gap: 8,
    height: 48
  },
  smallActionBtn: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2
  },
  smallActionText: {
    fontSize: 10,
    fontWeight: '900'
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
    flex: 1.6,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2
  },
  driverSpecialBtn: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 4,
    elevation: 2
  },
  specialIcon: {
    fontSize: 16
  },
  specialText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  centerActions: {
    flexDirection: 'row',
    gap: 8
  },
  utilBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  utilBtnText: {
    fontSize: 9,
    fontWeight: '800'
  },
  rightZone: {
    flex: 2.8,
    justifyContent: 'space-between',
    gap: 10
  },
  dualItemRow: {
    flexDirection: 'row',
    gap: 10,
    height: 64
  },
  itemSlotBtn: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2,
    position: 'relative'
  },
  itemBadge: {
    position: 'absolute',
    top: 3,
    left: 6,
    fontSize: 7,
    fontWeight: '900',
    color: '#E0E7FF'
  },
  itemIcon: {
    fontSize: 18,
    marginTop: 4
  },
  itemKeyText: {
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
    fontSize: 26,
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
