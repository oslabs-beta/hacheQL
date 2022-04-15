import React, { useState } from 'react';
import hacheQL from 'hacheql';
import Graph from '../Components/Graph';
import Dashboard from '../Components/Dashboard';
import Scrollview from '../Components/Scrollview';

function Demo() {   
	const [fetchTimes, setFetchTimes] = useState([0, 0]); 
  const [queryResult, setQueryResult] = useState('Query Result Here');
  const [queryString, setQueryString] = useState('Query String Here')

  // GraphQL query types
  const querySelect = {
    films:  
    `{
      films {
        _id
        title
        episode_id
        director
        producer
        opening_crawl
      }
    }`,
    planets: 
    `{
      planets {
        _id
        name
        rotation_period
        orbital_period
        diameter
        climate
        gravity
        terrain
        surface_water
        population
      }
    }`,
    species: 
    `{
      species {
        _id
        name
        classification
        average_height
        average_lifespan
        hair_colors
        skin_colors
        eye_colors
        language
        homeworld_id
      }
    }`,
    people:
    `{
      people {
        _id
        name
        mass
        skin_color
        eye_color
        birth_year
        gender
        species_id
        homeworld_id
      }
    }`,
    vessels:
    `{
      vessels {
        _id
        name
        manufacturer
        model
        vessel_type
        vessel_class
        cost_in_credits
        length
        max_atmosphering_speed
        crew
        passengers
        cargo_capacity
        consumables
      }
    }`
  }

  let t0, t1;
  const runQuery = () => {
    console.log('click');
    // initiate timer
    t0 = performance.now()
    hacheQL('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryString
      })
    })
      .then((res) => res.json())
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
      `mutation addEpisodeEight($_id: BigInt!, $title: String!, $episode_id: Int!, $opening_crawl: String!, $director: String!, $producer: String!, $release_date: Date!){\n  addFilm(_id: $_id, title: $title, episode_id: $episode_id, opening_crawl: $opening_crawl, director: $director, producer: $producer, release_date: $release_date) {\n    _id\n    title\n    episode_id\n    director\n    producer\n    opening_crawl\n    release_date\n  }\n}","variables":{"_id":"8","title":"The Last Jedi","episode_id":8,"opening_crawl":"The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Snoke now deploys his merciles legions to seize military control of the galaxy. Only General Leia Organa's band of RESISTANCE fighters stand against the rising tyranny, certain that Jedi Master Luke Skywalker will return and restore a spark of hope to the fight. But the Resistance has been exposed. As the First Order speeds toward the rebel base, the brave heroes mount a desperate escape....","director":"JJ Abrams","producer":"JJ Abrams","release_date":"05 October 2011 14:48 UTC"},"operationName":"addEpisodeEight`
    );
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"query":"mutation addEpisodeEight($_id: BigInt!, $title: String!, $episode_id: Int!, $opening_crawl: String!, $director: String!, $producer: String!, $release_date: Date!){\n  addFilm(_id: $_id, title: $title, episode_id: $episode_id, opening_crawl: $opening_crawl, director: $director, producer: $producer, release_date: $release_date) {\n    _id\n    title\n    episode_id\n    director\n    producer\n    opening_crawl\n    release_date\n  }\n}","variables":{"_id":"8","title":"The Last Jedi","episode_id":8,"opening_crawl":"The FIRST ORDER reigns. Having decimated the peaceful Republic, Supreme Leader Snoke now deploys his merciles legions to seize military control of the galaxy. Only General Leia Organa's band of RESISTANCE fighters stand against the rising tyranny, certain that Jedi Master Luke Skywalker will return and restore a spark of hope to the fight. But the Resistance has been exposed. As the First Order speeds toward the rebel base, the brave heroes mount a desperate escape....","director":"JJ Abrams","producer":"JJ Abrams","release_date":"05 October 2011 14:48 UTC"},"operationName":"addEpisodeEight"})
      })
      .then((res) => res.json())
      .then((data) => {
        // timer ends after fetch returns data
        setQueryResult(JSON.stringify(data));
      })
      .catch((err) => console.log('error on addOne in App.jsx: ', err));
  }

  const handleChange = (event) => {
    console.log(event.target.value)
    setQueryString(event.target.value);
    setFetchTimes([0, 0])
  }

  return (
		<div className='demo-container'>
      <h2>Try out our Demo</h2>
			<div className='demo'>
      <ul className='demo-instructions'>
        <li>Select a type of query and run the query</li>
        <li>Note the performance improvement on subsequent requests</li>
        <li>Test out a simple mutation query, it passes through unaffected</li>
      </ul>
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
          <select className='dropdown' value={queryString} onChange={handleChange}>
            <option value={'Query String Here'}>None Selected</option>
            <option value={querySelect.films}>Query for films</option>
            <option value={querySelect.planets}>Query for planets</option>
            <option value={querySelect.species}>Query for species</option>
            <option value={querySelect.vessels}>Query for vessels</option>
          </select>
				<button className='get-button' onClick={runQuery}>Run Query</button>
				<button className='mutation-button' onClick={addOne}>Run Mutation</button>
			</div>
		</div>
  )
}

export default Demo
