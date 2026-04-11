
export interface AudioNotificationOptions {
  volume?: number;
  enabled?: boolean;
}

export interface SoundController {
  stop: () => void;
}
