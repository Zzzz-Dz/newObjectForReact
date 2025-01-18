import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page" className="flex flex-1 items-center flex-col">
        <h1>找不到该页面</h1>
        <p>请你访问一个正确的url</p>
        <p>
          <i>{error.statusText || error.data.message}</i>
        </p>
        <a href="/">返回首页</a>
      </div>
    )
  }
}
