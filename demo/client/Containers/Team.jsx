import React from 'react'
import TeamMember from '../Components/TeamMember';
import { v4 as uuidv4 } from 'uuid';

//Container for team member components
export default function Team() {
  //for rendering components
  const teamMembers = [
    {
      name: 'Conor Chinitz',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C5603AQF-Saod3qc45g/profile-displayphoto-shrink_400_400/0/1516769630432?e=1654732800&v=beta&t=ftPVZ7zOpWSctP57CdQew0kwz3gqsnXaVPdPyXCFTRI', // Need your beautiful faces...
      bio: "Conor likes writing code that’s hard to write and easy to read. He also likes writing really good documentation. His favorite parts of working on HacheQL are writing automated tests with Jest and working with async/await in Node/Express. His favorite things when not working on HacheQL are playing board/card games, playing musical theater songs on the piano, and taking long hikes in the woods.",
      gitHub: 'https://github.com/conorchinitz',
      linkedin: 'https://www.linkedin.com/in/conorchinitz/'
    },
    {
      name: 'Joey Torsella',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C4E03AQGCg4c9x_y5mg/profile-displayphoto-shrink_400_400/0/1583352367275?e=1654732800&v=beta&t=kZTxIN6WDvhsKIVkeNVhgBqmh97AmtSudebiuCPbY0c',
      bio: "Joey is a software engineer who is driven to understand how systems of all kinds work. In the work he did on HacheQL, he especially enjoyed engineering middleware to function under a wide range of use conditions and thinking systematically about what those conditions might be. When not programming, he enjoys fitness and philosophy.",
      gitHub: 'https://github.com/neovimnovum',
      linkedin: 'https://www.linkedin.com/in/joseph-r-torsella/'
    },
    {
      name: 'Jason Chan',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C4E03AQEeSORi4PUutQ/profile-displayphoto-shrink_800_800/0/1649791963392?e=1655337600&v=beta&t=iJhKtUGlDHxUl1BWGwOTFgHsh3In4zA9glprBGQGah4',
      bio: "Jason is a software engineer based in NYC who is passionate about learning new technology and hopes to make a meaningful impact to society. Prior to his programming journey, he had over 5 years of work experience as an auditor working with clients in financial services to expand his understanding of their business. During his free time, he enjoys being active through partaking in Tonehouse workout classes, playing basketball, and spontaneous travels.",
      gitHub: 'https://github.com/JayC1765',
      linkedin: 'https://www.linkedin.com/in/jason-chan-cpa-106921bb/'
    },
    {
      name: 'Jason Lin',
      profilePicture: 'https://media-exp1.licdn.com/dms/image/C5603AQHu80pB8zgfXg/profile-displayphoto-shrink_400_400/0/1590692695492?e=1654732800&v=beta&t=fiOf92V5G0yWv5U8GhGPRewYPMjvJhO0Gk_KBgVYY3I',
      bio: "Jason Lin is a full-stack software engineer based in New York City with experience in React, GraphQL, Node.JS and Express. His current fascination is the implication of machine learning in web development. In his downtime, you can find Jason tending to his cats, practicing his knife skills in the kitchen or finding himself immerse in fantasy RPG's.",
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
      key={uuidv4()}
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
