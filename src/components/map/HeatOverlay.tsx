import React from 'react';
import { Circle } from 'react-native-maps';
import type { DistrictGeoData, DistrictEpiData } from '../../data/mapData';

interface HeatOverlayProps {
  district: DistrictGeoData;
  epiData: DistrictEpiData;
}

function getRiskColors(risk: string): { fill: string; stroke: string } {
  switch (risk) {
    case 'alto':
      return { fill: 'rgba(220, 38, 38, 0.18)', stroke: 'rgba(220, 38, 38, 0.7)' };
    case 'medio':
      return { fill: 'rgba(217, 119, 6, 0.15)', stroke: 'rgba(217, 119, 6, 0.6)' };
    default:
      return { fill: 'rgba(22, 163, 74, 0.12)', stroke: 'rgba(22, 163, 74, 0.5)' };
  }
}

export function HeatOverlay({ district, epiData }: HeatOverlayProps) {
  const { fill, stroke } = getRiskColors(epiData.risk);
  const radiusMeters = district.radiusKm * 1000;

  return (
    <>
      {/* Outer glow circle */}
      <Circle
        center={{ latitude: district.latitude, longitude: district.longitude }}
        radius={radiusMeters * 1.4}
        fillColor={fill.replace('0.18', '0.06').replace('0.15', '0.05').replace('0.12', '0.04')}
        strokeColor="transparent"
        strokeWidth={0}
      />
      {/* Main heat zone */}
      <Circle
        center={{ latitude: district.latitude, longitude: district.longitude }}
        radius={radiusMeters}
        fillColor={fill}
        strokeColor={stroke}
        strokeWidth={1.5}
        lineDashPattern={epiData.risk === 'alto' ? undefined : [6, 3]}
      />
    </>
  );
}
