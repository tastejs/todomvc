#\-p8000
# ^^^^^^ The above line sets the default port to 8000

require 'bundler'
Bundler.require

map '/labs/architecture-examples/vienna/' do
  run Opal::Server.new { |s|
    s.append_path 'bower_components/todomvc-common'
    s.append_path 'app'

    s.main       = 'app/application'
    s.index_path = 'index.html.haml'

    s.debug = false
  }
end

map '/' do
  todomvc_root = File.dirname(__FILE__).split('/labs/')[0...-1].join('/labs/')
  p todomvc_root
  run Rack::File.new(todomvc_root)
end
