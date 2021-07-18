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
        let newNodes = _render()
        node.innerHTML = '';
        node.appendChild(newNodes);
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
      mount: (mount != null) ? () => { mount(state) } : null,
      render: _render, 
    };
  }