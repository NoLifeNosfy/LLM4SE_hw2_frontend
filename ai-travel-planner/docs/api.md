# API Documentation

This document provides details on the available API endpoints, how to authenticate, and the expected request/response formats.

## Base URL

The API is served from your application's base URL. In a local development environment, this is likely `http://localhost:8000`.

## Authentication

Most endpoints are protected and require a JWT (JSON Web Token) to be passed in the request headers.

1.  **Get a Token**: To get a token, the user must first register and then log in.
    *   `POST /auth/register`
    *   `POST /auth/login`
2.  **Send the Token**: Once you have the token, you must include it in the `Authorization` header for all protected requests.
    *   **Header**: `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## API Endpoints

### Authentication

#### `POST /auth/register`

*   **Description**: Registers a new user.
*   **Request Body**: `UserCreate`
    ```json
    {
      "email": "user@example.com",
      "password": "a_strong_password"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "message": "User registered successfully",
      "user_id": "user_uuid"
    }
    ```

#### `POST /auth/login`

*   **Description**: Logs in an existing user and returns a JWT.
*   **Request Body**: `UserCreate`
    ```json
    {
      "email": "user@example.com",
      "password": "a_strong_password"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "access_token": "your_jwt_token",
      "refresh_token": "your_refresh_token",
      "user": "user@example.com"
    }
    ```

#### `GET /auth/profile`

*   **Description**: Retrieves the profile of the currently authenticated user.
*   **Authentication**: Required.
*   **Success Response (200 OK)**: `User`
    ```json
    {
      "email": "user@example.com",
      "id": "user_uuid"
    }
    ```

---

### Trips

*Authentication required for all endpoints.*

#### `GET /api/trips`

*   **Description**: Retrieves all trips for the logged-in user.
*   **Success Response (200 OK)**: A list of `Trip` objects.

#### `POST /api/trips`

*   **Description**: Adds a new trip.
*   **Request Body**: `TripCreate`
*   **Success Response (201 Created)**: The newly created `Trip` object.

#### `GET /api/trips/{trip_id}`

*   **Description**: Retrieves a single trip by its ID.
*   **Success Response (200 OK)**: A single `Trip` object.

#### `PUT /api/trips/{trip_id}`

*   **Description**: Updates an existing trip.
*   **Request Body**: `TripCreate`
*   **Success Response (200 OK)**: The updated `Trip` object.

#### `DELETE /api/trips/{trip_id}`

*   **Description**: Deletes a trip.
*   **Success Response**: `204 No Content`.

---

### Events

*Authentication required for all endpoints.*

#### `GET /api/trips/{trip_id}/events`

*   **Description**: Retrieves all events for a specific trip.
*   **Success Response (200 OK)**: A list of `Event` objects.

#### `POST /api/trips/{trip_id}/events`

*   **Description**: Adds a new event to a trip.
*   **Request Body**: `EventCreate`
*   **Success Response (201 Created)**: The newly created `Event` object.

#### `GET /api/events/{event_id}`

*   **Description**: Retrieves a single event by its ID.
*   **Success Response (200 OK)**: A single `Event` object.

#### `PUT /api/events/{event_id}`

*   **Description**: Updates an event.
*   **Request Body**: `EventCreate`
*   **Success Response (200 OK)**: The updated `Event` object.

#### `DELETE /api/events/{event_id}`

*   **Description**: Deletes an event.
*   **Success Response**: `204 No Content`.

---

### Routes

*Authentication required for all endpoints.*

#### `GET /api/trips/{trip_id}/routes`

*   **Description**: Retrieves all routes for a specific trip.
*   **Success Response (200 OK)**: A list of `Route` objects.

#### `POST /api/trips/{trip_id}/routes`

*   **Description**: Adds a new route to a trip.
*   **Request Body**: `RouteCreate`
*   **Success Response (201 Created)**: The newly created `Route` object.

#### `GET /api/routes/{route_id}`

*   **Description**: Retrieves a single route by its ID.
*   **Success Response (200 OK)**: A single `Route` object.

#### `PUT /api/routes/{route_id}`

*   **Description**: Updates a route.
*   **Request Body**: `RouteCreate`
*   **Success Response (200 OK)**: The updated `Route` object.

#### `DELETE /api/routes/{route_id}`

*   **Description**: Deletes a route.
*   **Success Response**: `204 No Content`.

---

### Budget & Expenses

*Authentication required for all endpoints.*

#### `GET /api/trips/{trip_id}/expenses`

*   **Description**: Retrieves all expenses for a specific trip.
*   **Success Response (200 OK)**: A list of `Expense` objects.

#### `POST /api/expenses`

*   **Description**: Adds a new expense.
*   **Request Body**: `ExpenseCreate`
*   **Success Response (201 Created)**: The newly created `Expense` object.

#### `PUT /api/expenses/{expense_id}`

*   **Description**: Updates an expense.
*   **Request Body**: `ExpenseCreate`
*   **Success Response (200 OK)**: The updated `Expense` object.

#### `DELETE /api/expenses/{expense_id}`

*   **Description**: Deletes an expense.
*   **Success Response**: `204 No Content`.

---

### Locations

*No authentication required.*

#### `GET /api/locations`

*   **Description**: Searches for locations, optionally by name.
*   **Query Parameters**:
    *   `name` (string, optional): Filter locations by name.
*   **Success Response (200 OK)**: A list of `Location` objects.

#### `POST /api/locations`

*   **Description**: Creates a new location.
*   **Request Body**: `LocationCreate`
*   **Success Response (201 Created)**: The newly created `Location` object.

#### `GET /api/locations/{location_id}`

*   **Description**: Retrieves a single location by its ID.
*   **Success Response (200 OK)**: A single `Location` object.

#### `PUT /api/locations/{location_id}`

*   **Description**: Updates a location.
*   **Request Body**: `LocationCreate`
*   **Success Response (200 OK)**: The updated `Location` object.

#### `DELETE /api/locations/{location_id}`

*   **Description**: Deletes a location.
*   **Success Response**: `204 No Content`.

---

### Maps

*No authentication required.*

#### `GET /map/geocoding`

*   **Description**: Converts a string address into geographic coordinates.
*   **Query Parameters**:
    *   `address` (string): The address to search for.
*   **Success Response (200 OK)**: A result object from the map service.

#### `GET /map/region_search`

*   **Description**: Searches for points of interest within a specified region.
*   **Query Parameters**:
    *   `query` (string): What to search for.
    *   `region` (string): The city or region to search in.
    *   `type` (string): The type of search.
*   **Success Response (200 OK)**: A list of search results.

#### `GET /map/around_search`

*   **Description**: Searches for points of interest near a specific coordinate.
*   **Query Parameters**:
    *   `query` (string): What to search for.
    *   `lat` (float): Latitude.
    *   `lng` (float): Longitude.
    *   `type` (string): The type of search.
*   **Success Response (200 OK)**: A list of search results.

#### `GET /map/direction`

*   **Description**: Gets directions between two points.
*   **Query Parameters**:
    *   `mode` (string): Travel mode (e.g., "driving").
    *   `origin_lat`, `origin_lng` (float): Start coordinates.
    *   `dest_lat`, `dest_lng` (float): Destination coordinates.
*   **Success Response (200 OK)**: A result object containing the route.

---
## Data Models

### User
```json
{
    "email": "user@example.com",
    "id": "uuid",
    "preferences": {}
}
```

### UserCreate
```json
{
    "email": "user@example.com",
    "password": "a_strong_password"
}
```

### Trip
```json
{
    "title": "string",
    "start_date": "date",
    "end_date": "date",
    "total_budget": "float",
    "currency": "string",
    "metadata": {},
    "id": "uuid",
    "user_id": "uuid",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### TripCreate
```json
{
    "title": "string",
    "start_date": "date",
    "end_date": "date",
    "total_budget": "float",
    "currency": "string",
    "metadata": {}
}
```

### Event
```json
{
    "title": "string",
    "start_time": "time",
    "end_time": "time",
    "type": "string",
    "budget": "float",
    "details": {},
    "day_index": "integer",
    "location_id": "uuid",
    "id": "uuid",
    "trip_id": "uuid",
    "expense": "float",
    "metadata": {}
}
```

### EventCreate
```json
{
    "title": "string",
    "start_time": "time",
    "end_time": "time",
    "type": "string",
    "budget": "float",
    "details": {},
    "day_index": "integer",
    "location_id": "uuid"
}
```

### Route
```json
{
    "from_event_id": "uuid",
    "to_event_id": "uuid",
    "mode": "string",
    "distance": "integer",
    "duration": "integer",
    "budget": "float",
    "geometry": [
        {
            "lng": "float",
            "lat": "float"
        }
    ],

    "trip_id": "uuid"
}
```

### RouteCreate
```json
{
    "from_event_id": "uuid",
    "to_event_id": "uuid",
    "mode": "string",
    "distance": "integer",
    "duration": "integer",
    "budget": "float",
    "geometry": [
        {
            "lng": "float",
            "lat": "float"
        }
    ],
    "details": {}
}
```

### Expense
```json
{
    "amount": "float",
    "category": "string",
    "description": "string",
    "id": "uuid",
    "trip_id": "uuid",
    "event_id": "uuid",
    "created_at": "datetime"
}
```

### ExpenseCreate
```json
{
    "amount": "float",
    "category": "string",
    "description": "string",
    "trip_id": "uuid",
    "event_id": "uuid"
}
```

### Location
```json
{
    "name": "string",
    "address": "string",
    "geom": {
        "type": "Point",
        "coordinates": [
            "float",
            "float"
        ]
    },
    "place_id": "string",
    "type": "string",
    "metadata": {},
    "id": "uuid"
}
```

### LocationCreate
```json
{
    "name": "string",
    "address": "string",
    "geom": {
        "type": "Point",
        "coordinates": [
            "float",
            "float"
        ]
    },
    "place_id": "string",
    "type": "string",
    "metadata": {}
}
```
