import React from "react";
import { Database, Server, Cpu, CheckCircle2, X, RefreshCw } from "lucide-react";

interface AdminDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: {
    database_health: string;
    marine_observations: number;
    pfz_zones: number;
    active_alerts: number;
    total_queries_served: number;
    postgis_spatial_engine: string;
    last_update: string;
  };
}

export const AdminDataModal: React.FC<AdminDataModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const dataStats = stats || {
    database_health: "HEALTHY",
    marine_observations: 1248391,
    pfz_zones: 842,
    active_alerts: 4,
    total_queries_served: 2841,
    postgis_spatial_engine: "ACTIVE",
    last_update: "2 min ago",
  };

  const connectors = [
    { name: "MOSDAC / ISRO", dataset: "Oceansat-3 SST & Chlorophyll", status: "CONNECTED", records: "124,800" },
    { name: "INCOIS Marine", dataset: "PFZ Advisories & OSF Forecasts", status: "CONNECTED", records: "842" },
    { name: "Open-Meteo ECMWF", dataset: "High-Res Marine Wave & Wind", status: "CONNECTED", records: "52,100" },
    { name: "Copernicus / NOAA", dataset: "Subsurface Currents & Thermocline", status: "CONNECTED", records: "39,400" },
    { name: "VLIZ Boundaries", dataset: "IMBL & EEZ Spatial Polygons", status: "CONNECTED", records: "48" },
    { name: "PostGIS Spatial DB", dataset: "GiST 2D R-Tree Spatial Indexes", status: "CONNECTED", records: "15,300" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl rounded-2xl holo-panel border border-cyan-400/50 shadow-cyan-intense p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wider text-cyan-300 font-heading">
                SYSTEM TELEMETRY & DATA PANEL
              </h2>
              <p className="text-[10px] text-cyan-400/70 font-mono">
                PostgreSQL + PostGIS Spatial Engine Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2.5 font-mono text-center">
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400/70">DATABASE</div>
            <div className="text-emerald-400 font-bold text-xs mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dataStats.database_health}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400/70">OBSERVATIONS</div>
            <div className="text-slate-100 font-bold text-xs mt-1">
              {dataStats.marine_observations.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400/70">PFZ ZONES</div>
            <div className="text-slate-100 font-bold text-xs mt-1">
              {dataStats.pfz_zones}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400/70">ACTIVE ALERTS</div>
            <div className="text-amber-400 font-bold text-xs mt-1">
              {dataStats.active_alerts}
            </div>
          </div>
        </div>

        {/* Data Connectors Ingestion Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold tracking-wider text-cyan-300 font-heading">
            LIVE INGESTION CONNECTORS
          </div>

          <div className="rounded-xl border border-cyan-500/20 overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-cyan-950/60 text-[10px] text-cyan-400/80 border-b border-cyan-500/20">
                <tr>
                  <th className="p-2.5">SOURCE</th>
                  <th className="p-2.5">DATASET</th>
                  <th className="p-2.5">STATUS</th>
                  <th className="p-2.5 text-right">RECORDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10 bg-[#031126]/60 text-[11px]">
                {connectors.map((c, idx) => (
                  <tr key={idx} className="hover:bg-cyan-950/30">
                    <td className="p-2.5 font-bold text-cyan-200">{c.name}</td>
                    <td className="p-2.5 text-slate-300">{c.dataset}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] text-emerald-400">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-cyan-300">{c.records}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/60 pt-2 border-t border-cyan-500/20">
          <span>Spatial Engine: PostGIS 3.4 (EPSG:4326 WGS84)</span>
          <span>Last Ingestion Sync: {dataStats.last_update}</span>
        </div>
      </div>
    </div>
  );
};
