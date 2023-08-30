import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capacitor.background',
  appName: 'backgroundApp',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    BackgroundRunner: {
      label: 'com.capacitor.background.check',
      src: 'runners/runner.js',
      event: 'checkIn',
      repeat: true,
      interval: 1,
      autoStart: true,
    },
  },
};

export default config;
