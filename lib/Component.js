module.exports = function ({ render, mount, ...states }) {
    function _render () {
        return render(state);
    }

    let node;

    let stateHandler = {
      get: (obj, prop, receiver) => {
        return obj[prop];
      },

      set: (obj, prop, newval) => {
        obj[prop] = newval;
        node.innerHTML = '';
        node.appendChild(_render());
        //console.log("Dirty!", node);
        return true;
      },
    };

    let _state = states;
    let state = new Proxy(_state, stateHandler);

    
    function set(newNode){
        node = newNode;
    }

    return {
      state: state,
      set: set,
      mount: (Mount != null) ? () => { mount(state) } : null,
      render: _render, 
    };
  }