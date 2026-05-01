from pydantic import BaseModel


class PredictionSchema(BaseModel):
    input_temperature: float
    input_humidity: float
    input_soil_moisture: float
    input_ph: float = None  # Toprak pH (ML için kritik)
    input_nitrogen: float = None  # Azot

    confidence_score: float  # Verimlilik skoru

   