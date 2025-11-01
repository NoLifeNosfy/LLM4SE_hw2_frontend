## search locations
Get  /api/map/search_locations

Descrpition: Search for locations by query and region. Returns top 10 locations.

Parameters: query: str, region: str

Response: List[Location]

## upsert location
Post /api/locations/upsert

Description: Upsert a location. If location.name and location.address exists in database, update the data. Else create a new data.

Request body:  Location object.