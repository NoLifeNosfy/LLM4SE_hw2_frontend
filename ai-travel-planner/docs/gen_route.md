# generate route
url: /api/trips/{trip_id}/gen_route
path parameters: trip_id:UUID, start_id: UUID, end_id: UUID, mode: str
returns: a Route object.

tips：We support 4 modes: ["driving", "riding", "walking", "transit"], front end should notice user or ask the user to choose the mode.