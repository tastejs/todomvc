exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  files:
    javascripts:
      joinTo:
        'app.js': /^app/
        'vendor.js': /^vendor/

    stylesheets:
      joinTo: 'app.css'

    templates:
      joinTo: 'app.js'
