import { Component } from '@angular/core';

@Component ({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent {
  skills: any = [
    {
      name: 'Javascript',
      score: 90,
    },
    {
      name: 'C++',
      score: 80,
    },
    {
      name: 'C',
      score: 80,
    },
    {
      name: 'Java',
      score: 80,
    },
    {
      name: 'Python',
      score: 80,
    },
    {
      name: 'Photoshop',
      score: 85,
    },
    {
      name: 'Vector Image Design',
      score: 70,
    },
  ];

  experiences: any = [
    {
      company: 'Pinpoint Medical',
      jobTitle: 'Software Developer',
      start: 'September 2016',
      end: 'Present',
      description: `At my current Software job I am involved in every
      step of the development process, from design, planning and programming
      to deployment.`,
    },
    {
      company: 'Talamh Innovations',
      jobTitle: 'Software Intern',
      start: 'July 2016',
      end: 'August 2016',
      description: `I was responsible for producing websites, HTML5 games
      and Node.js CMS`,
    },
    {
      company: 'J Craddock Electrical',
      jobTitle: 'Assistant',
      start: 'July 2015',
      end: 'September 2015',
      description: `I worked in a Electronics shop to feed my
      love of all things electrical. I did everything from selling
      the electronics to attempting to fix them.`,
    },
  ]
}
