
import React from 'react';
import { ChartData } from '../types';

interface NorthIndianChartProps {
  data: ChartData;
  title: string;
}

const NorthIndianChart: React.FC<NorthIndianChartProps> = ({ data, title }) => {
  // Planet abbreviation mapping
  const planetAbbr: Record<string, string> = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
  };

  const getHouseData = (houseNum: number) => {
    return data.houses.find(h => h.house === houseNum);
  };

  const getPlanets = (houseNum: number) => {
    const hData = getHouseData(houseNum);
    if (!hData) return '';
    return hData.planets.map(p => planetAbbr[p] || p.substring(0, 2)).join(', ');
  };

  const getSign = (houseNum: number) => {
    const hData = getHouseData(houseNum);
    return hData ? hData.sign : '';
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/50 p-6 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-sm">
      <h3 className="text-xl font-cinzel text-amber-400 mb-4 text-center">{title}</h3>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-amber-500/40">
        {/* Main Framework SVG */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full text-amber-500/20 stroke-current fill-none" style={{ pointerEvents: 'none' }}>
          {/* Diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" strokeWidth="2" />
          <line x1="400" y1="0" x2="0" y2="400" strokeWidth="2" />
          {/* Internal Diamond */}
          <path d="M200 0 L400 200 L200 400 L0 200 Z" strokeWidth="2" />
        </svg>

        {/* House Content Overlays */}
        <div className="absolute inset-0">
          {/* House 1 (Top Diamond) */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center w-16">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(1)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(1)}</div>
          </div>
          {/* House 2 (Top Left Corner) */}
          <div className="absolute top-[6%] left-[28%] -translate-x-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(2)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(2)}</div>
          </div>
          {/* House 3 (Left Top Triangle) */}
          <div className="absolute top-[28%] left-[6%] -translate-y-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(3)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(3)}</div>
          </div>
          {/* House 4 (Left Diamond) */}
          <div className="absolute top-1/2 left-[12%] -translate-y-1/2 text-center w-16">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(4)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(4)}</div>
          </div>
          {/* House 5 (Left Bottom Triangle) */}
          <div className="absolute bottom-[28%] left-[6%] translate-y-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(5)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(5)}</div>
          </div>
          {/* House 6 (Bottom Left Corner) */}
          <div className="absolute bottom-[6%] left-[28%] -translate-x-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(6)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(6)}</div>
          </div>
          {/* House 7 (Bottom Diamond) */}
          <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 text-center w-16">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(7)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(7)}</div>
          </div>
          {/* House 8 (Bottom Right Corner) */}
          <div className="absolute bottom-[6%] right-[28%] translate-x-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(8)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(8)}</div>
          </div>
          {/* House 9 (Right Bottom Triangle) */}
          <div className="absolute bottom-[28%] right-[6%] translate-y-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(9)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(9)}</div>
          </div>
          {/* House 10 (Right Diamond) */}
          <div className="absolute top-1/2 right-[12%] -translate-y-1/2 text-center w-16">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(10)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(10)}</div>
          </div>
          {/* House 11 (Right Top Triangle) */}
          <div className="absolute top-[28%] right-[6%] -translate-y-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(11)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(11)}</div>
          </div>
          {/* House 12 (Top Right Corner) */}
          <div className="absolute top-[6%] right-[28%] translate-x-1/2 text-center w-12">
            <div className="text-[10px] text-amber-200/60 leading-none mb-1">{getSign(12)}</div>
            <div className="text-xs font-semibold leading-tight">{getPlanets(12)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NorthIndianChart;
