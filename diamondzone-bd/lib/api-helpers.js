export function apiResponse(data, status = 200) {
    return Response.json(data, { status })
}

export function apiError(message, status = 400, code = 'ERROR') {
    return Response.json({ success: false, error: message, code }, { status })
}

// Aliases for compatibility
export const successResponse = apiResponse
export const errorResponse = apiError