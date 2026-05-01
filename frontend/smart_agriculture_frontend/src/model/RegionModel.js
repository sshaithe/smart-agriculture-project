class RegionModel{
    constructor(id, name, country, cities, observation) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.cities = cities;
        this.observation = observation;
    }

    static fromJson(json) {
        return new RegionModel(
            json.id,
            json.name,
            json.country,
            json.cities,
            json.observation
        );
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            country: this.country,
            cities: this.cities,
            observation: this.observation
    
        };
    }
}

export default RegionModel;