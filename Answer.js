function isFinalSelector(selector) {
  return selector.split('.').filter(Boolean).length === 1 && selector.split('#').filter(Boolean).length === 1;
}

function hasClassAndId(selector) {
  return selector.includes('.') && selector.includes('#');
}

function htmlToArray(html) {
  return [].slice.call(html);
}

function hasClassSelector(element) {
  return element.className.includes(this.substring(1));
}

function hasIdSelector(element) {
  return element.id === this.substring(1);
}

function hasTagSelector(element) {
  return element.tagName.toLowerCase() === this.toString();
}

var selectorParser = {

  splitNextSelector: function (selector, nextSelector) {
    var firstSplitSelector = ' ' + selector.slice(1);
    if (hasClassAndId(selector)) {
      this.findSecondSelectorIndex(firstSplitSelector);
    } else if (selector.includes('.')) {
      this.endOfFirstSelector = selector.indexOf('.');
    } else {
      this.endOfFirstSelector = selector.indexOf('#');
    }
    return this.setSelectors(selector, nextSelector);
  },

  setSelectors: function (selector, nextSelector) {
    nextSelector = selector.substring(0, this.endOfFirstSelector);
    selector = selector.slice(this.endOfFirstSelector);
    return [selector, nextSelector];
  },

  findSecondSelectorIndex: function (firstSplitSelector) {
    var dotLoc = firstSplitSelector.indexOf('.');
    var hashLoc = firstSplitSelector.indexOf('#');
    if (firstSplitSelector.includes('.') && firstSplitSelector.includes('#')) {
      this.endOfFirstSelector = Math.min(dotLoc, hashLoc);
    } else if (firstSplitSelector.includes('.')) {
      this.endOfFirstSelector = dotLoc;
    } else {
      this.endOfFirstSelector = hashLoc;
    }
  }
};

// The selector engine function to be called
var $ = function (selector) {
  var elements = document.body.getElementsByTagName('*');
  var nextSelector;
  var selectors;

  // This loop runs until all filters within `select` have been applied to the 'elements'
  while (selector !== nextSelector) {
    // Set the selector to filter by next
    if (isFinalSelector(selector)) {
      nextSelector = selector;
    } else {
      selectors = selectorParser.splitNextSelector(selector, nextSelector);
      selector = selectors[0];
      nextSelector = selectors[1];
    }
    // Apply filter to the `elements` array
    if (nextSelector.charAt(0) === '.') {
      elements = htmlToArray(elements).filter(hasClassSelector, nextSelector);
    } else if (nextSelector.charAt(0) === '#') {
      elements = htmlToArray(elements).filter(hasIdSelector, nextSelector);
    } else {
      elements = htmlToArray(elements).filter(hasTagSelector, nextSelector);
    }
  }
  return elements;
};
