import React from 'react'

export default function Scrollview(props) {
  const { queryResult } = props;

  //export this to css file

  return (
    <div className="scroll-view" style={{overflow: 'scroll', height: "25vh", backgroundColor: 'lightgray', width: '40rem', borderRadius: '5px', border: 'solid 1px black'}}>
        <code>{queryResult}</code>
    </div>
  )
}
