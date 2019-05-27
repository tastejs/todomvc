import {ViewStream} from '../views/view-stream-base';
import {curry} from 'ramda';
export class RouteChannelUpdater{

  constructor(cxt){
    let name = String(cxt.props.name);
    let id = `${name}_ROUTE_UPDATER`;

    const sendRouteChannelUpdate = curry(RouteChannelUpdater.createTemporaryViewStreamObj);

    return sendRouteChannelUpdate({id,name});

   //RouteChannelUpdater.createTemporaryViewStreamObj({name,id});
  }


  static createTemporaryViewStreamObj(props, data){
    let {name, id}  = props;
    let payload = data;
    let vs = new ViewStream({
        id, name, data
    });

    vs.onRendered = ()=>{
      vs.sendInfoToChannel('CHANNEL_ROUTE', payload);
    };

    vs.afterBroadcastEvents = ()=>{
      vs.disposeViewStream();
    };

    vs.appendToNull();
    //console.log("VIEWSTREAM IS ",{vs, name,id,payload});

  }



}