import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import TeamMember from '../Components/TeamMember';
import conor from '../../images/Conor.jpeg';
import jasonC from '../../images/JasonC.jpeg';
import jasonL from '../../images/JasonL.jpeg';
import joey from '../../images/Joey.jpeg';

// Container for team member components
export default function Team() {
  // for rendering components
  const teamMembers = [
    {
      name: 'Conor Chinitz',
      profilePicture: conor,
      bio: 'Conor likes writing code that’s hard to write and easy to read. He also likes writing really good documentation. His favorite parts of working on HacheQL are writing automated tests with Jest and working with async/await in Node/Express. His favorite things when not working on HacheQL are playing board/card games, playing musical theater songs on the piano, and taking long hikes in the woods.',
      gitHub: 'https://github.com/conorchinitz',
      linkedin: 'https://www.linkedin.com/in/conorchinitz/',
    },
    {
      name: 'Joey Torsella',
      profilePicture: joey,
      bio: 'Joey is a software engineer who is driven to understand how systems of all kinds work. In the work he did on HacheQL, he especially enjoyed engineering middleware to function under a wide range of use conditions and thinking systematically about what those conditions might be. When not programming, he enjoys fitness and philosophy.',
      gitHub: 'https://github.com/neovimnovum',
      linkedin: 'https://www.linkedin.com/in/joseph-r-torsella/',
    },
    {
      name: 'Jason Chan',
      profilePicture: jasonC,
      bio: 'Jason is a software engineer based in NYC who is passionate about learning new technology and hopes to make a meaningful impact to society. Prior to his programming journey, he had over 5 years of work experience as an auditor working with clients in financial services to expand his understanding of their business. During his free time, he enjoys being active through partaking in Tonehouse workout classes, playing basketball, and spontaneous travels.',
      gitHub: 'https://github.com/JayC1765',
      linkedin: 'https://www.linkedin.com/in/jason-chan-cpa-106921bb/',
    },
    {
      name: 'Jason Lin',
      profilePicture: jasonL,
      bio: "Jason Lin is a full-stack software engineer based in New York City with experience in React, GraphQL, Node.JS and Express. His current fascination is the implication of machine learning in web development. In his downtime, you can find Jason tending to his cats, practicing his knife skills in the kitchen or finding himself immerse in fantasy RPG's.",
      gitHub: 'https://github.com/jvenlin',
      linkedin: 'https://www.linkedin.com/in/jplin/',
    },
  ];

  const teamMap = teamMembers.map((member) => (
    <TeamMember
      name={member.name}
      profilePicture={member.profilePicture}
      bio={member.bio}
      gitHub={member.gitHub}
      linkedIn={member.linkedin}
      key={uuidv4()}
    />
  ));
  return (
    <div className="team-container">
      <h2>Meet The Team!</h2>
      <div className="team">
        {teamMap}
      </div>
    </div>
  );
}
