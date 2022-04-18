import React from 'react';
import gitHubLogo from '../../images/GitHubLogo.png';
import linkedInLogo from '../../images/LinkedInLogo.png';

export default function TeamMember(props) {
  const {
    name, profilePicture, bio, gitHub, linkedIn,
  } = props;
  return (
    <div className="profile">
      <img className="profile-pic" src={profilePicture} />
      <p className="profile-name" style={{ textAlign: 'center' }}>{name}</p>
      <p>{bio}</p>
      <div className="social-icons">
        <a href={gitHub} target="_blank" rel="noreferrer">
          <img className="social-logo" src={gitHubLogo} />
        </a>
        <a href={linkedIn} target="_blank" rel="noreferrer">
          <img className="social-logo" src={linkedInLogo} />
        </a>
      </div>
    </div>
  );
}
