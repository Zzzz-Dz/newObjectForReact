import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AiRoot() {
  return (
    <>
      <div className="grid grid-flow-col h-screen">
        <div className="grid grid-cols-[20%,80%] w-full h-full">
          {/*左边一块*/}
          <nav className="h-full w-full flex flex-col border-r border-gray-300 bg-white ">
            <div className="flex flex-1">
              {/* left */}
              <div className="flex flex-col items-center border-r border-gray-300 w-14 relative">
                {/* 网页左上角的图标 */}
                <div className="flex items-center justify-center h-14 border-b border-gray-300 w-full">
                  <a href="/">123</a>
                </div>

                {/* 用来定制总路由 */}
                <div className="my-2 space-y-1">123</div>
                <a
                  href={'/components/userLogin'}
                  className="absolute bottom-10"
                >
                  123
                </a>
              </div>
              {/* right */}
              {/* 路由右侧的子导航 */}
              <div className="flex-1">
                <div className="h-14 p-3 border-b border-gray-300 text-gray-700">
                  123
                </div>
                {/* 指向更细节的组件 */}
                <div className="p-2 space-y-2">123</div>
              </div>
            </div>
          </nav>

          {/*右边一块*/}
          <div className="flex">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}
