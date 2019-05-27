const starWarsData = {

  'name': 'Rodolfo',

  'characters': ['Dart Vader', 'Yoda', 'Porgi', 'Princess Leia'],

  'movies': [
    {
      'title': 'A New Hope',
      'year': '1977'
    },
    {
      'title': 'Attack of the Clones',
      'year': '2002'
    },
    {
      'title': 'The Phantom Menace',
      'year': '1999'
    },
    {
      'title': 'Revenge of the Sith',
      'year': '2005'
    },
    {
      'title': 'Return of the Jedi',
      'year': '1983'
    },
    {
      'title': 'The Empire Strikes Back',
      'year': '1980'
    },
    {
      'title': 'The Force Awakens',
      'year': '2015'
    }
  ]
};

// ====================

const ScriptTemplate = document.createElement('script');

const theDiv = document.createElement('div');

const theH1 = document.createElement('h1');
theH1.textContent = 'Hello, {{name}}, here are your favorite Star Wars characters';

const charactersStart = document.createTextNode('{{#characters}}');
const charactersEnd =   document.createTextNode('{{/characters}}');
const charactersUl = document.createElement('ul');
const charactersLi = document.createElement('li');
charactersLi.textContent = '{{.*}}';

charactersUl.appendChild(charactersStart);
charactersUl.appendChild(charactersLi);
charactersUl.appendChild(charactersEnd);

const theH2 = document.createElement('h2');
theH2.textContent = 'And {{name}}, the movies were released on';
const moviesStart = document.createTextNode('{{#movies}}');
const moviesEnd =   document.createTextNode('{{/movies}}');
const moviesUl = document.createElement('ul');
const moviesLi = document.createElement('li');
moviesLi.textContent = '{{title}} year:{{year}}';

moviesUl.appendChild(moviesStart);
moviesUl.appendChild(moviesLi);
moviesUl.appendChild(moviesEnd);

theDiv.appendChild(theH1);
theDiv.appendChild(charactersUl);
theDiv.appendChild(theH2);
theDiv.appendChild(moviesUl);

ScriptTemplate.appendChild(theDiv);
// ScriptTemplate.text+="{{#test}}";

// const elSrc =  new window.WINDOWParser().parseFromString(ScriptTemplate.innerHTML, 'text/html').body.childNodes;

const StringTemplate = '<div><h1>Hello, {{name}}, here are your favorite Star Wars characters</h1><ul>{{#characters}}<li>{{.*}}</li>{{/characters}}</ul><h2>And {{name}}, the movies were released on</h2><ul>{{#movies}}<li>{{title}} year:{{year}}</li>{{/movies}}</ul></div>';

export { ScriptTemplate, StringTemplate, starWarsData };

// const markup = `<div><h1>Hello {{name}}, here are your favorite Star Wars characters</h1><ul> {{#characters}} <li>{{.*}} </li>{{/characters}}</ul><h2>And {{name}}, the movies were released on</h2><ul>{{#movies}}<li>{{title}} year:{{year}}</li>{{/movies}}<ul></div>`;
