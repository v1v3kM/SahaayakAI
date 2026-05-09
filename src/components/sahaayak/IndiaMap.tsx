'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveCoordinates } from '@/lib/geo-coordinates'

interface IncidentMarker {
  id: string
  title: string
  area: string
  location: string
  severity: string
  type: string
  status: string
  latitude?: number | null
  longitude?: number | null
  aiFakeScore?: number
}

interface IndiaMapProps {
  incidents: IncidentMarker[]
  height?: string
  onLocate?: (lat: number, lng: number) => void
  showUserLocation?: boolean
  userLat?: number | null
  userLng?: number | null
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  moderate: '#eab308',
  low: '#22c55e',
}

const TYPE_EMOJIS: Record<string, string> = {
  flood: '🌊', earthquake: '🫨', cyclone: '🌀', tsunami: '🌊',
  landslide: '⛰️', fire: '🔥', building_collapse: '🏗️', waterlogging: '💧',
  heatwave: '🌡️', cold_wave: '🥶', drought: '🏜️', storm: '⛈️',
  industrial_accident: '🏭', traffic_disaster: '🚗', pandemic: '🦠', other: '⚠️',
}

export default function IndiaMap({ incidents, height = '420px', onLocate, showUserLocation, userLat, userLng }: IndiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [22.5, 78.9], // Center of India
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: false,
      })

      // Dark map tiles (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('© <a href="https://carto.com">CARTO</a> © <a href="https://osm.org">OSM</a>')
        .addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when incidents change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      // Clear old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      incidents.forEach(inc => {
        let lat = inc.latitude
        let lng = inc.longitude

        // Resolve coords from location if not stored
        if (!lat || !lng) {
          const coords = resolveCoordinates(inc.location, inc.area)
          if (coords) { lat = coords.lat; lng = coords.lng }
        }

        if (!lat || !lng) return

        const color = SEVERITY_COLORS[inc.severity] || '#eab308'
        const emoji = TYPE_EMOJIS[inc.type] || '⚠️'
        const isFake = (inc.aiFakeScore || 0) > 0.7
        const pulseSize = inc.severity === 'critical' ? 30 : inc.severity === 'high' ? 24 : 18

        // Create custom HTML marker with pulse animation
        const icon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:${pulseSize}px;height:${pulseSize}px;border-radius:50%;background:${color};opacity:0.25;animation:pulse-ring 2s ease-out infinite;"></div>
              <div style="position:absolute;width:${pulseSize * 0.6}px;height:${pulseSize * 0.6}px;border-radius:50%;background:${color};opacity:0.4;animation:pulse-ring 2s ease-out infinite 0.5s;"></div>
              <div style="width:28px;height:28px;border-radius:50%;background:${isFake ? '#1e1e2e' : color+'20'};border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:14px;backdrop-filter:blur(4px);box-shadow:0 0 12px ${color}40;position:relative;z-index:2;">${emoji}</div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

        const marker = L.marker([lat, lng], { icon }).addTo(map)

        // Rich popup
        const fakeScore = ((inc.aiFakeScore || 0) * 100).toFixed(0)
        const fakeColor = (inc.aiFakeScore || 0) > 0.7 ? '#ef4444' : (inc.aiFakeScore || 0) > 0.4 ? '#f97316' : '#22c55e'
        marker.bindPopup(`
          <div style="min-width:220px;font-family:system-ui;color:#e2e8f0;background:#0f172a;border-radius:12px;padding:14px;border:1px solid ${color}40;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:20px;">${emoji}</span>
              <div>
                <div style="font-size:13px;font-weight:700;color:${color};">${inc.title}</div>
                <div style="font-size:10px;color:#94a3b8;">${inc.location || inc.area}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
              <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid ${color};color:${color};">${inc.severity.toUpperCase()}</span>
              <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid ${fakeColor};color:${fakeColor};">AI Fake: ${fakeScore}%</span>
              <span style="padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid #64748b;color:#94a3b8;">${inc.status}</span>
            </div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">📍 ${lat!.toFixed(4)}, ${lng!.toFixed(4)}</div>
          </div>
        `, { className: 'dark-popup', maxWidth: 300 })

        markersRef.current.push(marker)
      })

      // Fit bounds if there are incidents
      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current)
        map.fitBounds(group.getBounds().pad(0.3), { maxZoom: 8 })
      }
    }

    updateMarkers()
  }, [incidents, mapReady])

  // User location marker
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !showUserLocation || !userLat || !userLng) return

    const addUserMarker = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      const icon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:#3b82f6;opacity:0.2;animation:pulse-ring 1.5s ease-out infinite;"></div>
            <div style="width:14px;height:14px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.5);position:relative;z-index:2;"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([userLat, userLng], { icon }).addTo(map)
      marker.bindPopup(`<div style="font-family:system-ui;color:#e2e8f0;background:#0f172a;border-radius:8px;padding:10px;border:1px solid #3b82f640;"><b style="color:#3b82f6;">📍 Your Location</b><br/><span style="font-size:11px;color:#94a3b8;">${userLat.toFixed(4)}, ${userLng.toFixed(4)}</span></div>`, { className: 'dark-popup' })
      markersRef.current.push(marker)
    }

    addUserMarker()
  }, [showUserLocation, userLat, userLng, mapReady])

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend overlay */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
        borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(148,163,184,0.15)',
      }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Severity</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(SEVERITY_COLORS).map(([key, color]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'capitalize' }}>{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident count badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 1000,
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
        borderRadius: 10, padding: '6px 12px', border: '1px solid rgba(148,163,184,0.15)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse-ring 2s infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>{incidents.length} Incidents</span>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .dark-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 12px !important;
        }
        .dark-popup .leaflet-popup-tip {
          background: #0f172a !important;
        }
        .dark-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-control-zoom a {
          background: rgba(15,23,42,0.85) !important;
          color: #e2e8f0 !important;
          border-color: rgba(148,163,184,0.15) !important;
          backdrop-filter: blur(8px);
        }
        .leaflet-control-zoom a:hover {
          background: rgba(30,41,59,0.9) !important;
        }
      `}</style>
    </div>
  )
}
