import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Create custom icons using Lucide icons
const createCustomIcon = (color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div style={{ color: color, filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.2))' }}>
      <MapPin size={36} fill="white" strokeWidth={1.5} />
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon bg-transparent border-none',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const fromIcon = createCustomIcon('#EF476F'); // brand-pink
const toIcon = createCustomIcon('#118AB2'); // brand-blue

function MapUpdater({ fromCoords, toCoords, routeGeometry }: { fromCoords: [number, number] | null, toCoords: [number, number] | null, routeGeometry?: [number, number][] | null }) {
  const map = useMap();

  useEffect(() => {
    if (routeGeometry && routeGeometry.length > 0) {
      const bounds = L.latLngBounds(routeGeometry);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fromCoords && toCoords) {
      const bounds = L.latLngBounds([fromCoords, toCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fromCoords) {
      map.setView(fromCoords, 13);
    } else if (toCoords) {
      map.setView(toCoords, 13);
    }
  }, [fromCoords, toCoords, routeGeometry, map]);

  return null;
}

interface InteractiveMapProps {
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  routeGeometry?: [number, number][] | null;
}

export default function InteractiveMap({ fromCoords, toCoords, routeGeometry }: InteractiveMapProps) {
  const defaultCenter: [number, number] = [41.8719, 12.5674]; // Italy center

  return (
    <div className="w-full h-full rounded-[32px] overflow-hidden shadow-inner border-4 border-white relative z-0 bg-gray-100">
      <MapContainer 
        center={fromCoords || defaultCenter} 
        zoom={fromCoords ? 13 : 5} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {fromCoords && (
          <Marker position={fromCoords} icon={fromIcon}>
            <Popup className="font-sans font-bold text-brand-pink">Partenza</Popup>
          </Marker>
        )}
        
        {toCoords && (
          <Marker position={toCoords} icon={toIcon}>
            <Popup className="font-sans font-bold text-brand-blue">Arrivo</Popup>
          </Marker>
        )}

        {routeGeometry && routeGeometry.length > 0 ? (
          <Polyline 
            positions={routeGeometry} 
            color="#118AB2" 
            weight={5} 
            opacity={0.8} 
          />
        ) : fromCoords && toCoords ? (
          <Polyline 
            positions={[fromCoords, toCoords]} 
            color="#073B4C" 
            weight={4} 
            dashArray="8, 8" 
            opacity={0.6} 
          />
        ) : null}

        <MapUpdater fromCoords={fromCoords} toCoords={toCoords} routeGeometry={routeGeometry} />
      </MapContainer>
    </div>
  );
}
