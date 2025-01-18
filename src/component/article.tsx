import React from 'react'

function Article() {
  return (
    <div className="grid grid-flow-row grid-cols-2 bg-blue-100">
      <div className="grid grid-flow-row  bg-white">
        <div>123</div>
        <div>456</div>
        <div>456</div>
        <div>789</div>
      </div>
      <div className=" bg-red-100">456</div>
    </div>
  )
}

export default Article
