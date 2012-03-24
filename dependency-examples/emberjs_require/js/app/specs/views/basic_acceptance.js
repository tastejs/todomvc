/**
 * Some acceptance testing for views
 */

describe('Todos Views', function(){

  it('should validate clear button view', function(done){
    require(['text!app/views/clear_button.html'], function(html){
      expect(html).to.be.a('string');
      expect(html).to.match(/buttonString/);
      expect(Em.Handlebars.compile(html)).to.not.throw(Error);
      done();
    });
  });

  it('should validate items view', function(done){
    require(['text!app/views/items.html'], function(html){
      expect(html).to.be.a('string');
      expect(html).to.match(/collection/);
      expect(html).to.match(/Todos\.Controllers\.main/);
      expect(html).to.match(/Checkbox/);
      expect(Em.Handlebars.compile(html)).to.not.throw(Error);
      done();
    });
  });

});
