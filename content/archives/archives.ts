import v0 from 'public/img/archive/v0.png';
import v1 from 'public/img/archive/v1.png';
import v2 from 'public/img/archive/v2.png';
import v3 from 'public/img/archive/v3.png';
import v4 from 'public/img/archive/v4.png';

export const archives = [
  {
    version: 0,
    date: '2015-2017',
    imageSrc: v0,
    summary:
      'I created a website back in Sixth Form as part of a lesson about HTML. It was never hosted anywhere, so I classed it as a v0.',
  },
  {
    version: 1,
    date: '2017-2018',
    imageSrc: v1,
    summary: 'The first site I published was static HTML and CSS, and was hosted using GitHub Pages.',
  },
  {
    version: 2,
    date: '2018-2020',
    imageSrc: v2,
    summary:
      'The second generation was made using Jekyll, and converted my old design into something more sustainable.',
  },
  {
    version: 3,
    date: '2020',
    imageSrc: v3,
    summary:
      'Version 3 of my site was created using React, and compiled using a GitHub Action, also hosted using GitHub Pages.',
  },
  {
    version: 4,
    date: '2020-2023',
    imageSrc: v4,
    summary:
      'This most recent iteration of my site used Gatsby on the frontend, hosted using Netlify. The backend was an Express server hosted on Heroku.',
  },
] as const;
