zuix.controller(function (cp) {

    var instances = 0, resources = ' ', componentType = '';

    cp.create = function () {
        cp.view().on('click', function () {
           cp.trigger('item:click', cp.model());
        });
        cp.expose('count', function () {
            return instances;
        });

        var isHackBox = cp.model().componentId.indexOf('/zuix_') > 0;
        if (isHackBox)
            cp.view().children().eq(0).addClass('zuix-hackbox');

        // expose public interface members
        cp.expose({
            'instanceCount': countInstances,
            'hasResource': hasResource,
            'isHackBox': function () {
                return isHackBox;
            }
        });
        // display data
        var item = cp.model();
        if (item.controller != null && item.controller.toString().length > 30) {
            resources += 'js ';
            componentType = 'component';
        }
        if (item.view != null) {
            resources += 'html ';
            if (componentType == '')
                (item.view.indexOf('data-ui-field') > 0 || item.view.indexOf('<script') > 0)
                    ? componentType = 'template'
                    : componentType = 'content';
        }
        if (item.css != null)
            resources += 'css ';
        cp.field('resources').html(resources);
        switch (componentType) {
            case 'component':
                cp.field('icon').html('extension');
                break;
            case 'template':
                cp.field('icon').html('settings_ethernet');
                break;
            default:
                cp.field('icon').html('dashboard');
                break;
        }
        cp.update();
    };

    cp.update = function () {
        // populate fixed fields
        var item = cp.model();
        cp.field('componentId').html(item.componentId);
        instances = countInstances();
        cp.field('instances').html(instances);
        cp.trigger('item:update');
    };

    function countInstances() {
        var components = zuix.dumpContexts(),
            count = 0;
        for(var i = 0; i < components.length; i++)
            if (components[i].componentId == cp.model().componentId)
                count++;
        return count;
    }

    function hasResource(resourceType) {
        return (resources.indexOf(' '+resourceType+' ') >= 0);
    }

});