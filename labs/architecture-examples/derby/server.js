var port = process.env.PORT || 3003;

require('derby').run(__dirname + '/lib/server', port);
