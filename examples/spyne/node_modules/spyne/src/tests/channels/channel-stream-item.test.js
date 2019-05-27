import { ChannelPayloadRouteData, ChannelPayloadUIData, DeepLinkData } from '../mocks/channel-payload-data';
import { ChannelPayload } from '../../spyne/channels/channel-payload-class';

describe('Channel Stream Item tests', () => {
  it('deeplink should return [payload, type, location]', () => {
    const deepLinkData = DeepLinkData;
    // console.log('deep link data is ',deepLinkData);

    return true;
  });

  it('action should exist in route actions array', () => {
    const arr = ['CHANNEL_ROUTE_DEEPLINK_EVENT', 'CHANNEL_ROUTE_CHANGE_EVENT'];
    const action = 'CHANNEL_ROUTE_DEEPLINK_EVENT';
    const channel = 'ROUTE';
    let actionIsValid = ChannelPayload.validateAction(action, channel, arr);
    expect(actionIsValid).to.equal(true);
  });

  it('action should not exist in route actions array', () => {
    const arr = ['CHANNEL_ROUTE_DEEPLINK_EVENT', 'CHANNEL_ROUTE_CHANGE_EVENT'];
    const action = 'TEST';
    const channel = 'ROUTE';
    let actionIsValid = ChannelPayload.validateAction(action, channel, arr);
    expect(actionIsValid).to.equal(false);
  });
});
