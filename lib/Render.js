module.exports = function (_component) {
  let component = {};
  Object.assign(component, _component);

  if (component.mount != null) component.mount();
  let node = component.render();

  component.set(node);

  return node;
};
