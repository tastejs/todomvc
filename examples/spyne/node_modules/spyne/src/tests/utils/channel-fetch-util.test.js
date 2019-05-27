import { ChannelFetchUtil } from '../../spyne/utils/channel-fetch-util';

describe('ChannelFetchUtil Tests', () => {
  const mapFn = (p) => {
    console.log('mapping fetched data ', p);
    return p;
  };

  let url = 'https://jsonplaceholder.typicode.com/posts/1';

  let props = {
    mapFn,
    url,
    method: 'GET'
  };

  let propsPost = {
    mapFn,
    url,
    method: 'POST',
    body: {
      id: 101,
      title: 'foo',
      body: 'bar',
      userId: 1
    }
  };

  let propsWBodyAsString = {
    url,
    method: 'POST',
    body: 'bar'
  };

  let propsGetStringified = {
    'method': 'GET',
    'url': 'https://jsonplaceholder.typicode.com/posts/1'
  };

  let propsStringified = {
    'body': '{"id":101,"title":"foo","body":"bar","userId":1}',
    'method': 'POST',
    'url': 'https://jsonplaceholder.typicode.com/posts/1'
  };

  const baseServerOptions = { method: 'GET', headers: { 'Content-type': 'application/json; charset=UTF-8' } };

  describe('stringify body method', () => {
    it('should convert body object to string', () => {
      let bodyStr = ChannelFetchUtil.stringifyBodyIfItExists(propsPost);
      bodyStr = R.omit(['mapFn'], bodyStr);
      expect(bodyStr).to.deep.equal(propsStringified);
    });

    it('should not parse body when its a string', () => {
      let bodyStr = ChannelFetchUtil.stringifyBodyIfItExists(propsWBodyAsString);

      expect(bodyStr).to.deep.equal(propsWBodyAsString);
    });

    it('should not add body param if its missing', () => {
      let bodyStr = ChannelFetchUtil.stringifyBodyIfItExists(props);
      bodyStr = R.omit(['mapFn'], bodyStr);
      expect(bodyStr).to.deep.equal(propsGetStringified);
    });
  });

  describe('create a new fetch util', () => {
    let subscriber = (data) => console.log('data retruned ', data);
    let p = R.clone(props);
    // p.responseType = 'text';

    // console.log("PROPS P",p);

    let channelFetchUtil = new ChannelFetchUtil(p, subscriber, true);

    it('should return correct server option', () => {
      let serverOptions = R.omit(['mapFn'], channelFetchUtil.serverOptions);
      expect(serverOptions).to.deep.equal(baseServerOptions);
    });

    it('should return correct response type', () => {
      expect(channelFetchUtil.responseType).to.equal('json');
    });

    it('should return correct url', () => {
      expect(channelFetchUtil.url).to.equal(url);
    });
  });


/*  describe('it should fetch an image', ()=>{
    let imgUrl = "http://localhost/spyne/src/tests/mocks/imgs/goat.jpg";


    it ('should return the image', ()=>{
      let channelFetchUtil = new ChannelFetchUtil({url:imgUrl, responseType:'blob'}, subscriber);
      let subscriber = (data) => console.log('data retruned ', data);


      return true;
    })


  });*/

  describe('fetch util updates method to POST from GET when body exists', () => {
    let subscriber = (data) => console.log('data retruned ', data);
    let p = R.omit(['method', 'mapFn'], props);
    p.responseType = 'text';
    p.body = { foo:'bar' };

    let channelFetchUtil = new ChannelFetchUtil(p, subscriber, true);

    it('should return correct server option', () => {
      let serverOptions = R.omit(['mapFn'], channelFetchUtil.serverOptions);
      return true;
    });

    it('should return correct response type', () => {
      expect(channelFetchUtil.responseType).to.equal('text');
    });

    it('should return correct url', () => {
      expect(channelFetchUtil.url).to.equal(url);
    });

    it('should return default mapFn', () => {
      expect(channelFetchUtil.mapFn).to.be.a('function');
    });
  });
});
