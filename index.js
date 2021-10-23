/*
 terminable (https://npmjs.com/package/terminable)
 Copyright 2021 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/terminable)
*/

'use strict';

const { EventEmitter } = require('events');

module.exports = class Terminable extends EventEmitter {
  constructor () {
    super();

    this.terminated = false;
    this.resources = new Map();
    this.cb = null;
  }

  get size () {
    return this.resources.size;
  }

  add (resource, cb) {
    let state = this.get(resource);
    if (state) return state;

    state = new Terminable();
    state._add = this._add;
    this.resources.set(resource, state);

    if (cb) {
      state.cb = cb;
      state.on('cleanup', state.cb);
    } else {
      this._add(resource);
    }

    return state;
  }

  _add (resource) {
    // noop
  }

  /*
  // const state = terminable.set(socket)
  set (resource) {
    this.delete(resource)
    return this.add(resource)
  }
  */

  get (resource) {
    return this.resources.get(resource); // => state
  }

  find (resource) {
    let state = this._find(resource);
    if (state !== undefined) return state;

    state = this.get(resource);
    if (state === undefined) {
      for (const [, term] of this.resources) {
        state = term.find(resource);
        if (state !== undefined) {
          return state;
        }
      }
    }
    return state;
  }

  _find (resource) {
    // noop
  }

  _delete (resource) {
    const term = this.get(resource);
    if (!term) return;

    this.resources.delete(resource);
    return term;
  }

  delete (resource) {
    const state = this.get(resource);
    if (state.cb) {
      state.off('cleanup', state.cb);
      delete state.cb;
    }
    state.cleanup();
    this._delete(resource);
    if (this.terminated && !this.size) {
      this.emit('cleanup');
    }
  }

  cleanup (resource) {
    if (resource === undefined) this._cleanup();
    else this._cleanupOne(resource);
  }

  _cleanup () {
    if (this.terminated) return;
    this.terminated = true;

    for (const [resource] of this.resources) {
      this._cleanupOne(resource);
    }

    this.emit('cleanup');
  }

  _cleanupOne (resource) {
    const state = this.get(resource);
    if (!state) return;

    state.cleanup();
  }
}
