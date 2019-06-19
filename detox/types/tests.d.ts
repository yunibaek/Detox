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

declare module 'detox' {
  export type ServerConfiguration = {
    host: string;
    port: number;
  };

  export type ClientConfiguration = {
    serverUrl: string;
    clientId: string;
  };

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
    name?: string;
  };

  export type AndroidEmulatorConfiguration = {
    type: 'android.emulator';
    avdName?: string;
    name?: string;
  };

  export type DeviceConfiguration =
    IosNoDeviceConfiguration |
    IosSimulatorDeviceConfiguration |
    AndroidAttachedDeviceConfiguration |
    AndroidEmulatorConfiguration ;

  export type AppConfiguration = {
    binaryPath: string;
    testBinaryPath?: string;
    build?: string;
    session?: ClientConfiguration;
    launchArgs?: Record<string, string>;
  };

  export type LogArtifactConfiguration = {
    enabled: boolean;
    keepFailingOnly: boolean;
    scope: 'per-test';
  };

  export type ArtifactsConfiguration = {
    log: {
    };

  };

  type CommonRunnerConfiguration = {
    installApp: boolean;
    uninstallApp: boolean;
    shutdownDevice: boolean;
  };

  export type MochaRunnerConfiguration = CommonRunnerConfiguration & {
    type: 'mocha';
    config: string;
  };

  export type JestRunnerConfiguration = CommonRunnerConfiguration & {
    type: 'jest';
    config: string;
    workers: number;
  };

  export type CLIConfiguration = {
    colors: boolean;
  };

  export type RunnerConfiguration = MochaRunnerConfiguration | JestRunnerConfiguration;

  export type RawJointConfiguration =
    AppConfiguration & DeviceConfiguration & ArtifactsConfiguration;

  export type JointConfiguration = {
    app: AppConfiguration;
    device: DeviceConfiguration;
    artifacts: ArtifactsConfiguration;
    runner: RunnerConfiguration;
    cli: CLIConfiguration;
  };

  export type DetoxConfiguration = {
    binaryPath: string;
    build?: string;
  };

  export type DetoxConfig = {
    apps: Nested<AppConfiguration>;
    devices: Nested<DeviceConfiguration>;
    server: Nested<ServerConfiguration>;
  };
}
