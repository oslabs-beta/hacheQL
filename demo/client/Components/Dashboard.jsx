import React from 'react'

export default function Dashboard(props) {
  const { fetchTimes } = props;
  const uncachedTime = parseFloat(fetchTimes[2]).toFixed(2)
  const display = isNaN(uncachedTime)? '0.00 ms': uncachedTime + ' ms'
  const latestTime = parseFloat(fetchTimes[fetchTimes.length - 1]).toFixed(2);
  const avgFetchTime = parseFloat(fetchTimes.slice(2).reduce((a, b) => a + b, 0)/(fetchTimes.length-1)).toFixed(2);

  // console.log('average fetch time' + avgFetchTime)

  return (
    <div className='dashboard'>
      <h3>Metrics:</h3>
      <div>Uncached Time:
        <div>{isNaN(uncachedTime)? '0.00 ms': uncachedTime + ' ms'}</div>
      </div>
      <div>Latest Fetch Time:
        <div>{latestTime + ' ms'}</div>
      </div>
      <div>Average Fetch time:
        <div>{avgFetchTime + ' ms'}</div>
      </div>
    </div>
  )
}
