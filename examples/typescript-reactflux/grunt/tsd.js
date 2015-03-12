module.exports = {
    refresh: {
        options: {
            // execute a command
            command: 'reinstall',

            //optional: always get from HEAD
            latest: true,

            // specify config file
            config: 'typings/tsd.json',

            // experimental: options to pass to tsd.API
            opts: {
                // props from tsd.Options
            }
        }
    }
};
