// model/ObservationModel.js
class ObservationModel {
  constructor(data = {}) {
    this.city_id            = data.city_id            || "";
    this.region_id          = data.region_id          || "";
    this.crop_id            = data.crop_id            || "";
    this.year               = data.year               || 2026;
    this.latitude           = data.latitude           || "";
    this.longitude          = data.longitude          || "";
    // Weather
    this.t2m                = data.t2m                || "";
    this.t2m_max            = data.t2m_max            || "";
    this.t2m_min            = data.t2m_min            || "";
    this.rh2m               = data.rh2m               || "";
    this.ws2m               = data.ws2m               || "";
    this.prectotcorr        = data.prectotcorr        || "";
    this.allsky_sfc_sw_dwn  = data.allsky_sfc_sw_dwn  || "";
    // Soil
    this.soil_temp_0_7      = data.soil_temp_0_7      || "";
    this.soil_temp_7_28     = data.soil_temp_7_28     || "";
    this.soil_moisture_0_7  = data.soil_moisture_0_7  || "";
    this.soil_moisture_7_28 = data.soil_moisture_7_28 || "";
  }

  /** Build from a backend JSON response object */
  static fromJson(json) {
    return new ObservationModel({
      city_id:           json.city_id,
      region_id:         json.region_id,
      crop_id:           json.crop_id,
      year:              json.year,
      latitude:          json.latitude,
      longitude:         json.longitude,
      t2m:               json.t2m,
      t2m_max:           json.t2m_max,
      t2m_min:           json.t2m_min,
      rh2m:              json.rh2m,
      ws2m:              json.ws2m,
      prectotcorr:       json.prectotcorr,
      allsky_sfc_sw_dwn: json.allsky_sfc_sw_dwn,
      soil_temp_0_7:     json.soil_temp_0_7,
      soil_temp_7_28:    json.soil_temp_7_28,
      soil_moisture_0_7: json.soil_moisture_0_7,
      soil_moisture_7_28:json.soil_moisture_7_28,
    });
  }

  /** Convert to the flat JSON payload the backend entity expects */
  static toApiPayload(model) {
    return {
      city_id:           parseInt(model.city_id)            || 0,
      region_id:         parseInt(model.region_id)          || 0,
      crop_id:           parseInt(model.crop_id)            || 0,
      year:              parseInt(model.year)                || 0,
      latitude:          parseFloat(model.latitude)         || 0.0,
      longitude:         parseFloat(model.longitude)        || 0.0,
      t2m:               parseFloat(model.t2m)              || 0.0,
      t2m_max:           parseFloat(model.t2m_max)          || 0.0,
      t2m_min:           parseFloat(model.t2m_min)          || 0.0,
      rh2m:              parseFloat(model.rh2m)             || 0.0,
      ws2m:              parseFloat(model.ws2m)             || 0.0,
      prectotcorr:       parseFloat(model.prectotcorr)      || 0.0,
      allsky_sfc_sw_dwn: parseFloat(model.allsky_sfc_sw_dwn)|| 0.0,
      soil_temp_0_7:     parseFloat(model.soil_temp_0_7)    || 0.0,
      soil_temp_7_28:    parseFloat(model.soil_temp_7_28)   || 0.0,
      soil_moisture_0_7: parseFloat(model.soil_moisture_0_7)|| 0.0,
      soil_moisture_7_28:parseFloat(model.soil_moisture_7_28)||0.0,
    };
  }
}

export default ObservationModel;
