import os
import sys
import subprocess
import threading
import json
import socket
import math
import time
import ctypes
import tkinter as tk
from tkinter import ttk, messagebox
import qrcode
from PIL import Image, ImageTk

# Windows SendInput ctypes definition for direct DirectX / Game hardware input
PUL = ctypes.POINTER(ctypes.c_ulong)
class KeyBdInput(ctypes.Structure):
    _fields_ = [("wVk", ctypes.c_ushort),
                ("wScan", ctypes.c_ushort),
                ("dwFlags", ctypes.c_ulong),
                ("time", ctypes.c_ulong),
                ("dwExtraInfo", PUL)]

class HardwareInput(ctypes.Structure):
    _fields_ = [("uMsg", ctypes.c_ulong),
                ("wParamL", ctypes.c_short),
                ("wParamH", ctypes.c_ushort)]

class MouseInput(ctypes.Structure):
    _fields_ = [("dx", ctypes.c_long),
                ("dy", ctypes.c_long),
                ("mouseData", ctypes.c_ulong),
                ("dwFlags", ctypes.c_ulong),
                ("time", ctypes.c_ulong),
                ("dwExtraInfo", PUL)]

class Input_I(ctypes.Union):
    _fields_ = [("ki", KeyBdInput),
                ("mi", MouseInput),
                ("hi", HardwareInput)]

class Input(ctypes.Structure):
    _fields_ = [("type", ctypes.c_ulong),
                ("ii", Input_I)]

KEYEVENTF_SCANCODE = 0x0008
KEYEVENTF_KEYUP = 0x0002

# DirectX Scan Codes for PC Games & Beach Buggy Racing
# Player 1 Keys:
SCAN_P1_UP = 0xC8       # Up Arrow
SCAN_P1_DOWN = 0xD0     # Down Arrow
SCAN_P1_LEFT = 0xCB     # Left Arrow
SCAN_P1_RIGHT = 0xCD    # Right Arrow
SCAN_P1_SPACE = 0x39    # Space (Power-Up / Select)
SCAN_P1_ENTER = 0x1C    # Enter (Confirm / Join)
SCAN_P1_W = 0x11        # W
SCAN_P1_A = 0x1E        # A
SCAN_P1_S = 0x1F        # S
SCAN_P1_D = 0x20        # D
SCAN_P1_Z = 0x2C        # Z (Power-Up)
SCAN_P1_X = 0x2D        # X (Handbrake)
SCAN_P1_B = 0x30        # B (Boost)
SCAN_P1_LSHIFT = 0x2A   # Left Shift (Boost)
SCAN_P1_LCTRL = 0x1D    # Left Ctrl (Drift)

# Player 2 Keys (Split-Screen):
SCAN_P2_I = 0x17        # I (Gas)
SCAN_P2_K = 0x25        # K (Brake)
SCAN_P2_J = 0x24        # J (Left)
SCAN_P2_L = 0x26        # L (Right)
SCAN_P2_U = 0x16        # U (Power-Up / Join)
SCAN_P2_O = 0x18        # O (Boost)
SCAN_P2_N = 0x31        # N (Handbrake)

# Player 3 Keys (Split-Screen / Numpad):
SCAN_P3_8 = 0x48        # Num 8 (Gas)
SCAN_P3_2 = 0x50        # Num 2 / 5 (Brake)
SCAN_P3_4 = 0x4B        # Num 4 (Left)
SCAN_P3_6 = 0x4D        # Num 6 (Right)
SCAN_P3_0 = 0x52        # Num 0 (Power-Up / Join)
SCAN_P3_7 = 0x47        # Num 7 (Boost)
SCAN_P3_1 = 0x4F        # Num 1 (Handbrake)

# Player 4 Keys (Split-Screen / Secondary Alpha):
SCAN_P4_T = 0x14        # T (Gas)
SCAN_P4_G = 0x22        # G (Brake)
SCAN_P4_F = 0x21        # F (Left)
SCAN_P4_H = 0x23        # H (Right)
SCAN_P4_Y = 0x15        # Y (Power-Up / Join)
SCAN_P4_R = 0x13        # R (Boost)
SCAN_P4_V = 0x2F        # V (Handbrake)

class WindowsInputFeeder:
    def __init__(self):
        self.enabled = True
        self.pressed_keys = set()
        self.lock = threading.Lock()

    def press_scancode(self, code):
        if not self.enabled or sys.platform != 'win32':
            return
        with self.lock:
            if code in self.pressed_keys:
                return
            self.pressed_keys.add(code)
            extra = ctypes.c_ulong(0)
            ii_ = Input_I()
            ii_.ki = KeyBdInput(0, code, KEYEVENTF_SCANCODE, 0, ctypes.pointer(extra))
            x = Input(ctypes.c_ulong(1), ii_)
            ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

    def release_scancode(self, code):
        if not self.enabled or sys.platform != 'win32':
            return
        with self.lock:
            if code not in self.pressed_keys:
                return
            self.pressed_keys.remove(code)
            extra = ctypes.c_ulong(0)
            ii_ = Input_I()
            ii_.ki = KeyBdInput(0, code, KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP, 0, ctypes.pointer(extra))
            x = Input(ctypes.c_ulong(1), ii_)
            ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

    def tap_scancode(self, code, duration_sec=0.08):
        self.press_scancode(code)
        threading.Timer(duration_sec, lambda: self.release_scancode(code)).start()

    def reset_all(self):
        with self.lock:
            for code in list(self.pressed_keys):
                extra = ctypes.c_ulong(0)
                ii_ = Input_I()
                ii_.ki = KeyBdInput(0, code, KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP, 0, ctypes.pointer(extra))
                x = Input(ctypes.c_ulong(1), ii_)
                ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))
            self.pressed_keys.clear()

input_feeder = WindowsInputFeeder()

def trigger_claim_screen(slot):
    """Firmly taps all possible join / select keys for that player slot so the game registers the split-screen claim"""
    if not input_feeder.enabled:
        return
    if slot == 1:
        input_feeder.press_scancode(SCAN_P1_SPACE)
        input_feeder.press_scancode(SCAN_P1_ENTER)
        input_feeder.press_scancode(SCAN_P1_Z)
        input_feeder.press_scancode(SCAN_P1_W)
        threading.Timer(0.20, lambda: (
            input_feeder.release_scancode(SCAN_P1_SPACE),
            input_feeder.release_scancode(SCAN_P1_ENTER),
            input_feeder.release_scancode(SCAN_P1_Z),
            input_feeder.release_scancode(SCAN_P1_W)
        )).start()
    elif slot == 2:
        input_feeder.press_scancode(SCAN_P2_U)
        input_feeder.press_scancode(SCAN_P2_I)
        input_feeder.press_scancode(SCAN_P1_ENTER)
        threading.Timer(0.20, lambda: (
            input_feeder.release_scancode(SCAN_P2_U),
            input_feeder.release_scancode(SCAN_P2_I),
            input_feeder.release_scancode(SCAN_P1_ENTER)
        )).start()
    elif slot == 3:
        input_feeder.press_scancode(SCAN_P3_0)
        input_feeder.press_scancode(SCAN_P3_8)
        input_feeder.press_scancode(SCAN_P1_ENTER)
        threading.Timer(0.20, lambda: (
            input_feeder.release_scancode(SCAN_P3_0),
            input_feeder.release_scancode(SCAN_P3_8),
            input_feeder.release_scancode(SCAN_P1_ENTER)
        )).start()
    elif slot == 4:
        input_feeder.press_scancode(SCAN_P4_Y)
        input_feeder.press_scancode(SCAN_P4_T)
        input_feeder.press_scancode(SCAN_P1_ENTER)
        threading.Timer(0.20, lambda: (
            input_feeder.release_scancode(SCAN_P4_Y),
            input_feeder.release_scancode(SCAN_P4_T),
            input_feeder.release_scancode(SCAN_P1_ENTER)
        )).start()

def dispatch_hardware_input(slot, steer, accel, brake, handbrake, boost, powerUp, buttons):
    """Direct, immediate OS hardware dispatch (0ms latency, runs in background thread)"""
    if not input_feeder.enabled:
        return

    btn_dict = buttons or {}
    a_active = powerUp or btn_dict.get('A', False) or btn_dict.get('JOIN', False) or btn_dict.get('START', False)
    y_active = boost or btn_dict.get('Y', False) or btn_dict.get('BOOST', False)
    rb_active = handbrake or btn_dict.get('RB', False)

    if slot == 1:
        # Player 1 Steering: Instant response with 0.02 threshold
        if steer < -0.02:
            input_feeder.press_scancode(SCAN_P1_A)
            input_feeder.press_scancode(SCAN_P1_LEFT)
            input_feeder.release_scancode(SCAN_P1_D)
            input_feeder.release_scancode(SCAN_P1_RIGHT)
        elif steer > 0.02:
            input_feeder.press_scancode(SCAN_P1_D)
            input_feeder.press_scancode(SCAN_P1_RIGHT)
            input_feeder.release_scancode(SCAN_P1_A)
            input_feeder.release_scancode(SCAN_P1_LEFT)
        else:
            input_feeder.release_scancode(SCAN_P1_A)
            input_feeder.release_scancode(SCAN_P1_LEFT)
            input_feeder.release_scancode(SCAN_P1_D)
            input_feeder.release_scancode(SCAN_P1_RIGHT)

        # Accelerate / Gas (W / Up Arrow)
        if accel > 0.04:
            input_feeder.press_scancode(SCAN_P1_W)
            input_feeder.press_scancode(SCAN_P1_UP)
        else:
            input_feeder.release_scancode(SCAN_P1_W)
            input_feeder.release_scancode(SCAN_P1_UP)

        # Brake / Reverse (S / Down Arrow)
        if brake > 0.04:
            input_feeder.press_scancode(SCAN_P1_S)
            input_feeder.press_scancode(SCAN_P1_DOWN)
        else:
            input_feeder.release_scancode(SCAN_P1_S)
            input_feeder.release_scancode(SCAN_P1_DOWN)

        # Power-Up Item / Split-Screen Claim (Space / Z / Enter)
        if a_active:
            input_feeder.press_scancode(SCAN_P1_SPACE)
            input_feeder.press_scancode(SCAN_P1_Z)
            input_feeder.press_scancode(SCAN_P1_ENTER)
        else:
            input_feeder.release_scancode(SCAN_P1_SPACE)
            input_feeder.release_scancode(SCAN_P1_Z)
            input_feeder.release_scancode(SCAN_P1_ENTER)

        # Boost / Nitro (B / Shift)
        if y_active:
            input_feeder.press_scancode(SCAN_P1_B)
            input_feeder.press_scancode(SCAN_P1_LSHIFT)
        else:
            input_feeder.release_scancode(SCAN_P1_B)
            input_feeder.release_scancode(SCAN_P1_LSHIFT)

        # Handbrake / Drift (Ctrl / X)
        if rb_active:
            input_feeder.press_scancode(SCAN_P1_LCTRL)
            input_feeder.press_scancode(SCAN_P1_X)
        else:
            input_feeder.release_scancode(SCAN_P1_LCTRL)
            input_feeder.release_scancode(SCAN_P1_X)

    elif slot == 2:
        # Player 2 Steering (J / L)
        if steer < -0.02:
            input_feeder.press_scancode(SCAN_P2_J)
            input_feeder.release_scancode(SCAN_P2_L)
        elif steer > 0.02:
            input_feeder.press_scancode(SCAN_P2_L)
            input_feeder.release_scancode(SCAN_P2_J)
        else:
            input_feeder.release_scancode(SCAN_P2_J)
            input_feeder.release_scancode(SCAN_P2_L)

        # Gas (I)
        if accel > 0.04:
            input_feeder.press_scancode(SCAN_P2_I)
        else:
            input_feeder.release_scancode(SCAN_P2_I)

        # Brake (K)
        if brake > 0.04:
            input_feeder.press_scancode(SCAN_P2_K)
        else:
            input_feeder.release_scancode(SCAN_P2_K)

        # Power-Up (U)
        if a_active:
            input_feeder.press_scancode(SCAN_P2_U)
        else:
            input_feeder.release_scancode(SCAN_P2_U)

        # Boost (O)
        if y_active:
            input_feeder.press_scancode(SCAN_P2_O)
        else:
            input_feeder.release_scancode(SCAN_P2_O)

        # Handbrake (N)
        if rb_active:
            input_feeder.press_scancode(SCAN_P2_N)
        else:
            input_feeder.release_scancode(SCAN_P2_N)

    elif slot == 3:
        # Player 3 Steering (Num 4 / Num 6)
        if steer < -0.02:
            input_feeder.press_scancode(SCAN_P3_4)
            input_feeder.release_scancode(SCAN_P3_6)
        elif steer > 0.02:
            input_feeder.press_scancode(SCAN_P3_6)
            input_feeder.release_scancode(SCAN_P3_4)
        else:
            input_feeder.release_scancode(SCAN_P3_4)
            input_feeder.release_scancode(SCAN_P3_6)

        # Gas (Num 8)
        if accel > 0.04:
            input_feeder.press_scancode(SCAN_P3_8)
        else:
            input_feeder.release_scancode(SCAN_P3_8)

        # Brake (Num 2)
        if brake > 0.04:
            input_feeder.press_scancode(SCAN_P3_2)
        else:
            input_feeder.release_scancode(SCAN_P3_2)

        # Power-Up (Num 0)
        if a_active:
            input_feeder.press_scancode(SCAN_P3_0)
        else:
            input_feeder.release_scancode(SCAN_P3_0)

        # Boost (Num 7)
        if y_active:
            input_feeder.press_scancode(SCAN_P3_7)
        else:
            input_feeder.release_scancode(SCAN_P3_7)

        # Handbrake (Num 1)
        if rb_active:
            input_feeder.press_scancode(SCAN_P3_1)
        else:
            input_feeder.release_scancode(SCAN_P3_1)

    elif slot == 4:
        # Player 4 Steering (F / H)
        if steer < -0.02:
            input_feeder.press_scancode(SCAN_P4_F)
            input_feeder.release_scancode(SCAN_P4_H)
        elif steer > 0.02:
            input_feeder.press_scancode(SCAN_P4_H)
            input_feeder.release_scancode(SCAN_P4_F)
        else:
            input_feeder.release_scancode(SCAN_P4_F)
            input_feeder.release_scancode(SCAN_P4_H)

        # Gas (T)
        if accel > 0.04:
            input_feeder.press_scancode(SCAN_P4_T)
        else:
            input_feeder.release_scancode(SCAN_P4_T)

        # Brake (G)
        if brake > 0.04:
            input_feeder.press_scancode(SCAN_P4_G)
        else:
            input_feeder.release_scancode(SCAN_P4_G)

        # Power-Up (Y)
        if a_active:
            input_feeder.press_scancode(SCAN_P4_Y)
        else:
            input_feeder.release_scancode(SCAN_P4_Y)

        # Boost (R)
        if y_active:
            input_feeder.press_scancode(SCAN_P4_R)
        else:
            input_feeder.release_scancode(SCAN_P4_R)

        # Handbrake (V)
        if rb_active:
            input_feeder.press_scancode(SCAN_P4_V)
        else:
            input_feeder.release_scancode(SCAN_P4_V)

        # Gas (T)
        if accel > 0.06:
            input_feeder.press_scancode(SCAN_P4_T)
        else:
            input_feeder.release_scancode(SCAN_P4_T)

        # Brake (G)
        if brake > 0.06:
            input_feeder.press_scancode(SCAN_P4_G)
        else:
            input_feeder.release_scancode(SCAN_P4_G)

        # Power-Up (Y)
        if a_active:
            input_feeder.press_scancode(SCAN_P4_Y)
        else:
            input_feeder.release_scancode(SCAN_P4_Y)

        # Boost (R)
        if y_active:
            input_feeder.press_scancode(SCAN_P4_R)
        else:
            input_feeder.release_scancode(SCAN_P4_R)

        # Handbrake (V)
        if rb_active:
            input_feeder.press_scancode(SCAN_P4_V)
        else:
            input_feeder.release_scancode(SCAN_P4_V)

# Google Developers & Raven Purple Theme Tokens
BG_ROOT = '#0d0716'
BG_CARD = '#160d26'
BG_CARD_HOVER = '#22133a'
BG_INPUT = '#0b0612'

PURPLE_PRIMARY = '#9333ea'
PURPLE_LIGHT = '#a855f7'
PURPLE_DARK = '#6b21a8'
PURPLE_GLOW = '#c084fc'
LAVENDER = '#e9d5ff'

WHITE = '#ffffff'
TEXT_SECONDARY = '#e2d9f3'
TEXT_MUTED = '#9e8db5'
TEXT_DIM = '#65547c'

BORDER = '#2c174a'
BORDER_ACTIVE = '#9333ea'

COLOR_ONLINE = '#10b981'
COLOR_ONLINE_BG = '#064e3b'
COLOR_OFFLINE = '#65547c'

COLOR_BRAKE = '#ef4444'
COLOR_GAS = '#8b5cf6'
COLOR_BOOST = '#f59e0b'
COLOR_POWERUP = '#06b6d4'

SLOT_COLORS = {
    1: {'primary': '#9333ea', 'glow': '#c084fc', 'name': 'Player 1'},
    2: {'primary': '#06b6d4', 'glow': '#67e8f9', 'name': 'Player 2'},
    3: {'primary': '#10b981', 'glow': '#6ee7b7', 'name': 'Player 3'},
    4: {'primary': '#f59e0b', 'glow': '#fde68a', 'name': 'Player 4'},
}

def get_primary_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

class PlayerSlotWidget(tk.Frame):
    """Visual telemetry widget for a single Virtual Gamepad Player Slot (1-4)"""
    def __init__(self, parent, slot_num):
        super().__init__(parent, bg=BG_CARD, highlightthickness=1, highlightbackground=BORDER, padx=10, pady=8)
        self.slot_num = slot_num
        self.cfg = SLOT_COLORS[slot_num]
        self.is_connected = False

        # Header: Slot Title & Status
        hdr = tk.Frame(self, bg=BG_CARD)
        hdr.pack(fill=tk.X, pady=(0, 4))

        self.lbl_title = tk.Label(
            hdr,
            text=f"🎮 P{slot_num} • {self.cfg['name']}",
            font=("Segoe UI", 10, "bold"),
            fg=self.cfg['glow'],
            bg=BG_CARD
        )
        self.lbl_title.pack(side=tk.LEFT)

        self.lbl_status = tk.Label(
            hdr,
            text="DISCONNECTED",
            font=("Segoe UI", 8, "bold"),
            fg=TEXT_DIM,
            bg=BG_CARD
        )
        self.lbl_status.pack(side=tk.RIGHT)

        # Main Body: Left Steering Dial + Right Pedal & Button HUD
        body = tk.Frame(self, bg=BG_CARD)
        body.pack(fill=tk.BOTH, expand=True)

        # Steering Joypad Canvas
        self.canvas_size = 88
        self.canvas = tk.Canvas(
            body,
            width=self.canvas_size,
            height=self.canvas_size,
            bg=BG_INPUT,
            highlightthickness=1,
            highlightbackground=BORDER
        )
        self.canvas.pack(side=tk.LEFT, padx=(0, 8))

        # Right Telemetry Zone
        right_box = tk.Frame(body, bg=BG_CARD)
        right_box.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # Gas (RT) Bar
        gas_row = tk.Frame(right_box, bg=BG_CARD)
        gas_row.pack(fill=tk.X, pady=1)
        tk.Label(gas_row, text="GAS (RT)", font=("Segoe UI", 7, "bold"), fg=COLOR_GAS, bg=BG_CARD, width=8, anchor="w").pack(side=tk.LEFT)
        self.gas_bar_bg = tk.Frame(gas_row, bg=BG_INPUT, height=10, highlightthickness=1, highlightbackground=BORDER)
        self.gas_bar_bg.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=4)
        self.gas_fill = tk.Frame(self.gas_bar_bg, bg=COLOR_GAS, width=0)
        self.gas_fill.place(x=0, y=0, relheight=1.0, width=0)

        # Brake (LT) Bar
        brake_row = tk.Frame(right_box, bg=BG_CARD)
        brake_row.pack(fill=tk.X, pady=1)
        tk.Label(brake_row, text="BRAKE (LT)", font=("Segoe UI", 7, "bold"), fg=COLOR_BRAKE, bg=BG_CARD, width=8, anchor="w").pack(side=tk.LEFT)
        self.brake_bar_bg = tk.Frame(brake_row, bg=BG_INPUT, height=10, highlightthickness=1, highlightbackground=BORDER)
        self.brake_bar_bg.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=4)
        self.brake_fill = tk.Frame(self.brake_bar_bg, bg=COLOR_BRAKE, width=0)
        self.brake_fill.place(x=0, y=0, relheight=1.0, width=0)

        # Action Button Badges Row
        self.btn_frame = tk.Frame(right_box, bg=BG_CARD)
        self.btn_frame.pack(fill=tk.X, pady=(4, 0))

        self.btn_badges = {}
        for btn_name in ['A', 'B', 'X', 'Y', 'RB', 'BOOST']:
            badge = tk.Label(
                self.btn_frame,
                text=btn_name,
                font=("Segoe UI", 7, "bold"),
                fg=TEXT_DIM,
                bg=BG_INPUT,
                padx=4,
                pady=1,
                bd=1,
                relief=tk.SOLID
            )
            badge.pack(side=tk.LEFT, padx=2)
            self.btn_badges[btn_name] = badge

        # Test Claim / Join Split-Screen Button
        self.btn_claim = tk.Button(
            right_box,
            text="⚡ Claim Screen Slot",
            font=("Segoe UI", 7, "bold"),
            fg=WHITE,
            bg=PURPLE_DARK,
            activebackground=PURPLE_PRIMARY,
            activeforeground=WHITE,
            bd=0,
            cursor="hand2",
            padx=2,
            pady=2,
            command=lambda: trigger_claim_screen(self.slot_num)
        )
        self.btn_claim.pack(fill=tk.X, pady=(4, 0))

        self.draw_dial(0.0)

    def draw_dial(self, steer):
        self.canvas.delete("all")
        cx = self.canvas_size / 2
        cy = self.canvas_size / 2
        r = (self.canvas_size / 2) - 8

        self.canvas.create_oval(cx - r, cy - r, cx + r, cy + r, outline=BORDER, width=2)
        self.canvas.create_oval(cx - 3, cy - 3, cx + 3, cy + 3, fill=BORDER_ACTIVE)

        angle_deg = -90 + (steer * 45)
        rad = math.radians(angle_deg)
        nx = cx + (r - 4) * math.cos(rad)
        ny = cy + (r - 4) * math.sin(rad)

        color = self.cfg['primary'] if self.is_connected else TEXT_DIM
        self.canvas.create_line(cx, cy, nx, ny, fill=color, width=3, capstyle=tk.ROUND)
        self.canvas.create_oval(nx - 4, ny - 4, nx + 4, ny + 4, fill=self.cfg['glow'], outline="")

        deg_int = int(steer * 45)
        deg_str = f"{deg_int:+d}°" if deg_int != 0 else "0°"
        self.canvas.create_text(cx, cy + r - 8, text=deg_str, font=("Consolas", 8, "bold"), fill=TEXT_MUTED)

    def set_connected(self, connected, name=None):
        self.is_connected = connected
        if connected:
            self.config(highlightbackground=self.cfg['primary'])
            self.lbl_title.config(text=f"🎮 P{self.slot_num} • {name or self.cfg['name']}")
            self.lbl_status.config(text="● ACTIVE", fg=COLOR_ONLINE)
            if self.slot_num == 1:
                input_feeder.tap_scancode(SCAN_P1_SPACE)
                input_feeder.tap_scancode(SCAN_P1_ENTER)
            elif self.slot_num == 2:
                input_feeder.tap_scancode(SCAN_P2_U)
        else:
            self.config(highlightbackground=BORDER)
            self.lbl_title.config(text=f"🎮 P{self.slot_num} • {self.cfg['name']}")
            self.lbl_status.config(text="DISCONNECTED", fg=TEXT_DIM)
            self.update_telemetry_ui(0.0, 0.0, 0.0, False, False, False, {})

    def update_telemetry_ui(self, steer, accel, brake, handbrake, boost, powerUp, buttons):
        """Throttled UI redraw function"""
        self.draw_dial(steer)
        self.gas_fill.place(x=0, y=0, relheight=1.0, relwidth=max(0.0, min(1.0, accel)))
        self.brake_fill.place(x=0, y=0, relheight=1.0, relwidth=max(0.0, min(1.0, brake)))

        btn_dict = buttons or {}
        a_active = powerUp or btn_dict.get('A', False)
        b_active = btn_dict.get('B', False)
        x_active = btn_dict.get('X', False)
        y_active = boost or btn_dict.get('Y', False)
        rb_active = handbrake or btn_dict.get('RB', False)
        boost_active = boost or btn_dict.get('BOOST', False)

        states = {
            'A': (a_active, COLOR_POWERUP),
            'B': (b_active, PURPLE_PRIMARY),
            'X': (x_active, '#38bdf8'),
            'Y': (y_active, COLOR_BOOST),
            'RB': (rb_active, COLOR_BRAKE),
            'BOOST': (boost_active, COLOR_BOOST),
        }

        for key, (active, col) in states.items():
            if key in self.btn_badges:
                if active:
                    self.btn_badges[key].config(fg=WHITE, bg=col)
                else:
                    self.btn_badges[key].config(fg=TEXT_DIM, bg=BG_INPUT)

class GynooServerGUI(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title('GYNOO PC Server — Wireless Motion Gamepad')
        self.geometry('980x680')
        self.minsize(900, 620)
        self.configure(bg=BG_ROOT)

        self.server_process = None
        self.is_running = False
        self.host_ip = get_primary_ip()
        self.port = 8888
        self.room_code = 'BBR1'
        self.selected_profile = 'bbr1'

        self.init_ui()
        self.start_server()

        self.protocol("WM_DELETE_WINDOW", self.on_close)

    def init_ui(self):
        header_frame = tk.Frame(self, bg=BG_CARD, height=68, bd=0, highlightthickness=1, highlightbackground=BORDER)
        header_frame.pack(fill=tk.X, padx=14, pady=(12, 6))
        header_frame.pack_propagate(False)

        title_box = tk.Frame(header_frame, bg=BG_CARD)
        title_box.pack(side=tk.LEFT, padx=16, pady=10)

        title_lbl = tk.Label(title_box, text="⚡ GYNOO SERVER", font=("Segoe UI", 16, "bold"), fg=WHITE, bg=BG_CARD)
        title_lbl.pack(anchor="w")

        sub_lbl = tk.Label(title_box, text="Wireless Mobile Game-Controller Platform (oii pad)", font=("Segoe UI", 9), fg=TEXT_MUTED, bg=BG_CARD)
        sub_lbl.pack(anchor="w")

        top_right = tk.Frame(header_frame, bg=BG_CARD)
        top_right.pack(side=tk.RIGHT, padx=16, pady=10)

        self.feeder_var = tk.BooleanVar(value=True)
        chk_feeder = tk.Checkbutton(
            top_right,
            text="Direct Game Input Feeder (Active)",
            variable=self.feeder_var,
            font=("Segoe UI", 8, "bold"),
            fg=COLOR_ONLINE,
            bg=BG_CARD,
            selectcolor=BG_INPUT,
            activebackground=BG_CARD,
            activeforeground=COLOR_ONLINE,
            command=self.toggle_feeder
        )
        chk_feeder.pack(side=tk.LEFT, padx=(0, 10))

        self.status_badge = tk.Label(
            top_right,
            text="● ONLINE",
            font=("Segoe UI", 10, "bold"),
            fg=COLOR_ONLINE,
            bg=COLOR_ONLINE_BG,
            padx=12,
            pady=4,
            bd=1,
            relief=tk.SOLID
        )
        self.status_badge.pack(side=tk.LEFT)

        main_content = tk.Frame(self, bg=BG_ROOT)
        main_content.pack(fill=tk.BOTH, expand=True, padx=14, pady=6)

        left_col = tk.Frame(main_content, bg=BG_CARD, width=320, highlightthickness=1, highlightbackground=BORDER)
        left_col.pack(side=tk.LEFT, fill=tk.BOTH, padx=(0, 8), pady=0)
        left_col.pack_propagate(False)

        qr_title = tk.Label(left_col, text="SCAN TO CONNECT PHONE", font=("Segoe UI", 11, "bold"), fg=WHITE, bg=BG_CARD)
        qr_title.pack(anchor="center", pady=(14, 2))

        qr_desc = tk.Label(left_col, text="Scan with camera or mobile app", font=("Segoe UI", 8), fg=TEXT_MUTED, bg=BG_CARD)
        qr_desc.pack(anchor="center", pady=(0, 8))

        self.qr_canvas = tk.Label(left_col, bg=WHITE, bd=2, relief=tk.FLAT)
        self.qr_canvas.pack(pady=2)

        self.url_var = tk.StringVar(value=f"ws://{self.host_ip}:{self.port}")
        url_entry = tk.Entry(left_col, textvariable=self.url_var, font=("Consolas", 9, "bold"), fg=WHITE, bg=BG_INPUT, bd=0, highlightthickness=1, highlightbackground=BORDER_ACTIVE, justify="center")
        url_entry.pack(fill=tk.X, padx=16, pady=(10, 4), ipady=5)

        btn_copy = tk.Button(left_col, text="📋 Copy Connection Link", font=("Segoe UI", 9, "bold"), fg=WHITE, bg=BG_CARD_HOVER, activebackground=PURPLE_PRIMARY, activeforeground=WHITE, bd=1, relief=tk.FLAT, cursor="hand2", command=self.copy_link)
        btn_copy.pack(fill=tk.X, padx=16, pady=3, ipady=3)

        self.room_badge_lbl = tk.Label(left_col, text=f"Active Room Code: {self.room_code}", font=("Segoe UI", 9, "bold"), fg=LAVENDER, bg=BG_CARD)
        self.room_badge_lbl.pack(pady=(8, 4))

        btn_box = tk.Frame(left_col, bg=BG_CARD)
        btn_box.pack(fill=tk.X, padx=16, pady=(10, 8))

        self.btn_toggle_server = tk.Button(
            btn_box,
            text="⏹ Stop",
            font=("Segoe UI", 9, "bold"),
            fg=WHITE,
            bg=PURPLE_PRIMARY,
            activebackground=PURPLE_DARK,
            activeforeground=WHITE,
            bd=0,
            padx=12,
            pady=6,
            cursor="hand2",
            command=self.toggle_server
        )
        self.btn_toggle_server.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 4))

        btn_restart = tk.Button(
            btn_box,
            text="🔄 Restart",
            font=("Segoe UI", 9, "bold"),
            fg=WHITE,
            bg=BG_CARD_HOVER,
            activebackground=PURPLE_PRIMARY,
            activeforeground=WHITE,
            bd=1,
            highlightbackground=BORDER,
            padx=12,
            pady=6,
            cursor="hand2",
            command=self.restart_server
        )
        btn_restart.pack(side=tk.LEFT, fill=tk.X, expand=True)

        right_col = tk.Frame(main_content, bg=BG_ROOT)
        right_col.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(8, 0), pady=0)

        sec_hdr = tk.Frame(right_col, bg=BG_ROOT)
        sec_hdr.pack(fill=tk.X, pady=(0, 6))

        tk.Label(sec_hdr, text="VIRTUAL GAMEPAD SLOTS (1–4)", font=("Segoe UI", 11, "bold"), fg=WHITE, bg=BG_ROOT).pack(side=tk.LEFT)
        tk.Label(sec_hdr, text="DirectX 0ms Input Bridge", font=("Segoe UI", 8), fg=TEXT_MUTED, bg=BG_ROOT).pack(side=tk.RIGHT)

        self.slots_grid = tk.Frame(right_col, bg=BG_ROOT)
        self.slots_grid.pack(fill=tk.BOTH, expand=True)

        self.slot_widgets = {}
        for i in range(1, 5):
            row = (i - 1) // 2
            col = (i - 1) % 2
            w = PlayerSlotWidget(self.slots_grid, i)
            w.grid(row=row, column=col, sticky="nsew", padx=4, pady=4)
            self.slots_grid.grid_rowconfigure(row, weight=1)
            self.slots_grid.grid_columnconfigure(col, weight=1)
            self.slot_widgets[i] = w

        self.update_qr()

    def toggle_feeder(self):
        input_feeder.enabled = self.feeder_var.get()
        if not input_feeder.enabled:
            input_feeder.reset_all()

    def update_qr(self):
        connect_uri = f"gynoo://{self.host_ip}:{self.port}/{self.room_code}"
        self.url_var.set(f"ws://{self.host_ip}:{self.port}")
        self.room_badge_lbl.config(text=f"Active Room Code: {self.room_code}")

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=4,
            border=2,
        )
        qr.add_data(connect_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#160d26", back_color="#ffffff")
        self.qr_photo = ImageTk.PhotoImage(img)
        self.qr_canvas.config(image=self.qr_photo)

    def copy_link(self):
        connect_uri = f"gynoo://{self.host_ip}:{self.port}/{self.room_code}"
        self.clipboard_clear()
        self.clipboard_append(connect_uri)
        messagebox.showinfo("Copied", f"Connection link copied to clipboard:\n\n{connect_uri}")

    def start_server(self):
        if self.is_running:
            return

        def run_proc():
            try:
                pc_server_dir = os.path.dirname(os.path.abspath(__file__))
                self.server_process = subprocess.Popen(
                    ['node', 'dist/index.js'],
                    cwd=pc_server_dir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    encoding='utf-8',
                    errors='replace',
                    bufsize=1
                )
                self.is_running = True
                self.after(0, lambda: self.status_badge.config(text="● ONLINE", fg=COLOR_ONLINE, bg=COLOR_ONLINE_BG))

                last_gui_draw = {1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0}

                while True:
                    line = self.server_process.stdout.readline()
                    if not line:
                        break

                    if "[PORT]" in line:
                        try:
                            port_str = line.split("[PORT]")[-1].strip()
                            self.port = int(port_str)
                            self.after(0, self.update_qr)
                            self.after(0, lambda: self.status_badge.config(text="● ONLINE", fg=COLOR_ONLINE, bg=COLOR_ONLINE_BG))
                        except Exception:
                            pass
                    elif "WebSocket Server listening on port" in line:
                        try:
                            port_str = line.split("port")[-1].strip()
                            self.port = int(port_str)
                            self.after(0, self.update_qr)
                            self.after(0, lambda: self.status_badge.config(text="● ONLINE", fg=COLOR_ONLINE, bg=COLOR_ONLINE_BG))
                        except Exception:
                            pass

                    # Detect Telemetry
                    if "[TELEMETRY]" in line:
                        try:
                            data_str = line.split("[TELEMETRY]")[-1].strip()
                            data = json.loads(data_str)
                            slot = data.get('slot', 1)
                            steer = float(data.get('steer', 0.0))
                            accel = float(data.get('accel', 0.0))
                            brake = float(data.get('brake', 0.0))
                            handbrake = bool(data.get('handbrake', False))
                            boost = bool(data.get('boost', False))
                            powerUp = bool(data.get('powerUp', False))
                            buttons = data.get('buttons', {})

                            # 1. IMMEDIATE 0-DELAY HARDWARE DISPATCH (Executed on background thread, 0ms latency!)
                            dispatch_hardware_input(slot, steer, accel, brake, handbrake, boost, powerUp, buttons)

                            # 2. THROTTLED GUI REDRAW (Capped at 25 FPS to prevent Tkinter queue lag)
                            now = time.time()
                            if now - last_gui_draw.get(slot, 0.0) >= 0.04:
                                last_gui_draw[slot] = now
                                if slot in self.slot_widgets:
                                    self.after(0, lambda s=slot, st=steer, ac=accel, br=brake, hb=handbrake, bo=boost, pu=powerUp, bt=buttons:
                                               self.slot_widgets[s].update_telemetry_ui(st, ac, br, hb, bo, pu, bt))
                        except Exception:
                            pass

                    # Detect Player Join/Leave Events
                    if "[PLAYER_EVENT]" in line:
                        try:
                            data_str = line.split("[PLAYER_EVENT]")[-1].strip()
                            data = json.loads(data_str)
                            slot = data.get('slot', 1)
                            ev = data.get('event')
                            if ev == 'join' and slot in self.slot_widgets:
                                name = data.get('name', f"Player {slot}")
                                self.after(0, lambda s=slot, n=name: self.slot_widgets[s].set_connected(True, n))
                            elif ev == 'leave' and slot in self.slot_widgets:
                                self.after(0, lambda s=slot: self.slot_widgets[s].set_connected(False))
                        except Exception:
                            pass

                    # Fallback join detection from logger
                    if "joined room" in line and "in slot" in line:
                        try:
                            parts = line.split("in slot")
                            slot_num = int(parts[-1].strip())
                            p_name = line.split("Player")[-1].split("joined")[0].strip()
                            if slot_num in self.slot_widgets:
                                self.after(0, lambda s=slot_num, n=p_name: self.slot_widgets[s].set_connected(True, n))
                        except Exception:
                            pass

                    if "disconnected" in line and "Gamepad #" in line:
                        try:
                            slot_num = int(line.split("Gamepad #")[-1].split(" ")[0])
                            if slot_num in self.slot_widgets:
                                self.after(0, lambda s=slot_num: self.slot_widgets[s].set_connected(False))
                        except Exception:
                            pass

            except Exception as e:
                if self.is_running:
                    self.after(0, lambda: self.status_badge.config(text="● ERROR", fg=WHITE, bg="#7f1d1d"))

        threading.Thread(target=run_proc, daemon=True).start()

    def stop_server(self):
        input_feeder.reset_all()
        if self.server_process:
            try:
                self.server_process.terminate()
                self.server_process.kill()
            except Exception:
                pass
            self.server_process = None
        self.is_running = False
        self.status_badge.config(text="● OFFLINE", fg=TEXT_MUTED, bg="#1b1328")
        self.btn_toggle_server.config(text="▶ Start", bg=PURPLE_PRIMARY)
        for s in self.slot_widgets.values():
            s.set_connected(False)

    def toggle_server(self):
        if self.is_running:
            self.stop_server()
        else:
            self.start_server()
            self.btn_toggle_server.config(text="⏹ Stop", bg=PURPLE_PRIMARY)

    def restart_server(self):
        self.stop_server()
        self.after(1000, self.start_server)
        self.btn_toggle_server.config(text="⏹ Stop", bg=PURPLE_PRIMARY)

    def on_close(self):
        self.stop_server()
        self.destroy()
        sys.exit(0)

if __name__ == '__main__':
    app = GynooServerGUI()
    app.mainloop()
