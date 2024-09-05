import { useEffect, useState } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}

export function useGeoLocation() {
  const [location, setLocation] = useState<ILocation>();

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      (err) => {
        console.error(err);
        setLocation({
          latitude: 37.566765678409546,
          longitude: 126.97887724160043,
        });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return {
    curLocation: location,
  };
}
