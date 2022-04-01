import React, { useState } from 'react';
import { hacheQL } from '../../../library/hacheql';
import Graph from '../Components/Graph';
import Dashboard from '../Components/Dashboard';
import Scrollview from '../Components/Scrollview';

function Demo() {   
	const [fetchTimes, setFetchTimes] = useState([0, 0]); 
  const [queryResult, setQueryResult] = useState('Query Result Here');
  const [queryString, setQueryString] = useState('Query String Here')


  let t0, t1;
  const getAll = () => {
    console.log('click');
    setQueryString(
      `{
        films {
          _id
          title
          episode_id
          director
          producer
          opening_crawl
        }
      }`
    )
    // initiate timer
    t0 = performance.now()
    hacheQL('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          films {
            _id
            title
            episode_id
            director
            producer
            opening_crawl
          }
        }`
      })
    })
      .then((res) => res.json())
      // .then((data) => console.log(data.data))
      .then((data) => {
        // timer ends after fetch returns data
        t1 = performance.now();
        const runTime = (t1 - t0)
        setFetchTimes([...fetchTimes, runTime]);
        setQueryResult(JSON.stringify(data));
      })
      .catch((err) => console.log('error on getAll in App.jsx: ', err));
  };
  
  const addOne = () => {
    setQueryString(
      `mutation {
        addFilm (_id: 99999, title: "A New Cache", episode_id: 10, opening_crawl: "I <3 CodeSmith", director: "M. Night Shyamalan", producer: "Will Sentance", release_date: "05 October 2011 14:48 UTC" ){
          _id
          title
          episode_id
          opening_crawl
          director
          producer
          release_date
        }
      }`
    );
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"query":"mutation addEpisodeEight($_id: BigInt!, $title: String!, $episode_id: Int!, $opening_crawl: String!, $director: String!, $producer: String!, $release_date: Date!){\n  addFilm(_id: $_id, title: $title, episode_id: $episode_id, opening_crawl: $opening_crawl, director: $director, producer: $producer, release_date: $release_date) {\n    _id\n    title\n    episode_id\n    director\n    producer\n    opening_crawl\n    release_date\n  }\n}","variables":{"_id":"8","title":"The Last Query","episode_id":8,"opening_crawl":"Help arrives to our graphql heroes: beset by evil on all sides, they fight through the difficulty and triumph over the evil Meta empire and its overlord, Darth Zucc.","director":"JJ Abrams","producer":"JJ Abrams","release_date":"05 October 2011 14:48 UTC"},"operationName":"addEpisodeEight"})
      })
      .then((res) => res.json())
      .then((data) => {
        // timer ends after fetch returns data
        setQueryResult(JSON.stringify(data));
      })
      .catch((err) => console.log('error on addOne in App.jsx: ', err));
  }

  return (
		<div>
			<div className='demo'>
				<div className='demo-display'>
					<div>
						<Scrollview queryResult={queryString}/>
						<Scrollview queryResult={queryResult}/>
					</div>
					<div>
						<Graph fetchTimes={fetchTimes} />
						<Dashboard fetchTimes={fetchTimes}/>
					</div>
				</div>
			</div>
			<div className='query-buttons'>
				<button className='get-button' onClick={getAll}>Run Query</button>
				<button className='mutation-button' onClick={addOne}>Run Mutation</button>
			</div>
		</div>
  )
}

export default Demo