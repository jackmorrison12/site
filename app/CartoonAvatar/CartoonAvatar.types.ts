export type HotspotId =
  | 'headphones'
  | 'keyboard'
  | 'shirt'
  | 'cap'
  | 'pin'
  | 'parachute'
  | 'plane'
  | 'phone';

export const HOTSPOT_TO_AREAS: Record<HotspotId, string[]> = {
  headphones: ['music'],
  shirt: ['bbg'],
  cap: ['imperial'],
  parachute: ['skydiving'],
  plane: ['countries'],
  pin: ['emoji2'],
  keyboard: ['os'],
  phone: ['twt', 'gh', 'linkedin', 'insta', 'lastfm', 'spotify'],
};
