import React from 'react'
import TeamMember from '../Components/TeamMember';

//Container for team member components
export default function Team() {
  //for rendering components
  const teamMembers = [
    {
      name: 'Conor Chinitz',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C5603AQF-Saod3qc45g/profile-displayphoto-shrink_400_400/0/1516769630432?e=1654732800&v=beta&t=ftPVZ7zOpWSctP57CdQew0kwz3gqsnXaVPdPyXCFTRI', // Need your beautiful faces...
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum non consectetur a erat. Elit at imperdiet dui accumsan sit amet nulla facilisi morbi.",
      gitHub: 'https://github.com/conorchinitz',
      linkedin: 'https://www.linkedin.com/in/conorchinitz/'
    },
    {
      name: 'Joey Torsella',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C4E03AQGCg4c9x_y5mg/profile-displayphoto-shrink_400_400/0/1583352367275?e=1654732800&v=beta&t=kZTxIN6WDvhsKIVkeNVhgBqmh97AmtSudebiuCPbY0c',
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum non consectetur a erat. Elit at imperdiet dui accumsan sit amet nulla facilisi morbi.",
      gitHub: 'https://github.com/neovimnovum',
      linkedin: 'https://www.linkedin.com/in/joseph-r-torsella/'
    },
    {
      name: 'Jason Chan',
      profilePicture: 'https://ca.slack-edge.com/T02QNTJKVFB-U02UVTP3J9X-7743c3a91a0a-512',
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum non consectetur a erat. Elit at imperdiet dui accumsan sit amet nulla facilisi morbi.",
      gitHub: 'https://github.com/JayC1765',
      linkedin: 'https://www.linkedin.com/in/jason-chan-cpa-106921bb/'
    },
    {
      name: 'Jason Lin',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C5603AQHu80pB8zgfXg/profile-displayphoto-shrink_400_400/0/1590692695492?e=1654732800&v=beta&t=fiOf92V5G0yWv5U8GhGPRewYPMjvJhO0Gk_KBgVYY3I',
      bio: "Jason Lin is a full-stack software engineer based in New York City with experience in React, GraphQL, Node.JS and Express. His current fascination is the implication of machine learning in web development. When he is not attempting to usher in an age of AI overlords, you can find him tending to his cats, practicing his knife skills in the kitchen or finding himself immerse in fantasy RPG's.",
      gitHub: 'https://github.com/jvenlin',
      linkedin: 'https://www.linkedin.com/in/jplin/'
    },
  ];

  const teamMap = teamMembers.map(member => {
    return <TeamMember
      name={member.name}
      profilePicture={member.profilePicture}
      bio={member.bio}
      gitHub={member.gitHub}
      linkedIn={member.linkedin}
    />
  });
  return (
    <div className='team-container'>
      <h2>Meet The Team!</h2>
      <div className='team'>
        {teamMap} 
      </div>
    </div>
  )
}
