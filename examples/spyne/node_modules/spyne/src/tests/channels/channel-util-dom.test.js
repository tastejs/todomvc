import { SpyneChannelWindow} from '../../spyne/channels/spyne-channel-window-base';
import { SpyneUtilsChannelWindow } from '../../spyne/utils/spyne-utils-channel-window';
import { SpyneConfigData } from '../mocks/utils-data';

const domData = SpyneConfigData.channels.WINDOW;

describe('channel dom util tests', () => {
  describe('channel dom media queries', () => {
    it('should create media query', () => {
      let queryStr = domData.mediqQueries.test;
      let mq = SpyneUtilsChannelWindow.createMediaQuery(queryStr);
      expect(mq.constructor.name).to.equal('MediaQueryList');
    });

    it('should create media query observable', () => {
      let queryStr = domData.mediqQueries.test;
      let mq = SpyneUtilsChannelWindow.createMediaQuery(queryStr);
      let obs$ = SpyneUtilsChannelWindow.createMediaQueryHandler(mq, 'test');
      return true;
    });

    it('should return obs$ arr based on config ', () => {
      let obs$Arr = SpyneUtilsChannelWindow.createMergedObsFromObj(domData);
      expect(obs$Arr.length).to.equal(2);
    });
  });

  describe('channel dom create window event', () => {
    it('it should create a window event', () => {
      const onUnload = e => localStorage.setItem('ubu', window.document.body.outerHTML);
      let obs$ = SpyneUtilsChannelWindow.createDomObservableFromEvent('beforeunload');
      // obs$.subscribe(onUnload);
      expect(obs$.constructor.name).to.equal('Observable');
    });
  });

  describe('channel dom window resize', () => {
    it('add resize screenItem from config', () => {

    });
  });

  describe('channel dom scroll', () => {
    it('add dom scroll from config', () => {
      return true;
    });
    it('add mousewheel scroll from config', () => {
      return true;
    });
  });
});
