import { DomEl } from '../../spyne/views/dom-el';
chai.use(require('chai-dom'));

describe('DomEl', () => {
  it('dom item exists', () => {
    expect(DomEl).to.exist;
  });

  it('dom item is a dom element', () => {
    let domItem = new DomEl({tagName: 'h1', data: 'my dom element'});
    let el = domItem.render();
    // assert.isFunction(domItem.click);
    expect(el).to.have.property('nodeName');
    // expect(domItem).dom.to.contain.text('my dom element');
  });

});


describe("DomElRendering", ()=> {

    it('DomEl Template show render data value', ()=>{
      let data = {cat:'meow'};
      let template = "<h1>The cat says {{cat}}";
      let domEl = new DomEl({data, template});
      let render = domEl.render();
      expect(render.innerText).to.equal('The cat says meow');
    });

    it('DomEl Template show loop object values', ()=>{
      let data = {dog: {
        sound: 'woof'
        }};
      let template = "<h1>The dog says {{#dog}}{{sound}}{{/dog}}";
      let domEl = new DomEl({data, template});
      let render = domEl.render();
      expect(render.innerText).to.equal('The dog says woof');
    });

    it('DomEl Template show not render null objects', ()=>{
      let data = {cat: {
          sound: 'woof'
        }};
      let template = "<article>{{#dog}}<h1>The dog says {{sound}}</h1>{{/dog}}</article>";
      let domEl = new DomEl({data, template});
      let render = domEl.render();
      expect(render.innerText).to.equal('');
    });

    it('DomEl Template show not render null values', ()=>{
      let data = {animals: [
            { name: 'dog',
              sound:'woof'
            },
           {  name: 'cat',
              sound:'meow'
            }
        ]};
      let template = "<article>{{#animals}}<h1>The {{name}} says {{sound}}</h1>{{/animals}}</article>";
      let domEl = new DomEl({data, template});
      let render = domEl.render();
      let renderStr = render.querySelectorAll('h1')[1].innerText;
      expect(renderStr).to.equal('The cat says meow');
    });



});