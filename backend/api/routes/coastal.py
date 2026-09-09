from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any

from ...services.coastal_updater import (
    get_cached_coastal_snapshot,
    update_all_coastal_stations,
    COASTAL_STATIONS
)

router = APIRouter(prefix='/api/coastal', tags=['Coastal Telemetry'])

@router.get('/live-summary')
def get_live_coastal_summary() -> Dict[str, Any]:
    return get_cached_coastal_snapshot()

@router.get('/station/{station_id}')
def get_coastal_station(station_id: str) -> Dict[str, Any]:
    snap = get_cached_coastal_snapshot()
    stations = snap.get('stations', [])
    match = next((s for s in stations if s.get('id') == station_id.lower()), None)
    if not match:
        raise HTTPException(status_code=404, detail=f'Station {station_id} not found.')
    return {
        'station': match,
        'last_updated_ist': snap.get('last_updated_ist'),
        'is_live': snap.get('is_live', False)
    }

@router.post('/refresh')
def trigger_coastal_refresh(background_tasks: BackgroundTasks) -> Dict[str, str]:
    background_tasks.add_task(update_all_coastal_stations)
    return {'status': 'QUEUED', 'message': 'Coastal telemetry update queued.'}