
export interface LocationData {
  lat: number;
  lng: number;
}

export const getUserLocation = (): Promise<LocationData | null> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          resolve(null);
        }
      );
    } else {
      resolve(null);
    }
  });
};
