class CityModel {
  constructor(id, name, regionId, observation) {
    this.id = id;
    this.name = name;
    this.regionId = regionId;
    this.observation = observation;
  }

  static fromJson(json) {
    return new CityModel(
      json.id,
      json.name,
      json.region_id,
      json.observation || "No observation data",
    );
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      region: this.region,
      observation: this.observation,
    };
  }
}

export default CityModel;
