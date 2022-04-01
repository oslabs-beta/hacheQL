import React from 'react';
import Trend from 'react-trend';

export default function graph(props) {
  const { fetchTimes } = props;
  
  return (
    <div className='graph'>
        <h3 style={{color: 'gold'}}>Network Trend Graph</h3>
        <Trend
          className='Trend-Chart'
          smooth={true}
          autoDrawDuration={3000}
          autoDrawEasing="ease-out"
          data={fetchTimes}
          gradient={['yellow', 'red']}
          radius={10}
          strokeWidth={2}
          strokeLinecap={'round'}
        />
    </div>
  )
}
