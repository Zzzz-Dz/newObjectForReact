import React from 'react'
import {
  useRouteError,
  useNavigate,
  isRouteErrorResponse
} from 'react-router-dom'

export default function Error() {
  const error = useRouteError()
  const navigate = useNavigate()
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h2>
          {error.status} & {error.data.message}
        </h2>
        <button type="button" onClick={() => navigate('/')}>
          Return Home
        </button>
      </div>
    )
  }
}
