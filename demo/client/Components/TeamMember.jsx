import React from 'react';
import gitHubLogo from '../../images/GitHubLogo.png';
import linkedInLogo from '../../images/LinkedInLogo.png';

export default function TeamMember(props) {
  const { name, profilePicture, bio, gitHub, linkedIn } = props;
  return (
    <div className='profile'>
      <img className='profile-pic' src={profilePicture}></img>
      <p style={{textAlign: 'center'}}>{name}</p>
      <p>{bio}</p>
      <div className='social-icons'>
        <a href={gitHub} target="_blank">
          <img className='social-logo' src={gitHubLogo}></img>
        </a>
        <a href={linkedIn} target="_blank">
          <img className='social-logo' src={linkedInLogo}></img>
        </a>
      </div>
    </div>
  )
}
