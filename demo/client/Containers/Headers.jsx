import React from 'react';
import Logo from '../../images/Logo.png';

//router for different sections of landing page
export default function Headers() {

  return (
		<header style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<div id='logo-main-container'>
				<img id='logo_main' src={Logo} width={600} style={{margin:'20px'}}></img>
			</div>
			{/* <ul className='header-links'>
			 	<li>
          <a>INFO</a>
        </li>
        <li>
          <a>DEMO</a>
        </li>
        <li>
          <a>TEAM</a>
        </li>
        <li>
          <a href='https://github.com/oslabs-beta/hacheQL/' target='_blank'>
            GITHUB
          </a>
        </li>
      </ul> */}
		</header>
  )
}
