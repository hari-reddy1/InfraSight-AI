import React, { useEffect } from 'react';
import L from 'leaflet';
import { formatCurrencyCr, getRiskBadge } from '../utils/riskEngine';
import { MapPin } from 'lucide-react';

const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY || "cb1_2zow_1_b01cd98ba6a845a80da1ebdd";

export default function ProjectMap({ projects, onSelectProject }) {
  useEffect(() => {
    // Check if map instance exists on element
    const container = L.DomUtil.get('project-map-container');
    if (container !== null && container._leaflet_id) {
      container._leaflet_id = null;
    }

    // Initialize Leaflet map centered on India
    const map = L.map('project-map-container', {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: true
    });

    // High-resolution CARTO Voyager Light Basemap with API key
    const tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_KEY}`;
    
    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create custom SVG markers based on risk level
    projects.forEach((proj) => {
      if (!proj.coordinates || proj.coordinates.length !== 2) return;

      let colorHex = '#16a34a'; // green
      if (proj.riskLevel === 'Critical') colorHex = '#dc2626'; // red
      else if (proj.riskLevel === 'High') colorHex = '#ea580c'; // orange
      else if (proj.riskLevel === 'Medium') colorHex = '#9333ea'; // purple

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${colorHex};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker(proj.coordinates, { icon: customIcon }).addTo(map);

      // Light-themed Popup HTML content
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; min-width: 240px; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">${proj.ministry}</span>
            <span style="
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 9999px;
              background-color: ${colorHex}15;
              color: ${colorHex};
              border: 1px solid ${colorHex}40;
            ">${proj.riskLevel} (${proj.riskScore}%)</span>
          </div>
          
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; line-height: 1.3;">
            ${proj.name}
          </h4>
          
          <div style="font-size: 11px; color: #334155; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px; background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <div>
              <span style="color: #64748b; display: block; font-size: 9px; font-weight: 600;">SANCTIONED</span>
              <strong style="color: #0f172a;">${formatCurrencyCr(proj.approvedCostCr)}</strong>
            </div>
            <div>
              <span style="color: #64748b; display: block; font-size: 9px; font-weight: 600;">PREDICTED FINAL</span>
              <strong style="color: #dc2626;">${formatCurrencyCr(proj.predictedCostOverrunCr)}</strong>
            </div>
            <div>
              <span style="color: #64748b; display: block; font-size: 9px; font-weight: 600;">EST. DELAY</span>
              <strong style="color: #ea580c;">+${proj.timeOverrunMonths} Mo</strong>
            </div>
            <div>
              <span style="color: #64748b; display: block; font-size: 9px; font-weight: 600;">PROGRESS</span>
              <strong style="color: #0f172a;">${proj.physicalProgressPct}%</strong>
            </div>
          </div>
          
          <button 
            id="popup-btn-${proj.id}" 
            style="
              width: 100%;
              background: #ea580c;
              color: white;
              border: none;
              padding: 7px 12px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              transition: background 0.2s;
            "
          >
            Deep-Dive Risk & SHAP Drivers
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${proj.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectProject(proj);
          };
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [projects, onSelectProject]);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-bold text-slate-900 font-outfit">
            Geo-Spatial Infrastructure Risk Map (India)
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
            CARTO Voyager Light Tiles
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-xs"></span>
            <span className="text-slate-700">Critical (&gt;90%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs"></span>
            <span className="text-slate-700">High (70-90%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-xs"></span>
            <span className="text-slate-700">Medium (45-70%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-xs"></span>
            <span className="text-slate-700">Low (&lt;45%)</span>
          </div>
        </div>
      </div>

      <div 
        id="project-map-container" 
        className="w-full h-[450px] rounded-lg overflow-hidden border border-slate-200 z-0"
      ></div>
    </div>
  );
}
