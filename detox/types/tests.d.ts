declare namespace NodeJS {
  interface Global {
    DETOX_CLI?: boolean;
  }
}

declare var mockPackageJson: Function;
declare var callCli: Function;

type Nested<T> = {
  [key: string]: T | Nested<T>;
};

type TODO = any;

declare module 'detox' {
  export type ServerConfiguration = {
    address: string;
    port: number;

    slowInvocationThreshold: number;
  };

  export type ClientConfiguration = {
    serverUrl: string;
    clientId: string;
  };

  //<editor-fold desc="#region DeviceConfiguration">

  export type IosNoDeviceConfiguration = {
    type: 'ios.none';
  };

  export type IosSimulatorDeviceConfiguration = {
    type: 'ios.simulator';

    udid?: string;
    name?: string;
    deviceType?: string;
    os?: string;
  };

  export type AndroidAttachedDeviceConfiguration = {
    type: 'android.attached';
    adbName?: string;
  };

  export type AndroidEmulatorConfiguration = {
    type: 'android.emulator';
    avdName?: string;
    bootOptions?: EmulatorBootOptions;
  };

  export type EmulatorBootOptions = {
    headless: boolean;
    gpu: string;
  };

  export type SingleDeviceConfiguration =
    IosNoDeviceConfiguration |
    IosSimulatorDeviceConfiguration |
    AndroidAttachedDeviceConfiguration |
    AndroidEmulatorConfiguration ;

  export type StaticDevicePoolConfiguration = {
    type: 'pool.static';
    devices?: SingleDeviceConfiguration[];
  };

  export type DynamicDevicePoolConfiguration = {
    type: 'pool.dynamic';
    template?: PoolDeviceTemplate;
    onRequest: (event: DevicePoolRequestEvent) => Promise<DeviceConfiguration>;
    cleanup?: boolean;
  };

  export type DevicePoolConfiguration = {
    deviceLockFile?: string;
  } & (StaticDevicePoolConfiguration | DynamicDevicePoolConfiguration);

  export type SimulatorTemplate = {
    type: 'ios.simulator';
    name: string;
    deviceType: string;
    os?: string;
  };

  export type EmulatorTemplate = {
    type: 'android.emulator';
    name: string;
    avdTemplate: string;
    bootOptions?: EmulatorBootOptions;
  };

  export type PoolDeviceTemplate = SimulatorTemplate | EmulatorTemplate;

  export type DevicePoolRequestEvent = {
    readonly busyDevices: DeviceConfiguration[];
    readonly freeDevices: DeviceConfiguration[];
    readonly template?: PoolDeviceTemplate;

    createDevice(params: TODO): Promise<DeviceConfiguration>;
  };

  export type DeviceConfiguration =
    SingleDeviceConfiguration |
    DevicePoolConfiguration ;

  //</editor-fold>

  //<editor-fold desc="#region AppConfiguration">
  export type AppConfiguration = {
    binaryPath: string;
    testBinaryPath?: string;
    build?: string;
  };

  export type AppLaunchConfiguration = {
    bundleId: string;
    session: ClientConfiguration;
    delete?: boolean;
    newInstance?: boolean;
    launchArgs?: Record<string, string>;
    permissions?: Record<string, string>;
    languageAndLocale?: string;
    disableTouchIndicators?: boolean;
  } & PayloadParams;

  export type PayloadParams =
    { url?: string; sourceApp?: string; } |
    { userNotification?: string; } |
    { userActivity?: string; } ;
  //</editor-fold>

  //<editor-fold desc="#region ArtifactsConfiguration">

  export type ArtifactsConfiguration = {
    enabled: boolean;
    location: string;

    log: LogArtifactsConfiguration;
    screenshot: ScreenshotArtifactsConfiguration;
    video: VideoArtifactsConfiguration;
    profiling: ProfilingArtifactsConfiguration;
  };

  export type LogArtifactsConfiguration = {
    enabled: boolean;
    failingOnly: boolean;
    loglevel: 'debug' | 'warn';
    scope: 'per-test' | 'per-run';
    delay: {
      afterStart?: number;
      beforeEnd?: number;
    };

    constructPath: (name: string, testSummary?: TODO) => string;
  };

  export type ScreenshotArtifactsConfiguration = {
    enabled: boolean;
    failingOnly: boolean;
    automatic: boolean | {
      onBeforeEach: boolean;
      onAfterEach: boolean;
    };
  };

  export type VideoArtifactsConfiguration = {
    enabled: boolean;
    failingOnly: boolean;
    scope: 'per-test' | 'per-run';
    width: number;
    height: number;
    fps: number;
  };

  export type ProfilingArtifactsConfiguration = {
    enabled: boolean;
    failingOnly: boolean;

    record: {
      network: boolean;
      localhost: boolean;
      reactNativeEvents: boolean;
    };
  };

  //</editor-fold>

  export type DetoxBehaviorConfiguration = {
    init: {
      uninstallApp: boolean;
      installApp: boolean;
      launchApp: boolean;
    };
    cleanup: {
      shutdownDevice: boolean;
    };
  };

  export type MochaRunnerConfiguration = {
    type: 'mocha';
    config: string;
  };

  export type JestRunnerConfiguration = {
    type: 'jest';
    config: string;
    workers: number;
  };

  export type CLIConfiguration = {
    colors: boolean;
  };

  export type RunnerConfiguration = MochaRunnerConfiguration | JestRunnerConfiguration;

  export type JointConfiguration = {
    behavior: DetoxBehaviorConfiguration;
    app: AppConfiguration;
    device: DeviceConfiguration;
    artifacts: ArtifactsConfiguration;
    runner: RunnerConfiguration;
    cli: CLIConfiguration;
  };

  export type DetoxConfigSection = {
    apps: Nested<AppConfiguration>;
    devices: Nested<DeviceConfiguration>;
    server: Nested<ServerConfiguration>;
  };
}
