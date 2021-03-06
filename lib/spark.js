// Generated by CoffeeScript 1.4.0
(function() {
  var cache, globals, lookup, random;

  if (typeof window !== 'undefined') {
    globals = window;
  } else {
    globals = module.exports;
  }

  cache = {};

  lookup = function(id) {
    if (cache[id]) {
      return cache[id];
    }
    return null;
  };

  globals.cache = cache;

  globals.lookup = lookup;

  random = function() {
    var s4;
    s4 = function() {
      return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return s4() + s4() + s4() + s4();
  };

  globals.genclass = function(classname, attrs, links) {
    var proto;
    proto = function(construction) {
      var i, k, v, _i, _len;
      this.attrs = {};
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        i = attrs[_i];
        this.attrs[i] = '';
      }
      this.links = links || {};
      for (k in construction) {
        v = construction[k];
        if (typeof this.attrs[k] === 'undefined') {
          continue;
        }
        this.attrs[k] = v;
      }
      for (k in construction) {
        v = construction[k];
        if (typeof this.links[k] === 'undefined') {
          continue;
        }
        this.links[k] = v.id;
      }
      this.schema = {
        attrs: attrs,
        links: links
      };
      this.type = classname;
      this.events = {};
      this.get = function(key) {
        if (this.attrs[key]) {
          return this.attrs[key];
        }
        if (this.links[key]) {
          return lookup(this.links[key]);
        }
        return null;
      };
      this.set = function(key, value) {
        if (typeof this.attrs[key] !== 'undefined') {
          this.attrs[key] = value;
          return this.trigger('changed');
        } else if (typeof this.links[key] !== 'undefined') {
          value.save();
          this.links[key] = value.id;
          return this.trigger('changed');
        }
      };
      this.bind = function(k, fn) {
        if (!this.events[k]) {
          this.events[k] = [];
        }
        return this.events[k].push(fn);
      };
      this.trigger = function(k, val) {
        var fn, _j, _len1, _ref, _results;
        if (!this.events[k]) {
          return;
        }
        _ref = this.events[k];
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          fn = _ref[_j];
          _results.push(fn(val));
        }
        return _results;
      };
      this.json = function() {
        return {
          type: this.type,
          id: this.id,
          attrs: this.attrs,
          links: this.links
        };
      };
      this.load = function(json) {
        this.id = json.id;
        this.attrs = json.attrs;
        this.links = json.links;
        return this.trigger('changed');
      };
      this.save = function() {
        var guid;
        if (!this.id) {
          guid = random();
          while (cache[guid]) {
            guid = random();
          }
          this.id = guid;
        }
        return cache[this.id] = this;
      };
      if (this.cons) {
        this.cons();
      }
      return this;
    };
    proto.extend = function(fns) {
      var fn, name, _results;
      _results = [];
      for (name in fns) {
        fn = fns[name];
        _results.push(this.prototype[name] = fn);
      }
      return _results;
    };
    return proto;
  };

  globals.gencol = function(classname, model) {
    var proto;
    proto = function(construction) {
      if (construction && construction.length) {
        this.models = construction;
      } else {
        this.models = [];
      }
      this.type = classname + 'list';
      this.events = {};
      this.insert = function(obj, pos) {
        if (typeof pos === 'undefined') {
          pos = this.models.length;
        }
        obj.save();
        this.models.splice(pos, 0, obj.id);
        return this.trigger('changed');
      };
      this.save = function() {
        var guid;
        if (!this.id) {
          guid = random();
          while (cache[guid]) {
            guid = random();
          }
          this.id = guid;
        }
        return cache[this.id] = this;
      };
      this.remove = function(id) {
        var idx;
        if (id.id) {
          id = id.id;
        }
        idx = this.models.indexOf(id);
        if (id < 0) {
          return;
        }
        this.models.splice(idx, 1);
        return this.trigger('changed');
      };
      this.json = function() {
        return {
          type: this.type,
          id: this.id,
          models: this.models
        };
      };
      this.load = function(json) {
        this.id = json.id;
        return this.models = json.models;
      };
      this.bind = function(k, fn) {
        if (!this.events[k]) {
          this.events[k] = [];
        }
        return this.events[k].push(fn);
      };
      this.trigger = function(k) {
        var fn, _i, _len, _ref, _results;
        if (!this.events[k]) {
          return;
        }
        _ref = this.events[k];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fn = _ref[_i];
          _results.push(fn());
        }
        return _results;
      };
      return this;
    };
    return proto;
  };

}).call(this);
