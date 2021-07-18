module.exports = function el({
    name,
    child,
    children,
    text,
    parent = null,
    dangerousHTML,
    ...opts
  }) {
    let node = document.createElement(name);
  
    if (child) node.appendChild(child);
  
    if (children)
      for (child of children) {
        node.appendChild(child);
      }
  
    if (text) node.innerText = text;
  
    if (dangerousHTML) node.innerHTML = dangerousHTML;
  
    if (parent) console.log(parent);
  
    for (let [option, value] of Object.entries(opts)) {
      node.setAttribute(option, value);
    }
  
    return node;
  }