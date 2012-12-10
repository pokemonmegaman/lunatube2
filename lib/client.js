// Generated by CoffeeScript 1.4.0
(function() {

  requirejs(['vender/jquery', 'vender/socket.io', 'vender/js-yaml.min', 'spark', 'utils'], function() {
    return $.get('/static/schema.yaml', function(data) {
      var schemas;
      schemas = jsyaml.load(data);
      window.models = spark(schemas);
      return requirejs(['player', 'api'], function() {
        return requirejs(['main']);
      });
    });
  });

}).call(this);