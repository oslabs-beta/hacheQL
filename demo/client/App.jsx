import React from 'react';
import Headers from './Containers/Headers.jsx';
import Demo from './Containers/Demo';
import Team from './Containers/Team.jsx';
import Info from './Containers/Info';

function App() {

  return (
    <div className='App'>
      <Headers/>
      <Info/>
      <Demo/>
      <Team/>
    </div>
  );
}

export default App;
