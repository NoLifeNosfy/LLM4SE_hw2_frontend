# AI Agent Streaming API Documentation

This document provides instructions for frontend developers on how to interact with the AI Agent's streaming API endpoint.

## Endpoint

- **URL**: `/api/agent/stream`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Authentication

This endpoint uses the same JWT-based authentication as the rest of the application. The client must include a valid JWT in the `Authorization` header of the request.

**Example Header**:
```
Authorization: Bearer <your_jwt_token>
```

## Request Body

The request body should be a JSON object containing the user's natural language input and the optional current context (e.g., the ID of the trip the user is currently viewing).

**Structure**:
```json
{
  "user_input": "Add a visit to the Eiffel Tower tomorrow morning.",
  "trip_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "event_id": null
}
```

- `user_input` (string, required): The text query from the user.
- `trip_id` (string, optional): The UUID of the trip the user is currently interacting with. This provides context for the AI.
- `event_id` (string, optional): The UUID of the specific event the user is interacting with.

## Response

The server responds with a `text/event-stream`, which is a stream of Server-Sent Events (SSE). The connection will remain open as the AI agent processes the request, sending status updates periodically. The stream closes when the agent has finished or an error occurs.

Each event sent by the server has the following format:

```
data: {"type": "event_type", "data": {...}}

```

The value of the `data` field is always a JSON string. The frontend client needs to parse this string to get the event object.

--- 

## Event Stream Details

The following are the different types of events (`type`) that the server can send. The frontend should handle these different event types to provide a rich, real-time user experience.

### 1. `intent`
- **Description**: Sent once at the beginning of the process, indicating the AI's initial understanding of the user's request category.
- **Payload (`data`)**:
  ```json
  {
    "category": "trip",
    "function_count": 5
  }
  ```

### 2. `status`
- **Description**: A general status update, typically used to signal the start of a major, long-running process.
- **Payload (`data`)**:
  ```json
  {
    "message": "Starting full trip generation..."
  }
  ```

### 3. `progress`
- **Description**: A granular progress update sent during the multi-step trip planning process (`plan_from_nl`).
- **Payload (`data`)**:
  ```json
  {
    "step": "planning_city", // The specific internal step being executed
    "message": "Planning trip for Paris..."
  }
  ```

### 4. `function_call`
- **Description**: Sent just before the AI decides to execute a specific tool (a function call).
- **Payload (`data`)**:
  ```json
  {
    "name": "search_locations_baidu",
    "args": { "query": "Eiffel Tower", "region": "Paris" }
  }
  ```

### 5. `function_result`
- **Description**: Sent after a function call has been executed, containing the result.
- **Payload (`data`)**:
  ```json
  {
    "name": "search_locations_baidu",
    "result": [ { "name": "Eiffel Tower", "address": "..." } ]
  }
  ```

### 6. `result`
- **Description**: The final, user-facing message from the AI. This can be the summary of a function call's result or the direct answer to a query. Upon receiving this, the stream is usually about to close.
- **Payload (`data`)**:
  ```json
  {
    "message": "I have found the Eiffel Tower for you. It is located at..."
  }
  ```

### 7. `error`
- **Description**: Sent when a recoverable error occurs during a specific step (e.g., failing to find a location for one event). The process will continue, but this allows the UI to show a minor error.
- **Payload (`data`)**:
  ```json
  {
    "step": "searching_location",
    "message": "Failed to process location for 'Louvre Museum'."
  }
  ```

--- 



## Event Lifecycle

A typical successful interaction for a full trip plan would look like this:

1.  Client `POST`s to `/api/agent/stream`.
2.  Server sends `{"type": "intent", ...}`.
3.  Server sends `{"type": "status", "message": "Starting full trip generation..."}`.
4.  Server sends a series of `{"type": "progress", ...}` events as it plans the trip.
5.  Server sends `{"type": "result", "message": "Trip and details generated successfully."}`.
6.  The stream closes.
