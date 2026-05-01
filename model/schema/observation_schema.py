from pydantic import BaseModel
from typing import Optional

class ObservationSchema(BaseModel):
    latitude: float
    longitude: float
    t2m: float
    t2m_max: float
    t2m_min: float
    rh2m: float
    prectotcorr: float
    ws2m: float
    allsky_sfc_sw_dwn: float
    soil_temp_0_7: Optional[float] = None
    soil_temp_7_28: Optional[float] = None
    soil_moisture_0_7: Optional[float] = None
    soil_moisture_7_28: Optional[float] = None


