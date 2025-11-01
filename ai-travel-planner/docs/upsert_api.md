POST /api/locations/upsert
 
Summary: Create or update a location.

Description:
This endpoint allows for the creation of a new location or the update of an existing one.
It first attempts to find a location in the database using the provided 'name' and 'address'.
If a matching location is found, its details are updated with the provided data.
If no matching location is found, a new location entry is created.

Request Body:
- location_create: LocationCreate (application/json)
  A JSON object containing the details of the location to be created or updated.
  Properties:                                                                                                                                                                                      
    - name (str): The name of the location. Used for identification.
    - address (str, optional): The address of the location. Used for identification.
    - lng (float, optional): Longitude of the location.
    - lat (float, optional): Latitude of the location.
    - place_id (str, optional): Google Place ID or similar identifier.
    - type (str, optional): Type of location (e.g., "restaurant", "hotel").
    - metadata (JSON, optional): Additional metadata in JSON format.
                                                                                                                                                                                                   
Responses:                                                                                                                                                                                         
- 200 OK:
  LocationDO: The created or updated Location object.
  Content:
    application/json:
      schema:                                                                                                                                                                                      
        $ref: '#/components/schemas/LocationDO'                                                                                                                                                    
- 422 Unprocessable Entity:
  Validation Error: If the request body is invalid.