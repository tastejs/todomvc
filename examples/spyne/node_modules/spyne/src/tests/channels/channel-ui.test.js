import {SpyneChannelUI} from '../../spyne/channels/spyne-channel-ui';
import {payloadPreventDefault, payloadStopPropagation, payloadTwoEvents, payloadNoEvent, payloadEmptyEvent} from '../mocks/payload-ui';

describe('root test', () => {

  const payload_eventPreventDefault =

  it('should return no event from ui payload', () => {
    let payload = R.clone(payloadNoEvent);
    let payloadUpdate = SpyneChannelUI.checkForEventMethods(payload);



    return true;

  });


  it('should return event paylaod from ui payload', () => {
    let payload = R.clone(payloadPreventDefault);
    let payloadUpdate = SpyneChannelUI.checkForEventMethods(payload);



    return true;

  });

  it('should return event paylaods from ui payload', () => {
    let payload = R.clone(payloadTwoEvents);
    let payloadUpdate = SpyneChannelUI.checkForEventMethods(payload);



    return true;

  });

});