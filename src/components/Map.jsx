/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useURLPosition } from "../hooks/useURLPosition";

function Map() {
  // this would return a function which can then be used to move to any url
  // 🔴 this is called programmatic navigation, i.e navigation in an imperative way rather than in a declartive way like Navlink

  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  // getting the lat and lng values from the globally available url
  // const [searchParams] = useSearchParams();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useURLPosition();

  // const mapLat = searchParams.get("lat"); // this needs to match the "lat" in the url
  // const mapLng = searchParams.get("lng");

  // we need to synchronise the mapPosition and [mapLat,mapLng] so that after going to a position when the user returns to the city list, the map remembers the previous position and doesnt go back to its deafult state
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  // now we have to synchronise the geolocation received from the user to the mapPosition
  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]} // this position requires an array of latitute and longitude
            key={city.id}
          >
            <Popup>
              {/* this popup message appears when we click the marker */}
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap(); // this is used to get the current instance of the map that is currently being displayed
  map.setView(position);
  return null;
}

// creating a custom component to move to the form on clicking the map
function DetectClick() {
  const navigate = useNavigate();

  // provided by react-leaflet library
  useMapEvents({
    click: (e) => {
      // console.log(e);
      // this event e would contain all the details of the point clicked on the map
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
    // we define an event in this useMapEvents hook and specify a callback function to perform the action
  });
}

export default Map;
