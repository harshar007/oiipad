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

export class StartController {
  private unsubscribeSensor: SensorUnsubscribe | null = null;
  private inputInterval: any = null;

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
    await this.motionSensor.start(16); // ~60Hz sensor poll

    let latestSteering = SteeringValue.center();

    this.unsubscribeSensor = this.motionSensor.subscribe((reading) => {
      const config = getConfig();
      const result = this.steeringProcessor.process(reading, config);
      latestSteering = result.steering;
      if (onProcessed) {
        onProcessed(result);
      }
    });

    // 40–60Hz Controller Packet Dispatch Loop
    this.inputInterval = setInterval(() => {
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
    }, 20); // 50 updates / sec
  }

  public async stop(): Promise<void> {
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
