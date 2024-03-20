import { useEffect, useState } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}

export function useGeoLocation() {
  const [location, setLocation] = useState<ILocation>();

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) return;

    geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      (err) => console.error(err)
    );
  }, []);

  return {
    curLocation: location,
  };
}
