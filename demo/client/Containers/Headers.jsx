import React from 'react';
import Logo from '../../images/Logo.png';

//router for different sections of landing page
export default function Headers() {

  return (
		<header style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
			<div id='logo-main-container'>
				<img id='logo_main' src={Logo} style={{margin:'auto', width: '600px'}}></img>
			</div>
		</header>
  )
}
