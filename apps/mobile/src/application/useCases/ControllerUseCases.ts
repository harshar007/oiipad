import {
  ControllerState,
  GyroReading,
  MotionSensorPort,
  SensorUnsubscribe,
  SteeringConfiguration,
  SteeringProcessor,
  SteeringProcessResult,
  SteeringValue
} from '@oiipad/domain';
import { GynooWebSocketClient } from '../../infrastructure/networking/GynooWebSocketClient';
import { PROTOCOL_VERSION } from '@oiipad/protocol';

export class CalibrateSteering {
  constructor(
    private motionSensor: MotionSensorPort,
    private steeringProcessor: SteeringProcessor
  ) {}

  public execute(): GyroReading {
    const reading = this.motionSensor.getCurrentReading();
    this.steeringProcessor.calibrate(reading);
    return reading;
  }
}

export class AutoCalibrateSteering {
  constructor(
    private motionSensor: MotionSensorPort,
    private steeringProcessor: SteeringProcessor
  ) {}

  public async execute(sampleCount: number = 4, intervalMs: number = 60): Promise<GyroReading> {
    const samples: number[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const reading = this.motionSensor.getCurrentReading();
      if (typeof reading.y === 'number') {
        samples.push(reading.y);
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    const avgY = samples.length > 0 ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const calibratedReading = new GyroReading({ x: 0, y: avgY, z: 0, timestamp: Date.now() });
    this.steeringProcessor.calibrate(calibratedReading);
    return calibratedReading;
  }
}

export class StartController {
  private unsubscribeSensor: SensorUnsubscribe | null = null;
  private inputInterval: any = null;
  private lastUiUpdateTime: number = 0;
  private lastPacketSentTime: number = 0;

  constructor(
    private motionSensor: MotionSensorPort,
    private steeringProcessor: SteeringProcessor,
    private wsClient: GynooWebSocketClient
  ) {}

  public async execute(
    getPlayerId: () => string,
    getConfig: () => SteeringConfiguration,
    getButtonState: () => {
      accelerate: number;
      brake: number;
      handbrake: boolean;
      boost: boolean;
      powerUp: boolean;
      pause: boolean;
      buttons: Record<string, boolean>;
    },
    onProcessed?: (result: SteeringProcessResult) => void
  ): Promise<void> {
    await this.motionSensor.start(16); // 60Hz sensor poll

    let latestSteering = SteeringValue.center();
    let latestResult: SteeringProcessResult = {
      steering: latestSteering,
      rawTilt: 0,
      filteredTilt: 0
    };

    const sendControllerPacket = () => {
      const playerId = getPlayerId();
      if (!playerId || this.wsClient.connectionStatus !== 'connected') return;

      const buttons = getButtonState();
      this.wsClient.send({
        version: PROTOCOL_VERSION,
        type: 'controller_input',
        playerId,
        payload: {
          steering: latestSteering.value,
          accelerate: buttons.accelerate,
          brake: buttons.brake,
          handbrake: buttons.handbrake,
          boost: buttons.boost,
          powerUp: buttons.powerUp,
          pause: buttons.pause,
          buttons: buttons.buttons
        },
        timestamp: Date.now()
      });
    };

    this.unsubscribeSensor = this.motionSensor.subscribe((reading) => {
      const config = getConfig();
      const result = this.steeringProcessor.process(reading, config);
      latestSteering = result.steering;
      latestResult = result;

      const now = Date.now();

      // Immediate 0-latency packet dispatch on every hardware reading
      this.lastPacketSentTime = now;
      sendControllerPacket();

      // Throttled UI state updates at ~30 FPS (33ms) to prevent React thread stutter
      if (onProcessed && (now - this.lastUiUpdateTime >= 33)) {
        this.lastUiUpdateTime = now;
        onProcessed(result);
      }
    });

    // Fallback heartbeat dispatch loop (keeps connection fresh during zero-movement)
    this.inputInterval = setInterval(() => {
      const now = Date.now();
      if (now - this.lastPacketSentTime >= 50) {
        this.lastPacketSentTime = now;
        sendControllerPacket();
      }
    }, 50);

    this.activeSendPacket = sendControllerPacket;
  }

  private activeSendPacket: (() => void) | null = null;

  public sendImmediate(): void {
    if (this.activeSendPacket) {
      this.lastPacketSentTime = Date.now();
      this.activeSendPacket();
    }
  }

  public async stop(): Promise<void> {
    this.activeSendPacket = null;
    if (this.inputInterval) {
      clearInterval(this.inputInterval);
      this.inputInterval = null;
    }
    if (this.unsubscribeSensor) {
      this.unsubscribeSensor();
      this.unsubscribeSensor = null;
    }
    await this.motionSensor.stop();
  }
}
