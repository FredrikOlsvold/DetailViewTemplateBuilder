(function () {
  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill =
    typeof window !== "undefined" &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
   * into another container (could be the same container), before `before`. If
   * `before` is null, it appends the nodes to the container.
   */
  const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.insertBefore(start, before);
      start = n;
    }
  };
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */
  const removeNodes = (container, start, end = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.removeChild(start);
      start = n;
    }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */
  const boundAttributeSuffix = "$lit$";
  /**
   * An updatable Template that tracks the location of dynamic parts.
   */
  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      const nodesToRemove = [];
      const stack = [];
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
      const walker = document.createTreeWalker(
        element.content,
        133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */,
        null,
        false
      );
      // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.
      let lastPartIndex = 0;
      let index = -1;
      let partIndex = 0;
      const {
        strings,
        values: { length },
      } = result;
      while (partIndex < length) {
        const node = walker.nextNode();
        if (node === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          continue;
        }
        index++;
        if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const { length } = attributes;
            // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.
            let count = 0;
            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }
            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex];
              // Find the attribute name
              const name = lastAttributeNameRegex.exec(stringForPart)[2];
              // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.
              const attributeLookupName =
                name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: "attribute",
                index,
                name,
                strings: statics,
              });
              partIndex += statics.length - 1;
            }
          }
          if (node.tagName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
          const data = node.data;
          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1;
            // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts
            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];
              if (s === "") {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);
                if (
                  match !== null &&
                  endsWith(match[2], boundAttributeSuffix)
                ) {
                  s =
                    s.slice(0, match.index) +
                    match[1] +
                    match[2].slice(0, -boundAttributeSuffix.length) +
                    match[3];
                }
                insert = document.createTextNode(s);
              }
              parent.insertBefore(insert, node);
              this.parts.push({ type: "node", index: ++index });
            }
            // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.
            if (strings[lastIndex] === "") {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            }
            // We have a part for each match found
            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
          if (node.data === marker) {
            const parent = node.parentNode;
            // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part
            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }
            lastPartIndex = index;
            this.parts.push({ type: "node", index });
            // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.
            if (node.nextSibling === null) {
              node.data = "";
            } else {
              nodesToRemove.push(node);
              index--;
            }
            partIndex++;
          } else {
            let i = -1;
            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({ type: "node", index: -1 });
              partIndex++;
            }
          }
        }
      }
      // Remove text binding nodes after the walk to not disturb the TreeWalker
      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }
  }
  const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
  };
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.
  const createMarker = () => document.createComment("");
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex =
    // eslint-disable-next-line no-control-regex
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133; /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
    const {
      element: { content },
      parts,
    } = template;
    const walker = document.createTreeWalker(
      content,
      walkerNodeFilter,
      null,
      false
    );
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
      nodeIndex++;
      const node = walker.currentNode;
      // End removal if stepped past the removing node
      if (node.previousSibling === currentRemovingNode) {
        currentRemovingNode = null;
      }
      // A node to remove was found in the template
      if (nodesToRemove.has(node)) {
        nodesToRemoveInTemplate.push(node);
        // Track node we're removing
        if (currentRemovingNode === null) {
          currentRemovingNode = node;
        }
      }
      // When removing, increment count by which to adjust subsequent part indices
      if (currentRemovingNode !== null) {
        removeCount++;
      }
      while (part !== undefined && part.index === nodeIndex) {
        // If part is in a removed node deactivate it by setting index to -1 or
        // adjust the index as needed.
        part.index =
          currentRemovingNode !== null ? -1 : part.index - removeCount;
        // go to the next active part.
        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        part = parts[partIndex];
      }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
    let count = node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ ? 0 : 1;
    const walker = document.createTreeWalker(
      node,
      walkerNodeFilter,
      null,
      false
    );
    while (walker.nextNode()) {
      count++;
    }
    return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
      const part = parts[i];
      if (isTemplatePartActive(part)) {
        return i;
      }
    }
    return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
    const {
      element: { content },
      parts,
    } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
      content.appendChild(node);
      return;
    }
    const walker = document.createTreeWalker(
      content,
      walkerNodeFilter,
      null,
      false
    );
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
      walkerIndex++;
      const walkerNode = walker.currentNode;
      if (walkerNode === refNode) {
        insertCount = countNodes(node);
        refNode.parentNode.insertBefore(node, refNode);
      }
      while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
        // If we've inserted the node, simply adjust all subsequent parts
        if (insertCount > 0) {
          while (partIndex !== -1) {
            parts[partIndex].index += insertCount;
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
          return;
        }
        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      }
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  /**
   * Brands a function as a directive factory function so that lit-html will call
   * the function during template rendering, rather than passing as a value.
   *
   * A _directive_ is a function that takes a Part as an argument. It has the
   * signature: `(part: Part) => void`.
   *
   * A directive _factory_ is a function that takes arguments for data and
   * configuration and returns a directive. Users of directive usually refer to
   * the directive factory as the directive. For example, "The repeat directive".
   *
   * Usually a template author will invoke a directive factory in their template
   * with relevant arguments, which will then return a directive function.
   *
   * Here's an example of using the `repeat()` directive factory that takes an
   * array and a function to render an item:
   *
   * ```js
   * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
   * ```
   *
   * When `repeat` is invoked, it returns a directive function that closes over
   * `items` and the template function. When the outer template is rendered, the
   * return directive function is called with the Part for the expression.
   * `repeat` then performs it's custom logic to render multiple items.
   *
   * @param f The directive factory function. Must be a function that returns a
   * function of the signature `(part: Part) => void`. The returned function will
   * be called with the part object.
   *
   * @example
   *
   * import {directive, html} from 'lit-html';
   *
   * const immutable = directive((v) => (part) => {
   *   if (part.value !== v) {
   *     part.setValue(v)
   *   }
   * });
   */
  const directive = (f) => (...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
  };
  const isDirective = (o) => {
    return typeof o === "function" && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */
  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
    constructor(template, processor, options) {
      this.__parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }
    update(values) {
      let i = 0;
      for (const part of this.__parts) {
        if (part !== undefined) {
          part.setValue(values[i]);
        }
        i++;
      }
      for (const part of this.__parts) {
        if (part !== undefined) {
          part.commit();
        }
      }
    }
    _clone() {
      // There are a number of steps in the lifecycle of a template instance's
      // DOM fragment:
      //  1. Clone - create the instance fragment
      //  2. Adopt - adopt into the main document
      //  3. Process - find part markers and create parts
      //  4. Upgrade - upgrade custom elements
      //  5. Update - set node, attribute, property, etc., values
      //  6. Connect - connect to the document. Optional and outside of this
      //     method.
      //
      // We have a few constraints on the ordering of these steps:
      //  * We need to upgrade before updating, so that property values will pass
      //    through any property setters.
      //  * We would like to process before upgrading so that we're sure that the
      //    cloned fragment is inert and not disturbed by self-modifying DOM.
      //  * We want custom elements to upgrade even in disconnected fragments.
      //
      // Given these constraints, with full custom elements support we would
      // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
      //
      // But Safari does not implement CustomElementRegistry#upgrade, so we
      // can not implement that order and still have upgrade-before-update and
      // upgrade disconnected fragments. So we instead sacrifice the
      // process-before-upgrade constraint, since in Custom Elements v1 elements
      // must not modify their light DOM in the constructor. We still have issues
      // when co-existing with CEv0 elements like Polymer 1, and with polyfills
      // that don't strictly adhere to the no-modification rule because shadow
      // DOM, which may be created in the constructor, is emulated by being placed
      // in the light DOM.
      //
      // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
      // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
      // in one step.
      //
      // The Custom Elements v1 polyfill supports upgrade(), so the order when
      // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
      // Connect.
      const fragment = isCEPolyfill
        ? this.template.element.content.cloneNode(true)
        : document.importNode(this.template.element.content, true);
      const stack = [];
      const parts = this.template.parts;
      // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
      const walker = document.createTreeWalker(
        fragment,
        133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */,
        null,
        false
      );
      let partIndex = 0;
      let nodeIndex = 0;
      let part;
      let node = walker.nextNode();
      // Loop through all the nodes and parts of a template
      while (partIndex < parts.length) {
        part = parts[partIndex];
        if (!isTemplatePartActive(part)) {
          this.__parts.push(undefined);
          partIndex++;
          continue;
        }
        // Progress the tree walker until we find our next part's node.
        // Note that multiple parts may share the same node (attribute parts
        // on a single element), so this loop may not run at all.
        while (nodeIndex < part.index) {
          nodeIndex++;
          if (node.nodeName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
          if ((node = walker.nextNode()) === null) {
            // We've exhausted the content inside a nested template element.
            // Because we still have parts (the outer for-loop), we know:
            // - There is a template in the stack
            // - The walker will find a nextNode outside the template
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        }
        // We've arrived at our part's node.
        if (part.type === "node") {
          const part = this.processor.handleTextExpression(this.options);
          part.insertAfterNode(node.previousSibling);
          this.__parts.push(part);
        } else {
          this.__parts.push(
            ...this.processor.handleAttributeExpressions(
              node,
              part.name,
              part.strings,
              this.options
            )
          );
        }
        partIndex++;
      }
      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }
      return fragment;
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Our TrustedTypePolicy for HTML which is declared using the html template
   * tag function.
   *
   * That HTML is a developer-authored constant, and is parsed with innerHTML
   * before any untrusted expressions have been mixed in. Therefor it is
   * considered safe by construction.
   */
  const policy =
    window.trustedTypes &&
    trustedTypes.createPolicy("lit-html", { createHTML: (s) => s });
  const commentMarker = ` ${marker} `;
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
      const l = this.strings.length - 1;
      let html = "";
      let isCommentBinding = false;
      for (let i = 0; i < l; i++) {
        const s = this.strings[i];
        // For each binding we want to determine the kind of marker to insert
        // into the template source before it's parsed by the browser's HTML
        // parser. The marker type is based on whether the expression is in an
        // attribute, text, or comment position.
        //   * For node-position bindings we insert a comment with the marker
        //     sentinel as its text content, like <!--{{lit-guid}}-->.
        //   * For attribute bindings we insert just the marker sentinel for the
        //     first binding, so that we support unquoted attribute bindings.
        //     Subsequent bindings can use a comment marker because multi-binding
        //     attributes must be quoted.
        //   * For comment bindings we insert just the marker sentinel so we don't
        //     close the comment.
        //
        // The following code scans the template source, but is *not* an HTML
        // parser. We don't need to track the tree structure of the HTML, only
        // whether a binding is inside a comment, and if not, if it appears to be
        // the first binding in an attribute.
        const commentOpen = s.lastIndexOf("<!--");
        // We're in comment position if we have a comment open with no following
        // comment close. Because <-- can appear in an attribute value there can
        // be false positives.
        isCommentBinding =
          (commentOpen > -1 || isCommentBinding) &&
          s.indexOf("-->", commentOpen + 1) === -1;
        // Check to see if we have an attribute-like sequence preceding the
        // expression. This can match "name=value" like structures in text,
        // comments, and attribute values, so there can be false-positives.
        const attributeMatch = lastAttributeNameRegex.exec(s);
        if (attributeMatch === null) {
          // We're only in this branch if we don't have a attribute-like
          // preceding sequence. For comments, this guards against unusual
          // attribute values like <div foo="<!--${'bar'}">. Cases like
          // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
          // below.
          html += s + (isCommentBinding ? commentMarker : nodeMarker);
        } else {
          // For attributes we use just a marker sentinel, and also append a
          // $lit$ suffix to the name to opt-out of attribute-specific parsing
          // that IE and Edge do for style and certain SVG attributes.
          html +=
            s.substr(0, attributeMatch.index) +
            attributeMatch[1] +
            attributeMatch[2] +
            boundAttributeSuffix +
            attributeMatch[3] +
            marker;
        }
      }
      html += this.strings[l];
      return html;
    }
    getTemplateElement() {
      const template = document.createElement("template");
      let value = this.getHTML();
      if (policy !== undefined) {
        // this is secure because `this.strings` is a TemplateStringsArray.
        // TODO: validate this when
        // https://github.com/tc39/proposal-array-is-template-object is
        // implemented.
        value = policy.createHTML(value);
      }
      template.innerHTML = value;
      return template;
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
    return (
      value === null ||
      !(typeof value === "object" || typeof value === "function")
    );
  };
  const isIterable = (value) => {
    return (
      Array.isArray(value) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      !!(value && value[Symbol.iterator])
    );
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attribute. The value is only set once even if there are multiple parts
   * for an attribute.
   */
  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];
      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
      return new AttributePart(this);
    }
    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      const parts = this.parts;
      // If we're assigning an attribute via syntax like:
      //    attr="${foo}"  or  attr=${foo}
      // but not
      //    attr="${foo} ${bar}" or attr="${foo} baz"
      // then we don't want to coerce the attribute value into one long
      // string. Instead we want to just return the value itself directly,
      // so that sanitizeDOMValue can get the actual value rather than
      // String(value)
      // The exception is if v is an array, in which case we do want to smash
      // it together into a string without calling String() on the array.
      //
      // This also allows trusted values (when using TrustedTypes) being
      // assigned to DOM sinks without being stringified in the process.
      if (l === 1 && strings[0] === "" && strings[1] === "") {
        const v = parts[0].value;
        if (typeof v === "symbol") {
          return String(v);
        }
        if (typeof v === "string" || !isIterable(v)) {
          return v;
        }
      }
      let text = "";
      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = parts[i];
        if (part !== undefined) {
          const v = part.value;
          if (isPrimitive(v) || !isIterable(v)) {
            text += typeof v === "string" ? v : String(v);
          } else {
            for (const t of v) {
              text += typeof t === "string" ? t : String(t);
            }
          }
        }
      }
      text += strings[l];
      return text;
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }
  }
  /**
   * A Part that controls all or part of an attribute value.
   */
  class AttributePart {
    constructor(committer) {
      this.value = undefined;
      this.committer = committer;
    }
    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value;
        // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().
        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }
    commit() {
      while (isDirective(this.value)) {
        const directive = this.value;
        this.value = noChange;
        directive(this);
      }
      if (this.value === noChange) {
        return;
      }
      this.committer.commit();
    }
  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */
  class NodePart {
    constructor(options) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
      part.__insert((this.startNode = createMarker()));
      part.__insert((this.endNode = createMarker()));
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
      ref.__insert((this.startNode = createMarker()));
      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      if (this.startNode.parentNode === null) {
        return;
      }
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }
      const value = this.__pendingValue;
      if (value === noChange) {
        return;
      }
      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this.__commitText(value);
      }
    }
    __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
      if (this.value === value) {
        return;
      }
      this.clear();
      this.__insert(value);
      this.value = value;
    }
    __commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? "" : value;
      // If `value` isn't already a string, we explicitly convert it here in case
      // it can't be implicitly converted - i.e. it's a symbol.
      const valueAsString = typeof value === "string" ? value : String(value);
      if (
        node === this.endNode.previousSibling &&
        node.nodeType === 3 /* Node.TEXT_NODE */
      ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }
      this.value = value;
    }
    __commitTemplateResult(value) {
      const template = this.options.templateFactory(value);
      if (
        this.value instanceof TemplateInstance &&
        this.value.template === template
      ) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        const instance = new TemplateInstance(
          template,
          value.processor,
          this.options
        );
        const fragment = instance._clone();
        instance.update(value.values);
        this.__commitNode(fragment);
        this.value = instance;
      }
    }
    __commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      }
      // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render
      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;
      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex];
        // If no existing part, create a new one
        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);
          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }
        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }
      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }
    clear(startNode = this.startNode) {
      removeNodes(
        this.startNode.parentNode,
        startNode.nextSibling,
        this.endNode
      );
    }
  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = undefined;
      this.__pendingValue = undefined;
      if (strings.length !== 2 || strings[0] !== "" || strings[1] !== "") {
        throw new Error(
          "Boolean attributes can only contain a single expression"
        );
      }
      this.element = element;
      this.name = name;
      this.strings = strings;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const value = !!this.__pendingValue;
      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, "");
        } else {
          this.element.removeAttribute(this.name);
        }
        this.value = value;
      }
      this.__pendingValue = noChange;
    }
  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */
  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single =
        strings.length === 2 && strings[0] === "" && strings[1] === "";
    }
    _createPart() {
      return new PropertyPart(this);
    }
    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }
      return super._getValue();
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = this._getValue();
      }
    }
  }
  class PropertyPart extends AttributePart {}
  // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the third
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.
  let eventOptionsSupported = false;
  // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
  // blocks right into the body of a module
  (() => {
    try {
      const options = {
        get capture() {
          eventOptionsSupported = true;
          return false;
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.addEventListener("test", options, options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("test", options, options);
    } catch (_e) {
      // event options not supported
    }
  })();
  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;
      this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const newListener = this.__pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener =
        newListener == null ||
        (oldListener != null &&
          (newListener.capture !== oldListener.capture ||
            newListener.once !== oldListener.once ||
            newListener.passive !== oldListener.passive));
      const shouldAddListener =
        newListener != null && (oldListener == null || shouldRemoveListener);
      if (shouldRemoveListener) {
        this.element.removeEventListener(
          this.eventName,
          this.__boundHandleEvent,
          this.__options
        );
      }
      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(
          this.eventName,
          this.__boundHandleEvent,
          this.__options
        );
      }
      this.value = newListener;
      this.__pendingValue = noChange;
    }
    handleEvent(event) {
      if (typeof this.value === "function") {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }
  }
  // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.
  const getOptions = (o) =>
    o &&
    (eventOptionsSupported
      ? { capture: o.capture, passive: o.passive, once: o.once }
      : o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */
  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map(),
      };
      templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
      return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement());
      // Cache the Template for this key
      templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */
  const render$1 = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts.set(
        container,
        (part = new NodePart(Object.assign({ templateFactory }, options)))
      );
      part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */
  class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];
      if (prefix === ".") {
        const committer = new PropertyCommitter(
          element,
          name.slice(1),
          strings
        );
        return committer.parts;
      }
      if (prefix === "@") {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }
      if (prefix === "?") {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }
      const committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
      return new NodePart(options);
    }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  if (typeof window !== "undefined") {
    (window["litHtmlVersions"] || (window["litHtmlVersions"] = [])).push(
      "1.4.0"
    );
  }
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */
  const html = (strings, ...values) =>
    new TemplateResult(strings, values, "html", defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  let compatibleShadyCSSVersion = true;
  if (typeof window.ShadyCSS === "undefined") {
    compatibleShadyCSSVersion = false;
  } else if (typeof window.ShadyCSS.prepareTemplateDom === "undefined") {
    console.warn(
      `Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`
    );
    compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map(),
      };
      templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
      return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
      const element = result.getTemplateElement();
      if (compatibleShadyCSSVersion) {
        window.ShadyCSS.prepareTemplateDom(element, scopeName);
      }
      template = new Template(result, element);
      templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
  };
  const TEMPLATE_TYPES = ["html", "svg"];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
      const templates = templateCaches.get(
        getTemplateCacheKey(type, scopeName)
      );
      if (templates !== undefined) {
        templates.keyString.forEach((template) => {
          const {
            element: { content },
          } = template;
          // IE 11 doesn't support the iterable param Set constructor
          const styles = new Set();
          Array.from(content.querySelectorAll("style")).forEach((s) => {
            styles.add(s);
          });
          removeNodesFromTemplate(template, styles);
        });
      }
    });
  };
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */
  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template
      ? template.element
      : document.createElement("template");
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll("style");
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
      // Ensure prepareTemplateStyles is called to support adding
      // styles via `prepareAdoptedCssText` since that requires that
      // `prepareTemplateStyles` is called.
      //
      // ShadyCSS will only update styles containing @apply in the template
      // given to `prepareTemplateStyles`. If no lit Template was given,
      // ShadyCSS will not be able to update uses of @apply in any relevant
      // template. However, this is not a problem because we only create the
      // template for the purpose of supporting `prepareAdoptedCssText`,
      // which doesn't support @apply at all.
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      return;
    }
    const condensedStyle = document.createElement("style");
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
      const style = styles[i];
      style.parentNode.removeChild(style);
      condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
      insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    } else {
      content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector("style");
    if (window.ShadyCSS.nativeShadow && style !== null) {
      // When in native Shadow DOM, ensure the style created by ShadyCSS is
      // included in initially rendered output (`renderedDOM`).
      renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    } else if (!!template) {
      // When no style is left in the template, parts will be broken as a
      // result. To fix this, we put back the style node ShadyCSS removed
      // and then tell lit to remove that node from the template.
      // There can be no style in the template in 2 cases (1) when Shady DOM
      // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
      // is in use ShadyCSS removes the style if it contains no content.
      // NOTE, ShadyCSS creates its own style so we can safely add/remove
      // `condensedStyle` here.
      content.insertBefore(condensedStyle, content.firstChild);
      const removes = new Set();
      removes.add(condensedStyle);
      removeNodesFromTemplate(template, removes);
    }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */
  const render = (result, container, options) => {
    if (!options || typeof options !== "object" || !options.scopeName) {
      throw new Error("The `scopeName` option is required.");
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping =
      compatibleShadyCSSVersion &&
      container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
      !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender
      ? document.createDocumentFragment()
      : container;
    render$1(
      result,
      renderContainer,
      Object.assign(
        { templateFactory: shadyTemplateFactory(scopeName) },
        options
      )
    );
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
      const part = parts.get(renderContainer);
      parts.delete(renderContainer);
      // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
      // that should apply to `renderContainer` even if the rendered value is
      // not a TemplateInstance. However, it will only insert scoped styles
      // into the document if `prepareTemplateStyles` has already been called
      // for the given scope name.
      const template =
        part.value instanceof TemplateInstance
          ? part.value.template
          : undefined;
      prepareTemplateStyles(scopeName, renderContainer, template);
      removeNodes(container, container.firstChild);
      container.appendChild(renderContainer);
      parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
      window.ShadyCSS.styleElement(container.host);
    }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  /**
   * Use this module if you want to create your own base class extending
   * [[UpdatingElement]].
   * @packageDocumentation
   */
  /*
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */
  window.JSCompiler_renameProperty = (prop, _obj) => prop;
  const defaultConverter = {
    toAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value ? "" : null;
        case Object:
        case Array:
          // if the value is `null` or `undefined` pass this through
          // to allow removing/no change behavior.
          return value == null ? value : JSON.stringify(value);
      }
      return value;
    },
    fromAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;
        case Number:
          return value === null ? null : Number(value);
        case Object:
        case Array:
          // Type assert to adhere to Bazel's "must type assert JSON parse" rule.
          return JSON.parse(value);
      }
      return value;
    },
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */
  const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
  };
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */
  const finalized = "finalized";
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   * @noInheritDoc
   */
  class UpdatingElement extends HTMLElement {
    constructor() {
      super();
      this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
      // note: piggy backing on this to ensure we're finalized.
      this.finalize();
      const attributes = [];
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      this._classProperties.forEach((v, p) => {
        const attr = this._attributeNameForProperty(p, v);
        if (attr !== undefined) {
          this._attributeToPropertyMap.set(attr, p);
          attributes.push(attr);
        }
      });
      return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
      // ensure private storage for property declarations.
      if (
        !this.hasOwnProperty(
          JSCompiler_renameProperty("_classProperties", this)
        )
      ) {
        this._classProperties = new Map();
        // NOTE: Workaround IE11 not supporting Map constructor argument.
        const superProperties = Object.getPrototypeOf(this)._classProperties;
        if (superProperties !== undefined) {
          superProperties.forEach((v, k) => this._classProperties.set(k, v));
        }
      }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
      // Note, since this can be called by the `@property` decorator which
      // is called before `finalize`, we ensure storage exists for property
      // metadata.
      this._ensureClassProperties();
      this._classProperties.set(name, options);
      // Do not generate an accessor if the prototype already has one, since
      // it would be lost otherwise and that would never be the user's intention;
      // Instead, we expect users to call `requestUpdate` themselves from
      // user-defined accessors. Note that if the super has an accessor we will
      // still overwrite it
      if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
        return;
      }
      const key = typeof name === "symbol" ? Symbol() : `__${name}`;
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== undefined) {
        Object.defineProperty(this.prototype, name, descriptor);
      }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, options) {
      return {
        // tslint:disable-next-line:no-any no symbol in index
        get() {
          return this[key];
        },
        set(value) {
          const oldValue = this[name];
          this[key] = value;
          this.requestUpdateInternal(name, oldValue, options);
        },
        configurable: true,
        enumerable: true,
      };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
      return (
        (this._classProperties && this._classProperties.get(name)) ||
        defaultPropertyDeclaration
      );
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
      // finalize any superclasses
      const superCtor = Object.getPrototypeOf(this);
      if (!superCtor.hasOwnProperty(finalized)) {
        superCtor.finalize();
      }
      this[finalized] = true;
      this._ensureClassProperties();
      // initialize Map populated in observedAttributes
      this._attributeToPropertyMap = new Map();
      // make any properties
      // Note, only process "own" properties since this element will inherit
      // any properties defined on the superClass, and finalization ensures
      // the entire prototype chain is finalized.
      if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
        const props = this.properties;
        // support symbols in properties (IE11 does not support this)
        const propKeys = [
          ...Object.getOwnPropertyNames(props),
          ...(typeof Object.getOwnPropertySymbols === "function"
            ? Object.getOwnPropertySymbols(props)
            : []),
        ];
        // This for/of is ok because propKeys is an array
        for (const p of propKeys) {
          // note, use of `any` is due to TypeSript lack of support for symbol in
          // index types
          // tslint:disable-next-line:no-any no symbol in index
          this.createProperty(p, props[p]);
        }
      }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
      const attribute = options.attribute;
      return attribute === false
        ? undefined
        : typeof attribute === "string"
        ? attribute
        : typeof name === "string"
        ? name.toLowerCase()
        : undefined;
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
      return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
      const type = options.type;
      const converter = options.converter || defaultConverter;
      const fromAttribute =
        typeof converter === "function" ? converter : converter.fromAttribute;
      return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
      if (options.reflect === undefined) {
        return;
      }
      const type = options.type;
      const converter = options.converter;
      const toAttribute =
        (converter && converter.toAttribute) || defaultConverter.toAttribute;
      return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
      this._updateState = 0;
      this._updatePromise = new Promise(
        (res) => (this._enableUpdatingResolver = res)
      );
      this._changedProperties = new Map();
      this._saveInstanceProperties();
      // ensures first update will be caught by an early access of
      // `updateComplete`
      this.requestUpdateInternal();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      this.constructor._classProperties.forEach((_v, p) => {
        if (this.hasOwnProperty(p)) {
          const value = this[p];
          delete this[p];
          if (!this._instanceProperties) {
            this._instanceProperties = new Map();
          }
          this._instanceProperties.set(p, value);
        }
      });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      // tslint:disable-next-line:no-any
      this._instanceProperties.forEach((v, p) => (this[p] = v));
      this._instanceProperties = undefined;
    }
    connectedCallback() {
      // Ensure first connection completes an update. Updates cannot complete
      // before connection.
      this.enableUpdating();
    }
    enableUpdating() {
      if (this._enableUpdatingResolver !== undefined) {
        this._enableUpdatingResolver();
        this._enableUpdatingResolver = undefined;
      }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {}
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
      const ctor = this.constructor;
      const attr = ctor._attributeNameForProperty(name, options);
      if (attr !== undefined) {
        const attrValue = ctor._propertyValueToAttribute(value, options);
        // an undefined value does not change the attribute.
        if (attrValue === undefined) {
          return;
        }
        // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting
        this._updateState =
          this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
        // mark state not reflecting
        this._updateState =
          this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
      }
    }
    _attributeToProperty(name, value) {
      // Use tracking info to avoid deserializing attribute value if it was
      // just set from a property setter.
      if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        return;
      }
      const ctor = this.constructor;
      // Note, hint this as an `AttributeMap` so closure clearly understands
      // the type; it has issues with tracking types through statics
      // tslint:disable-next-line:no-unnecessary-type-assertion
      const propName = ctor._attributeToPropertyMap.get(name);
      if (propName !== undefined) {
        const options = ctor.getPropertyOptions(propName);
        // mark state reflecting
        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName] =
          // tslint:disable-next-line:no-any
          ctor._propertyValueFromAttribute(value, options);
        // mark state not reflecting
        this._updateState =
          this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    }
    /**
     * This protected version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    requestUpdateInternal(name, oldValue, options) {
      let shouldRequestUpdate = true;
      // If we have a property key, perform property update steps.
      if (name !== undefined) {
        const ctor = this.constructor;
        options = options || ctor.getPropertyOptions(name);
        if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
          if (!this._changedProperties.has(name)) {
            this._changedProperties.set(name, oldValue);
          }
          // Add to reflecting properties set.
          // Note, it's important that every change has a chance to add the
          // property to `_reflectingProperties`. This ensures setting
          // attribute + property reflects correctly.
          if (
            options.reflect === true &&
            !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)
          ) {
            if (this._reflectingProperties === undefined) {
              this._reflectingProperties = new Map();
            }
            this._reflectingProperties.set(name, options);
          }
        } else {
          // Abort the request if the property should not be considered changed.
          shouldRequestUpdate = false;
        }
      }
      if (!this._hasRequestedUpdate && shouldRequestUpdate) {
        this._updatePromise = this._enqueueUpdate();
      }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
      this.requestUpdateInternal(name, oldValue);
      return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      try {
        // Ensure any previous update has resolved before updating.
        // This `await` also ensures that property changes are batched.
        await this._updatePromise;
      } catch (e) {
        // Ignore any previous errors. We only care that the previous cycle is
        // done. Any error should have been handled in the previous update.
      }
      const result = this.performUpdate();
      // If `performUpdate` returns a Promise, we await it. This is done to
      // enable coordinating updates with a scheduler. Note, the result is
      // checked to avoid delaying an additional microtask unless we need to.
      if (result != null) {
        await result;
      }
      return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }
    get hasUpdated() {
      return this._updateState & STATE_HAS_UPDATED;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
      // Abort any update if one is not pending when this is called.
      // This can happen if `performUpdate` is called early to "flush"
      // the update.
      if (!this._hasRequestedUpdate) {
        return;
      }
      // Mixin instance properties once, if they exist.
      if (this._instanceProperties) {
        this._applyInstanceProperties();
      }
      let shouldUpdate = false;
      const changedProperties = this._changedProperties;
      try {
        shouldUpdate = this.shouldUpdate(changedProperties);
        if (shouldUpdate) {
          this.update(changedProperties);
        } else {
          this._markUpdated();
        }
      } catch (e) {
        // Prevent `firstUpdated` and `updated` from running when there's an
        // update exception.
        shouldUpdate = false;
        // Ensure element can accept additional updates after an exception.
        this._markUpdated();
        throw e;
      }
      if (shouldUpdate) {
        if (!(this._updateState & STATE_HAS_UPDATED)) {
          this._updateState = this._updateState | STATE_HAS_UPDATED;
          this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
      }
    }
    _markUpdated() {
      this._changedProperties = new Map();
      this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
      return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     * @deprecated Override `getUpdateComplete()` instead for forward
     *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
     */
    _getUpdateComplete() {
      return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async getUpdateComplete() {
     *       await super.getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    getUpdateComplete() {
      return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
      return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
      if (
        this._reflectingProperties !== undefined &&
        this._reflectingProperties.size > 0
      ) {
        // Use forEach so this works even if for/of loops are compiled to for
        // loops expecting arrays
        this._reflectingProperties.forEach((v, k) =>
          this._propertyToAttribute(k, this[k], v)
        );
        this._reflectingProperties = undefined;
      }
      this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {}
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {}
  }
  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */
  UpdatingElement[_a] = true;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
  };
  const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
      kind,
      elements,
      // This callback is called once the class is otherwise fully defined
      finisher(clazz) {
        window.customElements.define(tagName, clazz);
      },
    };
  };
  /**
   * Class decorator factory that defines the decorated class as a custom element.
   *
   * ```
   * @customElement('my-element')
   * class MyElement {
   *   render() {
   *     return html``;
   *   }
   * }
   * ```
   * @category Decorator
   * @param tagName The name of the custom element to define.
   */
  const customElement = (tagName) => (classOrDescriptor) =>
    typeof classOrDescriptor === "function"
      ? legacyCustomElement(tagName, classOrDescriptor)
      : standardCustomElement(tagName, classOrDescriptor);
  const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (
      element.kind === "method" &&
      element.descriptor &&
      !("value" in element.descriptor)
    ) {
      return Object.assign(Object.assign({}, element), {
        finisher(clazz) {
          clazz.createProperty(element.key, options);
        },
      });
    } else {
      // createProperty() takes care of defining the property, but we still
      // must return some kind of descriptor, so return a descriptor for an
      // unused prototype field. The finisher calls createProperty().
      return {
        kind: "field",
        key: Symbol(),
        placement: "own",
        descriptor: {},
        // When @babel/plugin-proposal-decorators implements initializers,
        // do this instead of the initializer below. See:
        // https://github.com/babel/babel/issues/9260 extras: [
        //   {
        //     kind: 'initializer',
        //     placement: 'own',
        //     initializer: descriptor.initializer,
        //   }
        // ],
        initializer() {
          if (typeof element.initializer === "function") {
            this[element.key] = element.initializer.call(this);
          }
        },
        finisher(clazz) {
          clazz.createProperty(element.key, options);
        },
      };
    }
  };
  const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
  };
  /**
   * A property decorator which creates a LitElement property which reflects a
   * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
   * supplied to configure property features.
   *
   * This decorator should only be used for public fields. Private or protected
   * fields should use the [[`internalProperty`]] decorator.
   *
   * @example
   * ```ts
   * class MyElement {
   *   @property({ type: Boolean })
   *   clicked = false;
   * }
   * ```
   * @category Decorator
   * @ExportDecoratedItems
   */
  function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) =>
      name !== undefined
        ? legacyProperty(options, protoOrDescriptor, name)
        : standardProperty(options, protoOrDescriptor);
  }

  /**
    @license
    Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
    This code may only be used under the BSD style license found at
    http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
    http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
    found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
    part of the polymer project is also subject to an additional IP rights grant
    found at http://polymer.github.io/PATENTS.txt
    */
  /**
   * Whether the current browser supports `adoptedStyleSheets`.
   */
  const supportsAdoptingStyleSheets =
    window.ShadowRoot &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype;
  const constructionToken = Symbol();
  class CSSResult {
    constructor(cssText, safeToken) {
      if (safeToken !== constructionToken) {
        throw new Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
        );
      }
      this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
      if (this._styleSheet === undefined) {
        // Note, if `supportsAdoptingStyleSheets` is true then we assume
        // CSSStyleSheet is constructable.
        if (supportsAdoptingStyleSheets) {
          this._styleSheet = new CSSStyleSheet();
          this._styleSheet.replaceSync(this.cssText);
        } else {
          this._styleSheet = null;
        }
      }
      return this._styleSheet;
    }
    toString() {
      return this.cssText;
    }
  }
  /**
   * Wrap a value for interpolation in a [[`css`]] tagged template literal.
   *
   * This is unsafe because untrusted CSS text can be used to phone home
   * or exfiltrate data to an attacker controlled site. Take care to only use
   * this with trusted input.
   */
  const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window["litElementVersions"] || (window["litElementVersions"] = [])).push(
    "2.5.0"
  );
  /**
   * Sentinal value used to avoid calling lit-html's render function when
   * subclasses do not implement `render`
   */
  const renderNotImplemented = {};
  /**
   * Base element class that manages element properties and attributes, and
   * renders a lit-html template.
   *
   * To define a component, subclass `LitElement` and implement a
   * `render` method to provide the component's template. Define properties
   * using the [[`properties`]] property or the [[`property`]] decorator.
   */
  class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
      return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
      // Only gather styles once per class
      if (this.hasOwnProperty(JSCompiler_renameProperty("_styles", this))) {
        return;
      }
      // Take care not to call `this.getStyles()` multiple times since this
      // generates new CSSResults each time.
      // TODO(sorvell): Since we do not cache CSSResults by input, any
      // shared styles will generate new stylesheet objects, which is wasteful.
      // This should be addressed when a browser ships constructable
      // stylesheets.
      const userStyles = this.getStyles();
      if (Array.isArray(userStyles)) {
        // De-duplicate styles preserving the _last_ instance in the set.
        // This is a performance optimization to avoid duplicated styles that can
        // occur especially when composing via subclassing.
        // The last item is kept to try to preserve the cascade order with the
        // assumption that it's most important that last added styles override
        // previous styles.
        const addStyles = (styles, set) =>
          styles.reduceRight(
            (set, s) =>
              // Note: On IE set.add() does not return the set
              Array.isArray(s) ? addStyles(s, set) : (set.add(s), set),
            set
          );
        // Array.from does not work on Set in IE, otherwise return
        // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
        const set = addStyles(userStyles, new Set());
        const styles = [];
        set.forEach((v) => styles.unshift(v));
        this._styles = styles;
      } else {
        this._styles = userStyles === undefined ? [] : [userStyles];
      }
      // Ensure that there are no invalid CSSStyleSheet instances here. They are
      // invalid in two conditions.
      // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
      //     this is impossible to check except via .replaceSync or use
      // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
      //     false)
      this._styles = this._styles.map((s) => {
        if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
          // Flatten the cssText from the passed constructible stylesheet (or
          // undetectable non-constructible stylesheet). The user might have
          // expected to update their stylesheets over time, but the alternative
          // is a crash.
          const cssText = Array.prototype.slice
            .call(s.cssRules)
            .reduce((css, rule) => css + rule.cssText, "");
          return unsafeCSS(cssText);
        }
        return s;
      });
    }
    /**
     * Performs element initialization. By default this calls
     * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
     * captures any pre-set values for registered properties.
     */
    initialize() {
      super.initialize();
      this.constructor._getUniqueStyles();
      this.renderRoot = this.createRenderRoot();
      // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
      // element's getRootNode(). While this could be done, we're choosing not to
      // support this now since it would require different logic around de-duping.
      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
      return this.attachShadow(this.constructor.shadowRootOptions);
    }
    /**
     * Applies styling to the element shadowRoot using the [[`styles`]]
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
      const styles = this.constructor._styles;
      if (styles.length === 0) {
        return;
      }
      // There are three separate cases here based on Shadow DOM support.
      // (1) shadowRoot polyfilled: use ShadyCSS
      // (2) shadowRoot.adoptedStyleSheets available: use it
      // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
      // rendering
      if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
          styles.map((s) => s.cssText),
          this.localName
        );
      } else if (supportsAdoptingStyleSheets) {
        this.renderRoot.adoptedStyleSheets = styles.map((s) =>
          s instanceof CSSStyleSheet ? s : s.styleSheet
        );
      } else {
        // This must be done after rendering so the actual style insertion is done
        // in `update`.
        this._needsShimAdoptedStyleSheets = true;
      }
    }
    connectedCallback() {
      super.connectedCallback();
      // Note, first update/render handles styleElement so we only call this if
      // connected after first update.
      if (this.hasUpdated && window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
      // Setting properties in `render` should not trigger an update. Since
      // updates are allowed after super.update, it's important to call `render`
      // before that.
      const templateResult = this.render();
      super.update(changedProperties);
      // If render is not implemented by the component, don't call lit-html render
      if (templateResult !== renderNotImplemented) {
        this.constructor.render(templateResult, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this,
        });
      }
      // When native Shadow DOM is used but adoptedStyles are not supported,
      // insert styling after rendering to ensure adoptedStyles have highest
      // priority.
      if (this._needsShimAdoptedStyleSheets) {
        this._needsShimAdoptedStyleSheets = false;
        this.constructor._styles.forEach((s) => {
          const style = document.createElement("style");
          style.textContent = s.cssText;
          this.renderRoot.appendChild(style);
        });
      }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `NodePart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     */
    render() {
      return renderNotImplemented;
    }
  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */
  LitElement["finalized"] = true;
  /**
   * Reference to the underlying library method used to render the element's
   * DOM. By default, points to the `render` method from lit-html's shady-render
   * module.
   *
   * **Most users will never need to touch this property.**
   *
   * This  property should not be confused with the `render` instance method,
   * which should be overridden to define a template for the element.
   *
   * Advanced users creating a new base class based on LitElement can override
   * this property to point to a custom render method with a signature that
   * matches [shady-render's `render`
   * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
   *
   * @nocollapse
   */
  LitElement.render = render;
  /** @nocollapse */
  LitElement.shadowRootOptions = { mode: "open" };

  async function timeout(promise, ms = 60000) {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"));
      }, ms);
      resolve(await promise);
    });
  }

  async function QueryServer2(query, name = null) {
    //
    // TODO! Use it (rename + verify & fix the code that use the QueryServer function) or remove it.
    //       It fixes the problem with datetime data type in json result.
    //       Parses ISO-8601 compliant date-time strings and returns Date objects.
    //
    var qName = name ? name : query.constructor.name;
    document.dispatchEvent(new CustomEvent("ServerQueryStarted"));
    try {
      const promise = fetch(`/q/${qName}`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(query, handelSerializer), // body data type must match "Content-Type" header
      });
      let res = await timeout(promise);
      let text = await res.text();
      let dateRegExp = new RegExp(
        /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/
      );
      return JSON.parse(text, (key, value) => {
        if (typeof value === "string") {
          // Parse ISO-8601 date strings
          let result = dateRegExp.exec(value);
          if (result) {
            return new Date(value);
          }
        }
        return value;
      });
    } catch (e) {
      document.dispatchEvent(new CustomEvent("ServerQueryFailed"));
      console.error(e);
      throw e;
    } finally {
      document.dispatchEvent(new CustomEvent("ServerQueryEnded"));
    }
  }
  function handelSerializer(key, value) {
    if (key) {
      return this[key] instanceof Date ? datetostring(this[key]) : value;
    }
    return value;
  }
  function datetostring(val) {
    let pad = (num) => num.toString().padStart(2, "0");
    let ret = `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(
      val.getDate()
    )}T${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(
      val.getSeconds()
    )}`;
    return ret;
  }

  class TemplateRetriever {
    constructor() {
      this.templates = new Map();
    }
    async getTemplateFromTemplateId(templateId) {
      if (!this.templates.has(templateId)) {
        this.templates.set(
          templateId,
          QueryServer2(
            new GetTemplateDataQuery({
              TemplateId: templateId,
            })
          )
        );
      }
      return await this.templates.get(templateId);
    }
    async getTemplateId(scopeId, dataStreamid, dataItemType) {
      return await QueryServer2(
        new GetDetailViewTemplateIdQuery({
          ScopeId: scopeId,
          DateStreamId: dataStreamid,
          DataItemType: dataItemType,
        })
      );
    }
  }
  class GetTemplateDataQuery {
    constructor(init) {
      Object.assign(this, init);
    }
  }
  class GetDetailViewTemplateIdQuery {
    constructor(init) {
      Object.assign(this, init);
    }
  }

  function cancelclick() {
    return function (target, propertyKey, descriptor) {
      let c = (e) => {
        e.stopImmediatePropagation();
        return false;
      };
      let prev = descriptor.value;
      descriptor.value = function () {
        this.addEventListener("pointerdown", c);
        this.addEventListener("pointerup", c);
        prev.apply(this, arguments);
      };
    };
  }

  class Guid {
    constructor(...params) {
      switch (params.length) {
        case 0:
          this._id = this.createId();
          break;
        case 1:
          this._id = this.verifyOrDie(params[0]);
          break;
      }
    }
    toString() {
      return this._id;
    }
    createId() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    verifyOrDie(value) {
      if (
        value.match(
          /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
        )
      ) {
        return value.toUpperCase();
      }
      throw `${value} is not a legal Guid`;
    }
    static newGuid() {
      return new Guid();
    }
    static get empty() {
      if (!Guid._empty) {
        Guid._empty = new Guid("00000000-0000-0000-0000-000000000000");
      }
      return Guid._empty;
    }
  }
  Guid._empty = null;

  function MakeIm(o) {
    return Object.freeze(o);
  }

  if (!LitElement.prototype.raiseEvent) {
    LitElement.prototype.raiseEvent = function (name, value) {
      this.dispatchEvent(
        new CustomEvent(name, {
          detail: MakeIm(value),
          bubbles: true,
          cancelable: true,
          composed: true,
        })
      );
    };
  }
  if (!LitElement.prototype.cancelEventPropagation) {
    LitElement.prototype.cancelEventPropagation = function (e) {
      e.cancelBubble = true;
      e.stopImmediatePropagation();
      e.stopPropagation();
    };
  }
  if (!LitElement.prototype.getShadowRoot) {
    LitElement.prototype.getShadowRoot = function () {
      return this.getRootNode().host.shadowRoot;
    };
  }
  if (!LitElement.prototype.addVisibilityChangedObserver) {
    LitElement.prototype.addVisibilityChangedObserver = function (
      element,
      visibilityChangedCallback
    ) {
      let observer;
      observer = new IntersectionObserver((io) => {
        if (io?.length > 0) {
          visibilityChangedCallback(io[0].isIntersecting);
        }
      });
      observer.observe(element);
      let id = `_${Guid.newGuid().toString()}`;
      this[id] = observer;
      return () => {
        observer.disconnect();
        this[id] = null;
      };
    };
  }
  if (!LitElement.prototype.addPropertyChangedObserver) {
    /**
     * To use this feature override the method attributeChangedCallback(name, oldVal, newVal) in your
     * derived class and call the PropertyChangedObserver method invoke (return value from this method).
     *
     */
    LitElement.prototype.addPropertyChangedObserver = function (...args) {
      let observers = {};
      for (let arg of args) {
        observers[arg.property.toLowerCase()] = arg.callback;
      }
      return {
        invoke: (property, oldValue, newValue) => {
          if (observers[property]) {
            observers[property](oldValue, newValue);
          }
        },
      };
    };
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Helper functions for manipulating parts
  // TODO(kschaaf): Refactor into Part API?
  const createAndInsertPart = (containerPart, beforePart) => {
    const container = containerPart.startNode.parentNode;
    const beforeNode =
      beforePart === undefined ? containerPart.endNode : beforePart.startNode;
    const startNode = container.insertBefore(createMarker(), beforeNode);
    container.insertBefore(createMarker(), beforeNode);
    const newPart = new NodePart(containerPart.options);
    newPart.insertAfterNode(startNode);
    return newPart;
  };
  const updatePart = (part, value) => {
    part.setValue(value);
    part.commit();
    return part;
  };
  const insertPartBefore = (containerPart, part, ref) => {
    const container = containerPart.startNode.parentNode;
    const beforeNode = ref ? ref.startNode : containerPart.endNode;
    const endNode = part.endNode.nextSibling;
    if (endNode !== beforeNode) {
      reparentNodes(container, part.startNode, endNode, beforeNode);
    }
  };
  const removePart = (part) => {
    removeNodes(
      part.startNode.parentNode,
      part.startNode,
      part.endNode.nextSibling
    );
  };
  // Helper for generating a map of array item to its index over a subset
  // of an array (used to lazily generate `newKeyToIndexMap` and
  // `oldKeyToIndexMap`)
  const generateMap = (list, start, end) => {
    const map = new Map();
    for (let i = start; i <= end; i++) {
      map.set(list[i], i);
    }
    return map;
  };
  // Stores previous ordered list of parts and map of key to index
  const partListCache = new WeakMap();
  const keyListCache = new WeakMap();
  /**
   * A directive that repeats a series of values (usually `TemplateResults`)
   * generated from an iterable, and updates those items efficiently when the
   * iterable changes based on user-provided `keys` associated with each item.
   *
   * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
   * meaning previous DOM for a given key is moved into the new position if
   * needed, and DOM will never be reused with values for different keys (new DOM
   * will always be created for new keys). This is generally the most efficient
   * way to use `repeat` since it performs minimum unnecessary work for insertions
   * and removals.
   *
   * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
   * given call to `repeat`. The behavior when two or more items have the same key
   * is undefined.
   *
   * If no `keyFn` is provided, this directive will perform similar to mapping
   * items to values, and DOM will be reused against potentially different items.
   */
  const repeat = directive((items, keyFnOrTemplate, template) => {
    let keyFn;
    if (template === undefined) {
      template = keyFnOrTemplate;
    } else if (keyFnOrTemplate !== undefined) {
      keyFn = keyFnOrTemplate;
    }
    return (containerPart) => {
      if (!(containerPart instanceof NodePart)) {
        throw new Error("repeat can only be used in text bindings");
      }
      // Old part & key lists are retrieved from the last update
      // (associated with the part for this instance of the directive)
      const oldParts = partListCache.get(containerPart) || [];
      const oldKeys = keyListCache.get(containerPart) || [];
      // New part list will be built up as we go (either reused from
      // old parts or created for new keys in this update). This is
      // saved in the above cache at the end of the update.
      const newParts = [];
      // New value list is eagerly generated from items along with a
      // parallel array indicating its key.
      const newValues = [];
      const newKeys = [];
      let index = 0;
      for (const item of items) {
        newKeys[index] = keyFn ? keyFn(item, index) : index;
        newValues[index] = template(item, index);
        index++;
      }
      // Maps from key to index for current and previous update; these
      // are generated lazily only when needed as a performance
      // optimization, since they are only required for multiple
      // non-contiguous changes in the list, which are less common.
      let newKeyToIndexMap;
      let oldKeyToIndexMap;
      // Head and tail pointers to old parts and new values
      let oldHead = 0;
      let oldTail = oldParts.length - 1;
      let newHead = 0;
      let newTail = newValues.length - 1;
      // Overview of O(n) reconciliation algorithm (general approach
      // based on ideas found in ivi, vue, snabbdom, etc.):
      //
      // * We start with the list of old parts and new values (and
      //   arrays of their respective keys), head/tail pointers into
      //   each, and we build up the new list of parts by updating
      //   (and when needed, moving) old parts or creating new ones.
      //   The initial scenario might look like this (for brevity of
      //   the diagrams, the numbers in the array reflect keys
      //   associated with the old parts or new values, although keys
      //   and parts/values are actually stored in parallel arrays
      //   indexed using the same head/tail pointers):
      //
      //      oldHead v                 v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [ ,  ,  ,  ,  ,  ,  ]
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
      //                                      item order
      //      newHead ^                 ^ newTail
      //
      // * Iterate old & new lists from both sides, updating,
      //   swapping, or removing parts at the head/tail locations
      //   until neither head nor tail can move.
      //
      // * Example below: keys at head pointers match, so update old
      //   part 0 in-place (no need to move it) and record part 0 in
      //   the `newParts` list. The last thing we do is advance the
      //   `oldHead` and `newHead` pointers (will be reflected in the
      //   next diagram).
      //
      //      oldHead v                 v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
      //                                      & newHead
      //      newHead ^                 ^ newTail
      //
      // * Example below: head pointers don't match, but tail
      //   pointers do, so update part 6 in place (no need to move
      //   it), and record part 6 in the `newParts` list. Last,
      //   advance the `oldTail` and `oldHead` pointers.
      //
      //         oldHead v              v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldTail
      //                                      & newTail
      //         newHead ^              ^ newTail
      //
      // * If neither head nor tail match; next check if one of the
      //   old head/tail items was removed. We first need to generate
      //   the reverse map of new keys to index (`newKeyToIndexMap`),
      //   which is done once lazily as a performance optimization,
      //   since we only hit this case if multiple non-contiguous
      //   changes were made. Note that for contiguous removal
      //   anywhere in the list, the head and tails would advance
      //   from either end and pass each other before we get to this
      //   case and removals would be handled in the final while loop
      //   without needing to generate the map.
      //
      // * Example below: The key at `oldTail` was removed (no longer
      //   in the `newKeyToIndexMap`), so remove that part from the
      //   DOM and advance just the `oldTail` pointer.
      //
      //         oldHead v           v oldTail
      //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
      //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map: remove
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    5 and advance oldTail
      //         newHead ^           ^ newTail
      //
      // * Once head and tail cannot move, any mismatches are due to
      //   either new or moved items; if a new key is in the previous
      //   "old key to old index" map, move the old part to the new
      //   location, otherwise create and insert a new part. Note
      //   that when moving an old part we null its position in the
      //   oldParts array if it lies between the head and tail so we
      //   know to skip it when the pointers get there.
      //
      // * Example below: neither head nor tail match, and neither
      //   were removed; so find the `newHead` key in the
      //   `oldKeyToIndexMap`, and move that old part's DOM into the
      //   next head position (before `oldParts[oldHead]`). Last,
      //   null the part in the `oldPart` array since it was
      //   somewhere in the remaining oldParts still to be scanned
      //   (between the head and tail pointers) so that we know to
      //   skip that old part on future iterations.
      //
      //         oldHead v        v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck: update & move 2
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    into place and advance
      //                                      newHead
      //         newHead ^           ^ newTail
      //
      // * Note that for moves/insertions like the one above, a part
      //   inserted at the head pointer is inserted before the
      //   current `oldParts[oldHead]`, and a part inserted at the
      //   tail pointer is inserted before `newParts[newTail+1]`. The
      //   seeming asymmetry lies in the fact that new parts are
      //   moved into place outside in, so to the right of the head
      //   pointer are old parts, and to the right of the tail
      //   pointer are new parts.
      //
      // * We always restart back from the top of the algorithm,
      //   allowing matching and simple updates in place to
      //   continue...
      //
      // * Example below: the head pointers once again match, so
      //   simply update part 1 and record it in the `newParts`
      //   array.  Last, advance both head pointers.
      //
      //         oldHead v        v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched: update 1
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
      //                                      & newHead
      //            newHead ^        ^ newTail
      //
      // * As mentioned above, items that were moved as a result of
      //   being stuck (the final else clause in the code below) are
      //   marked with null, so we always advance old pointers over
      //   these so we're comparing the next actual old value on
      //   either end.
      //
      // * Example below: `oldHead` is null (already placed in
      //   newParts), so advance `oldHead`.
      //
      //            oldHead v     v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6] <- old head already used:
      //   newParts: [0, 2, 1,  ,  ,  , 6]    advance oldHead
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
      //               newHead ^     ^ newTail
      //
      // * Note it's not critical to mark old parts as null when they
      //   are moved from head to tail or tail to head, since they
      //   will be outside the pointer range and never visited again.
      //
      // * Example below: Here the old tail key matches the new head
      //   key, so the part at the `oldTail` position and move its
      //   DOM to the new head position (before `oldParts[oldHead]`).
      //   Last, advance `oldTail` and `newHead` pointers.
      //
      //               oldHead v  v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]   head: update & move 4,
      //                                     advance oldTail & newHead
      //               newHead ^     ^ newTail
      //
      // * Example below: Old and new head keys match, so update the
      //   old head part in place, and advance the `oldHead` and
      //   `newHead` pointers.
      //
      //               oldHead v oldTail
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance oldHead &
      //                                      newHead
      //                  newHead ^  ^ newTail
      //
      // * Once the new or old pointers move past each other then all
      //   we have left is additions (if old list exhausted) or
      //   removals (if new list exhausted). Those are handled in the
      //   final while loops at the end.
      //
      // * Example below: `oldHead` exceeded `oldTail`, so we're done
      //   with the main loop.  Create the remaining part and insert
      //   it at the new head position, and the update is complete.
      //
      //                   (oldHead > oldTail)
      //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
      //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
      //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
      //                     newHead ^ newTail
      //
      // * Note that the order of the if/else clauses is not
      //   important to the algorithm, as long as the null checks
      //   come first (to ensure we're always working on valid old
      //   parts) and that the final else clause comes last (since
      //   that's where the expensive moves occur). The order of
      //   remaining clauses is is just a simple guess at which cases
      //   will be most common.
      //
      // * TODO(kschaaf) Note, we could calculate the longest
      //   increasing subsequence (LIS) of old items in new position,
      //   and only move those not in the LIS set. However that costs
      //   O(nlogn) time and adds a bit more code, and only helps
      //   make rare types of mutations require fewer moves. The
      //   above handles removes, adds, reversal, swaps, and single
      //   moves of contiguous items in linear time, in the minimum
      //   number of moves. As the number of multiple moves where LIS
      //   might help approaches a random shuffle, the LIS
      //   optimization becomes less helpful, so it seems not worth
      //   the code at this point. Could reconsider if a compelling
      //   case arises.
      while (oldHead <= oldTail && newHead <= newTail) {
        if (oldParts[oldHead] === null) {
          // `null` means old part at head has already been used
          // below; skip
          oldHead++;
        } else if (oldParts[oldTail] === null) {
          // `null` means old part at tail has already been used
          // below; skip
          oldTail--;
        } else if (oldKeys[oldHead] === newKeys[newHead]) {
          // Old head matches new head; update in place
          newParts[newHead] = updatePart(oldParts[oldHead], newValues[newHead]);
          oldHead++;
          newHead++;
        } else if (oldKeys[oldTail] === newKeys[newTail]) {
          // Old tail matches new tail; update in place
          newParts[newTail] = updatePart(oldParts[oldTail], newValues[newTail]);
          oldTail--;
          newTail--;
        } else if (oldKeys[oldHead] === newKeys[newTail]) {
          // Old head matches new tail; update and move to new tail
          newParts[newTail] = updatePart(oldParts[oldHead], newValues[newTail]);
          insertPartBefore(
            containerPart,
            oldParts[oldHead],
            newParts[newTail + 1]
          );
          oldHead++;
          newTail--;
        } else if (oldKeys[oldTail] === newKeys[newHead]) {
          // Old tail matches new head; update and move to new head
          newParts[newHead] = updatePart(oldParts[oldTail], newValues[newHead]);
          insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
          oldTail--;
          newHead++;
        } else {
          if (newKeyToIndexMap === undefined) {
            // Lazily generate key-to-index maps, used for removals &
            // moves below
            newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
            oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
          }
          if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
            // Old head is no longer in new list; remove
            removePart(oldParts[oldHead]);
            oldHead++;
          } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
            // Old tail is no longer in new list; remove
            removePart(oldParts[oldTail]);
            oldTail--;
          } else {
            // Any mismatches at this point are due to additions or
            // moves; see if we have an old part we can reuse and move
            // into place
            const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
            const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;
            if (oldPart === null) {
              // No old part for this value; create a new one and
              // insert it
              const newPart = createAndInsertPart(
                containerPart,
                oldParts[oldHead]
              );
              updatePart(newPart, newValues[newHead]);
              newParts[newHead] = newPart;
            } else {
              // Reuse old part
              newParts[newHead] = updatePart(oldPart, newValues[newHead]);
              insertPartBefore(containerPart, oldPart, oldParts[oldHead]);
              // This marks the old part as having been used, so that
              // it will be skipped in the first two checks above
              oldParts[oldIndex] = null;
            }
            newHead++;
          }
        }
      }
      // Add parts for any remaining new values
      while (newHead <= newTail) {
        // For all remaining additions, we insert before last new
        // tail, since old pointers are no longer valid
        const newPart = createAndInsertPart(
          containerPart,
          newParts[newTail + 1]
        );
        updatePart(newPart, newValues[newHead]);
        newParts[newHead++] = newPart;
      }
      // Remove any remaining unused old parts
      while (oldHead <= oldTail) {
        const oldPart = oldParts[oldHead++];
        if (oldPart !== null) {
          removePart(oldPart);
        }
      }
      // Save order of new parts for next round
      partListCache.set(containerPart, newParts);
      keyListCache.set(containerPart, newKeys);
    };
  });

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const _state = new WeakMap();
  // Effectively infinity, but a SMI.
  const _infinity = 0x7fffffff;
  /**
   * Renders one of a series of values, including Promises, to a Part.
   *
   * Values are rendered in priority order, with the first argument having the
   * highest priority and the last argument having the lowest priority. If a
   * value is a Promise, low-priority values will be rendered until it resolves.
   *
   * The priority of values can be used to create placeholder content for async
   * data. For example, a Promise with pending content can be the first,
   * highest-priority, argument, and a non_promise loading indicator template can
   * be used as the second, lower-priority, argument. The loading indicator will
   * render immediately, and the primary content will render when the Promise
   * resolves.
   *
   * Example:
   *
   *     const content = fetch('./content.txt').then(r => r.text());
   *     html`${until(content, html`<span>Loading...</span>`)}`
   */
  const until = directive((...args) => (part) => {
    let state = _state.get(part);
    if (state === undefined) {
      state = {
        lastRenderedIndex: _infinity,
        values: [],
      };
      _state.set(part, state);
    }
    const previousValues = state.values;
    let previousLength = previousValues.length;
    state.values = args;
    for (let i = 0; i < args.length; i++) {
      // If we've rendered a higher-priority value already, stop.
      if (i > state.lastRenderedIndex) {
        break;
      }
      const value = args[i];
      // Render non-Promise values immediately
      if (isPrimitive(value) || typeof value.then !== "function") {
        part.setValue(value);
        state.lastRenderedIndex = i;
        // Since a lower-priority value will never overwrite a higher-priority
        // synchronous value, we can stop processing now.
        break;
      }
      // If this is a Promise we've already handled, skip it.
      if (i < previousLength && value === previousValues[i]) {
        continue;
      }
      // We have a Promise that we haven't seen before, so priorities may have
      // changed. Forget what we rendered before.
      state.lastRenderedIndex = _infinity;
      previousLength = 0;
      Promise.resolve(value).then((resolvedValue) => {
        const index = state.values.indexOf(value);
        // If state.values doesn't contain the value, we've re-rendered without
        // the value, so don't render it. Then, only render if the value is
        // higher-priority than what's already been rendered.
        if (index > -1 && index < state.lastRenderedIndex) {
          state.lastRenderedIndex = index;
          part.setValue(resolvedValue);
          part.commit();
        }
      });
    }
  });

  class DataValidator {
    static isEmpty(value) {
      return value === null || value === "" || value === undefined;
    }
    static isEmptyDataWithLabel(data, label) {
      let missingValue = this.isEmpty(data);
      return missingValue && label.includes("!") ? true : false;
    }
    static isValidData(data, field) {
      try {
        return this.isEmptyDataWithLabel(data, field.Label);
      } catch (error) {
        console.log(
          `Error in field type ${field.Type}, check that label: %c${field.Label}%c and value: %c${field.Value}%c are correct.`,
          "color: red",
          "color: black",
          "color: red",
          error
        );
        console.log(error.message);
      }
    }
    static isNumber(number) {
      return /^[0-9,.]*$/.test(number);
    }
    static isValidFormat(format) {
      return !this.isEmpty(format);
    }
    static getValidFormat(format) {
      let tempFormat = this.isValidFormat(format) ? format : "";
      return tempFormat;
    }
  }

  class CheckboxService {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getCheckboxWithLabel(data, field) {
      let label = field.Label;
      let temp = this._dataHelper.getDataFromField(data, field);
      let isEmpty = DataValidator.isEmpty(temp);
      if (isEmpty) {
        temp = "false";
      }
      temp = temp.toLowerCase();
      let checkbox =
        temp === "true" || temp === "yes"
          ? html`<input type="checkbox" checked />`
          : html`<input type="checkbox" />`;
      let text = html`<div class="checkboxContainer">
        ${checkbox}
        <span class="checkmark"></span>
        <span class="${field.Format}">${label}</span>
      </div> `;
      return this._dataHelper.outputValidator(data, field, text);
    }
  }

  var PeriodTypes;
  (function (PeriodTypes) {
    PeriodTypes["Hour"] = "Hour";
    PeriodTypes["Day"] = "Day";
    PeriodTypes["Week"] = "Week";
    PeriodTypes["Month"] = "Month";
    PeriodTypes["Year"] = "Year";
  })(PeriodTypes || (PeriodTypes = {}));

  //1. dow = monday
  //1. woy = first 4 days
  function calculateWeekNo(d) {
    let dayMap = [6, 0, 1, 2, 3, 4, 5];
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let dow = dayMap[d.getDay()];
    let mondayInWeek = Date.UTC(year, month, day - dow);
    let jan1st = new Date(Date.UTC(year, 0, 1));
    let jan1stDow = dayMap[jan1st.getDay()];
    let firstMondayOfYear =
      jan1stDow < 4
        ? Date.UTC(year - 1, 11, 32 - jan1stDow)
        : Date.UTC(year, 0, 7 - jan1stDow);
    let diff = mondayInWeek - firstMondayOfYear;
    return Math.floor(1 + diff / 604800000);
  }

  /**
   * Date format patterns:
   *
   *  Pattern  Description
   *  -------  --------------------------------------------------------------
   *  'yy'     year given with two digits, e.g. 19
   *  'yyyy'   year given with four digits, e.g. 2019
   *
   *  'M'      month without leading zero, e.g. 6
   *  'MM'     month with leading zero, e.g. 06
   *  'MMM'    abbreviated month name, three letters, e.g. Jun
   *  'MMMM'   month name, e.g. June
   *
   *  'd'      day without leading zero, e.g. 7
   *  'dd'     day with leading zero, e.g. 07
   *  'ddd'    abbreviated name of weekday, e.g. Mon
   *  'dddd'   weekday name, e.g. Monday
   *
   *  'h'      12 hour clock without leading zero, e.g. 2
   *  'hh'     12 hour clock with leading zero, e.g. 02
   *
   *  'H'      24 hour clock without leading zero, e.g. 2
   *  'HH'     24 hour clock with leading zero, e.g. 02
   *
   *  'm'      minute without leading zero, e.g. 9
   *  'mm'     minute with leading zero, e.g. 09
   *
   *  's'      second without leding zero, e.g. 8.
   *  'ss'     second with leading zero, e.g. 08
   *
   *  't'      first char in day period designator, i.e. am/pm, e.g. a or p
   *  'tt'     name of the day period designator, i.e. am or pm
   *
   *  'w'      week number without leading zero
   *  'ww'     week number with leading zero
   */
  class DateFormatter {
    constructor(locale = null) {
      this._dateFormatMap = new Map();
      this._locale = locale ? locale : this.getCurrentLocale();
    }
    /**
     * Converts the date object to its equivalent string representation.
     *
     * @param date the date
     * @param format string with date directives.
     * @returns (string) the date object's string representation formatted using the format argument.
     */
    dateFormat(date, format) {
      // Check if the format is an already preprocessed date format instance.
      let dateFormat = this._dateFormatMap.get(format);
      if (!dateFormat) {
        dateFormat = this.parseDateFormat(format);
        this._dateFormatMap.set(format, dateFormat);
      }
      // Do the actual converting of the date specified with the options string to a date string
      // result array.
      let dateTimeFormatResults = Intl.DateTimeFormat(
        this._locale,
        dateFormat.options
      ).formatToParts(date);
      // Now, set the result into the date format array, before...
      let processResult = (dateFormatResult, value) => {
        if (dateFormatResult.postProcess) {
          return dateFormatResult.postProcess(value);
        }
        return value;
      };
      let resultData = dateFormat.createResultData();
      dateTimeFormatResults.forEach((df) => {
        let dateFormatResult = dateFormat.getDateFormatData(df.type);
        if (dateFormatResult) {
          resultData[dateFormatResult.index] = processResult(
            dateFormatResult,
            df.value
          );
        }
      });
      //..., adding special directives, like week number, before...
      dateFormat
        .getSpecialDirectives()
        .forEach(
          (dateFormatResult) =>
            (resultData[dateFormatResult.index] = processResult(
              dateFormatResult,
              dateFormatResult.specialDirective(date)
            ))
        );
      // ... concatenating the date format strings. Remove null cells, if any, from the array.
      return [...resultData.filter((v) => v)].join("");
    }
    //-------------------------------------------------------------------------
    //
    //  Private Methods...
    //
    //-------------------------------------------------------------------------
    getCurrentLocale() {
      if (window.navigator.languages) {
        return window.navigator.languages[0];
      } else {
        return window.navigator.language;
      }
    }
    parseDateFormat(format) {
      /*
       * Converts the string format to a date formatted data object.
       */
      let length = format.length;
      let result = new DateFormatData();
      let position = 0;
      let literalPosition = 0;
      while (position < length) {
        let dateOption = dateOptions[format[position]];
        if (dateOption) {
          // The char matches the first character in a date directive.
          // Return the length of the number of repetetive chars.
          let patternLength = this.parseRepeatPattern(
            format,
            format[position],
            position,
            length
          );
          let pattern = format.substr(position, patternLength);
          let optionsMatched = dateOption[pattern];
          if (optionsMatched) {
            // The string matched a date format directive.
            if (literalPosition != position) {
              // Store the literals so far.
              result.addLiteral(
                format.substr(literalPosition, position - literalPosition)
              );
            }
            // Store the directive. Used when formatting the date to the
            // specified format.
            let specialDirective = optionsMatched.specialDirective;
            let postProcessResult = optionsMatched.postProcess;
            if (specialDirective) {
              result.addSpecialDirective(specialDirective, postProcessResult);
            } else {
              let entries = Object.entries(optionsMatched.options);
              let [key, value] = entries[0];
              result.addOptions(key, entries, postProcessResult);
            }
            if (dateOption.localeExtention) {
              // Do we have som special locale extentions
              dateOption.localeExtention.forEach((le) =>
                result.addExtention(le)
              );
            }
            position += patternLength;
            literalPosition = position;
            continue;
          }
        }
        position++;
      }
      if (literalPosition != position) {
        result.addLiteral(
          format.substr(literalPosition, position - literalPosition)
        );
      }
      return result;
    }
    parseRepeatPattern(format, patternChar, position, length) {
      let index = position + 1;
      while (index < length && format[index] == patternChar) {
        index++;
      }
      return index - position;
    }
  }
  //-------------------------------------------------------------------------
  //
  //  Local Variables...
  //
  //-------------------------------------------------------------------------
  let dateOptions = {
    y: {
      yy: { options: { year: "2-digit" }, postProcess: verifyLeadingZero },
      yyyy: { options: { year: "numeric" } },
    },
    M: {
      M: { options: { month: "numeric" } },
      MM: { options: { month: "2-digit" }, postProcess: verifyLeadingZero },
      MMM: { options: { month: "short" } },
      MMMM: { options: { month: "long" } },
    },
    d: {
      d: { options: { day: "numeric" } },
      dd: { options: { day: "2-digit" }, postProcess: verifyLeadingZero },
      ddd: { options: { weekday: "short" } },
      dddd: { options: { weekday: "long" } },
    },
    h: {
      h: { options: { hour: "numeric", hourCycle: "h11" } },
      hh: {
        options: { hour: "2-digit", hourCycle: "h11" },
        postProcess: verifyLeadingZero,
      },
    },
    H: {
      H: {
        options: { hour: "numeric", hourCycle: "h23" },
        postProcess: removeLeadingZero,
      },
      HH: {
        options: { hour: "2-digit", hourCycle: "h23" },
        postProcess: verifyLeadingZero,
      },
    },
    m: {
      m: { options: { minute: "numeric" } },
      mm: { options: { minute: "2-digit" }, postProcess: verifyLeadingZero },
    },
    s: {
      s: { options: { second: "numeric" } },
      ss: { options: { second: "2-digit" }, postProcess: verifyLeadingZero },
    },
    t: {
      t: {
        options: { dayPeriod: "dayPeriod" },
        postProcess: abbreviateTimeDesignator,
      },
      tt: { options: { dayPeriod: "dayPeriod" } },
    },
    w: {
      w: { options: null, specialDirective: getWeekNumber },
      ww: {
        options: null,
        specialDirective: getWeekNumber,
        postProcess: verifyLeadingZero,
      },
    },
  };
  class DateFormatResultData {
    constructor(index, specialDirective, postProcess) {
      this.index = index;
      this.specialDirective = specialDirective;
      this.postProcess = postProcess;
    }
  }
  /*
   * Date format pre-formatted.
   */
  class DateFormatData {
    constructor() {
      this._options = {};
      this._literals = [];
      this._optionsMap = new Map();
      this._specialDirectives = [];
      this._index = 0;
    }
    get options() {
      return this._options;
    }
    getDateFormatData(directive) {
      return this._optionsMap.get(directive);
    }
    getSpecialDirectives() {
      return this._specialDirectives;
    }
    addLiteral(literal) {
      this._literals.push({ index: this._index++, value: literal });
    }
    addSpecialDirective(specialDirective, postProcessResult) {
      this._specialDirectives.push(
        new DateFormatResultData(
          this._index++,
          specialDirective,
          postProcessResult
        )
      );
    }
    addOptions(directive, entries, postProcessResult) {
      this._optionsMap.set(
        directive,
        new DateFormatResultData(this._index++, null, postProcessResult)
      );
      for (let [key, value] of entries) {
        this._options[key] = value;
      }
    }
    addExtention(extention) {
      this._optionsMap.set(
        extention,
        new DateFormatResultData(this._index++, null, null)
      );
    }
    createResultData() {
      let result = new Array(this._index++);
      this._literals.forEach(
        (literal) => (result[literal.index] = literal.value)
      );
      return result;
    }
  }
  //-------------------------------------------------------------------------
  //
  //  Local Functions...
  //
  //-------------------------------------------------------------------------
  function removeLeadingZero(r) {
    return r.replace(/^0/, "");
  }
  function verifyLeadingZero(r) {
    return r.replace(/^(\d)$/, "0$1");
  }
  function abbreviateTimeDesignator(r) {
    return r[0];
  }
  function getWeekNumber(date) {
    return calculateWeekNo(date).toString();
  }

  class DateService {
    constructor(dataHelper) {
      this._dateFormatter = null;
      this._dataHelper = dataHelper;
      this._dateFormatter = new DateFormatter();
    }
    getDate(data, field) {
      let date = data[field.Value];
      if (field.Value.includes(".")) {
        let objectToSplit = field.Value.split(".");
        let object = objectToSplit[0];
        let value = objectToSplit[1];
        let dataObject = data[object];
        date = dataObject[value];
      }
      if (date === undefined || date === "" || date === null) {
        try {
          let text = html`${this._dataHelper.toggleLabel(field)}
            <span class="${field.Format}"></span>`;
          return this._dataHelper.outputValidator(data, field, text);
        } catch (error) {
          console.log(error.message);
        }
      }
      try {
        let formatedDate = this._dateFormatter.dateFormat(
          new Date(date),
          field.Format
        );
        let text = html`${this._dataHelper.toggleLabel(field)}
          <span class="${field.Format}">${formatedDate}</span>`;
        return this._dataHelper.outputValidator(data, field, text);
      } catch (error) {
        console.log(`Error in field ${field.Type}:`, error.message);
        if (error instanceof RangeError) {
          console.log(
            "Possible solutions: Value does not exist in dataset, or typos in template properties"
          );
        }
      }
    }
    getDateNoLabel(data, field) {
      let date = this._dateFormatter.dateFormat(
        new Date(data[field.Value]),
        field.Format
      );
      let text = html`<span class="${field.Format}">${date}</span>`;
      return html`<span id="${field.Id}" class="FieldType_${field.Type}"
        >${text}</span
      >`;
    }
  }

  class IconService {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getIconWithLabel(data, field) {
      let label = field.Label;
      let icon = field.Value;
      let text = html`<img src=${icon} alt="${label}" />
        <span class="${field.Format}">${label}</span>`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getLineSeperator(data, field) {
      return html`<span id="${field.Id}" class="FieldType_${field.Type}"
        ><div class="border"></div
      ></span>`;
    }
    getEmptyLine(data, field) {
      return html`<span id="${field.Id}" class="FieldType_${field.Type}"
        >Placeholder</span
      >`;
    }
  }

  class LinkService {
    static getLinktoHTML(data, field) {
      return html`<span class="label">${field.Label} </span>
        <a class="${field.Format}" href="url" target="_blank"
          >${data[field.Value]}</a
        >`;
    }
  }

  class ListService {
    static getSortedList(list, section) {
      let sortorder = section.Options.SortOrder;
      if (section.Options.SortOrder == undefined) {
        return list;
      }
      let sortValue = section.Fields[0].Value;
      switch (sortorder) {
        case "Asc": {
          return this.sortList(list, sortValue, 1);
        }
        case "Desc": {
          return this.sortList(list, sortValue, -1);
        }
        default: {
          return list;
        }
      }
    }
    static sortList(list, sortValue, number) {
      return list.sort(
        (a, b) => number * a[sortValue].localeCompare(b[sortValue])
      );
    }
  }

  class ObjectService {
    static getObjectValuesWithDevider(data, field) {
      let objectToSplit = field.Value.split(" ");
      let object = objectToSplit[0];
      let devider = objectToSplit[1];
      let dataObject = data[object];
      let code = dataObject["Code"];
      let name = dataObject["Name"];
      return html`<span class="label">${field.Label}</span>
        <span class="${field.Format}">${code} ${devider} ${name}</span>`;
    }
  }

  class DataFormatter$1 {
    static getTextSpanWithFormatting(data, field) {
      return html` <span class="text ${field.Format}"> ${data} </span>`;
    }
    static encapsulateFieldTypeOutputInSpan(data, field) {
      return html`<span id="${field.Id}" class="FieldType_${field.Type}"
        >${data}</span
      >`;
    }
    static encapsulateTextInSpanWithClass(data, className) {
      return html`<span class="${className}">${data}</span>`;
    }
  }

  class TextService {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getTextOneLine(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field);
      let dataSpan = DataFormatter$1.encapsulateTextInSpanWithClass(
        tempData,
        "text " + field.Format
      );
      let text = html`${this._dataHelper.toggleLabel(field)} ${dataSpan}`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getTextTwoLines(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field);
      let labelSpan = this._dataHelper.toggleLabel(field);
      if (DataValidator.isEmpty(tempData)) {
        try {
          return field.Label.includes("!") ? html`` : html`${labelSpan}`;
        } catch (error) {
          console.log("Field.Label needs a value.");
          return html``;
        }
      }
      let isMultiline = tempData.length > 60;
      let textClass = isMultiline ? "multiline" : "";
      let formatting = DataValidator.getValidFormat(field.Format);
      let text;
      let isNumber = DataValidator.isNumber(formatting);
      let isEmpty = DataValidator.isEmpty(formatting);
      let dataSpan;
      if (isMultiline && (isNumber || isEmpty)) {
        let styling = isNumber && !isEmpty ? formatting : 5;
        dataSpan = DataFormatter$1.encapsulateTextInSpanWithClass(
          tempData,
          "text"
        );
        text = html`${labelSpan}
          <div
            class="textContainer ${textClass}"
            style="max-height:${styling}em"
            id="${textClass}"
          >
            ${dataSpan}
          </div> `;
      } else {
        dataSpan = DataFormatter$1.encapsulateTextInSpanWithClass(
          tempData,
          "text " + formatting
        );
        text = html`${labelSpan}${dataSpan}`;
      }
      return this._dataHelper.outputValidator(data, field, text);
    }
    getFieldValueToString(data, field) {
      return field.Value;
    }
    getDataValueToString(data, field) {
      return data[field.Value];
    }
    getTextNoLabel(data, field) {
      try {
        let tempData = this._dataHelper.getDataFromField(data, field);
        let text = DataFormatter$1.getTextSpanWithFormatting(tempData, field);
        return DataFormatter$1.encapsulateFieldTypeOutputInSpan(text, field);
      } catch (error) {
        console.log("Error in text with no label properties");
      }
    }
    getArrayValues(data, field) {
      let array = data[field.Value];
      let labelWithFormatting = this._dataHelper.getLabelWithLabelFormatting(
        field
      );
      if (array.length > 0) {
        let text = html` ${labelWithFormatting}
          <span class="arrayContainer"
            >${array.map((i) => html` <span>${i}</span> `)}</span
          >`;
        return DataFormatter$1.encapsulateFieldTypeOutputInSpan(text, field);
      }
      let text = html`${labelWithFormatting}`;
      return DataFormatter$1.encapsulateFieldTypeOutputInSpan(text, field);
    }
    getValueWithDenomination(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field);
      let dataSpan = DataFormatter$1.encapsulateTextInSpanWithClass(
        tempData,
        field.Format
      );
      let labelSpan = this._dataHelper.toggleLabel(field);
      let text = html`${labelSpan} ${dataSpan}`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    staticText(data, field) {
      let text = html`${this._dataHelper.toggleLabel(
        field
      )}${this._dataHelper.toggleValue(field)}`;
      return DataFormatter$1.encapsulateFieldTypeOutputInSpan(text, field);
    }
    formattedNumbers(data, field) {
      let formatArray = field.Format.split(".");
      let textNumber = parseFloat(
        this._dataHelper.getDataFromField(data, field)
      );
      let roundedNumber = Math.pow(10, parseFloat(formatArray[0]));
      let formattedText =
        Math.round(textNumber * roundedNumber) / roundedNumber;
      let text = html`${this._dataHelper.toggleLabel(field)}
        <span class="text">${formattedText} ${formatArray[1]}</span>`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getSplitStringOnFirstOccurenceSelectSpecificPart(data, field, item) {
      try {
        let separator = field.Format;
        let tempData = DataValidator.isEmpty(
          this._dataHelper.getDataFromField(data, field)
        )
          ? ""
          : this._dataHelper.getDataFromField(data, field);
        let text = tempData.split(separator)[item];
        let output = html`${this._dataHelper.toggleLabel(field)}
        ${DataFormatter$1.encapsulateTextInSpanWithClass(text, "text")}`;
        return DataValidator.isEmpty(
          this._dataHelper.getDataFromField(data, field)
        ) && field.Label.includes("!")
          ? html``
          : DataFormatter$1.encapsulateFieldTypeOutputInSpan(output, field);
      } catch (error) {
        return html``;
      }
    }
    customBooleanValues(data, field) {
      let booleanValues = field.Format.split(".");
      let decider =
        this._dataHelper.getDataFromField(data, field).toLowerCase() ===
          "true" ||
        this._dataHelper.getDataFromField(data, field).toLowerCase() === "yes";
      let text = html`${this._dataHelper.toggleLabel(field)}
        <span class="text"
          >${decider
            ? html`${booleanValues[0]}`
            : html`${booleanValues[1]}`}</span
        >`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getConcattedValues(data, field) {
      let text = this._dataHelper.getConcattedValuesWithSeparator(data, field);
      let input = html`${this._dataHelper.toggleLabel(
        field
      )}${DataFormatter$1.encapsulateTextInSpanWithClass(text, "text")}`;
      return DataFormatter$1.encapsulateFieldTypeOutputInSpan(input, field);
    }
    getStringReplaceWithData(data, field) {
      try {
        let array = field.Value.split("|");
        let tempData;
        let stringToBeUpdated = array[0];
        for (let i = 1; i < array.length; i++) {
          let tempField = array[i];
          tempData = this._dataHelper.getStringFromObject(data, tempField);
          stringToBeUpdated = stringToBeUpdated.replace("$", tempData);
        }
        let text = html`${this._dataHelper.toggleLabel(
          field
        )}${DataFormatter$1.encapsulateTextInSpanWithClass(
          stringToBeUpdated,
          "text"
        )}`;
        return DataFormatter$1.encapsulateFieldTypeOutputInSpan(text, field);
      } catch (error) {
        console.log(error);
      }
    }
    getValueInComplexObject(data, field) {
      let objectToSplit = field.Value.split(".");
      let temp;
      let result;
      let element;
      for (let i = 0; i < objectToSplit.length; i++) {
        temp = objectToSplit[i];
        if (temp.includes("[")) {
          let [object, rest] = this._dataHelper.getSplitValues(temp, "[");
          if (rest.includes("|")) {
            let [key, value] = this._dataHelper.getSplitValues(rest, "|");
            let val = value.split("]")[0];
            let objectData = data[object];
            element = this._dataHelper.getElementFromKey(objectData, key, val);
            result = element;
            continue;
          } else {
            let elm = element[object];
            let tempVal = rest.split("]")[0];
            result = elm[tempVal];
            continue;
          }
        } else {
          result = this._dataHelper.getReturnType(result[temp], field);
          continue;
        }
      }
      result = html`${this._dataHelper.toggleLabel(field)}
      ${DataFormatter$1.encapsulateTextInSpanWithClass(
        result,
        "textcontent " + field.Format
      )}`;
      return DataFormatter$1.encapsulateFieldTypeOutputInSpan(result, field);
    }
  }

  class BooleanFormatter {
    static setCustomBooleanValue(value, trueValue, falseValue) {
      if (value instanceof Array) {
        value.map((e) => (e == "true" ? trueValue : falseValue));
      }
      return value === "true" ? trueValue : falseValue;
    }
    static join(array, separator) {
      return Array.prototype.join.apply(array, separator);
    }
  }
  BooleanFormatter.booleanfunctions = {
    customBooleanValue: (value, trueValue, falseValue) =>
      BooleanFormatter.setCustomBooleanValue(value, trueValue, falseValue),
    join: (array, separator) => BooleanFormatter.join(array, separator),
  };

  class DateTimeFormatter {
    static formatDate(value, format) {
      let dateFormatter = new DateFormatter();
      if (value instanceof Array) {
        value.map((e) => dateFormatter.dateFormat(new Date(e), format));
      }
      return dateFormatter.dateFormat(new Date(value), format);
    }
    static join(array, separator) {
      return Array.prototype.join.apply(array, separator);
    }
  }
  DateTimeFormatter.datefunctions = {
    formatDate: (value, format) => DateTimeFormatter.formatDate(value, format),
    join: (array, separator) => DateTimeFormatter.join(array, separator),
  };

  class NumberFormatter {
    static setDecimales(value, decimales) {
      if (value instanceof Array) {
        value.map((e) =>
          NumberFormatter.roundNumberAndSetDecimales(e, decimales)
        );
      }
      return NumberFormatter.roundNumberAndSetDecimales(value, decimales);
    }
    static roundNumberAndSetDecimales(value, decimales) {
      let textNumber = parseFloat(value);
      let roundedNumber = Math.pow(10, parseFloat(decimales));
      let number = Math.round(textNumber * roundedNumber) / roundedNumber;
      return number.toString();
    }
    static setDenomination(value, denomination) {
      let string = value + " ";
      return string.concat(denomination);
    }
    static join(array, separator) {
      return Array.prototype.join.apply(array, separator);
    }
  }
  NumberFormatter.numberfunctions = {
    setDenomination: (value, denomination) =>
      NumberFormatter.setDenomination(value, denomination),
    setDecimales: (value, decimales) =>
      NumberFormatter.setDecimales(value, decimales),
    join: (array, separator) => NumberFormatter.join(array, separator),
  };

  function State(options, params, handleQuery) {
    options = options || {};
    //this.options = options
    this.handleQuery = handleQuery;
    this.options = options;
    this.locals = this.options.locals || {};
    this.globals = this.options.globals || {};
    this.rootContext = firstNonNull(
      options.data,
      options.rootContext,
      options.context,
      options.source
    );
    this.parent = options.parent;
    this.override = options.override;
    this.filters = options.filters || {};
    this.params = params || options.params || [];
    this.context = firstNonNull(
      options.currentItem,
      options.context,
      options.source
    );
    this.currentItem = firstNonNull(
      this.context,
      options.rootContext,
      options.data
    );
    this.currentKey = null;
    this.currentReferences = [];
    this.currentParents = [];
  }
  State.prototype = {
    // current manipulation
    setCurrent: function (key, value) {
      if (
        this.currentItem ||
        this.currentKey ||
        this.currentParents.length > 0
      ) {
        this.currentParents.push({
          key: this.currentKey,
          value: this.currentItem,
        });
      }
      this.currentItem = value;
      this.currentKey = key;
    },
    resetCurrent: function () {
      this.currentItem = null;
      this.currentKey = null;
      this.currentParents = [];
    },
    force: function (def) {
      var parent = this.currentParents[this.currentParents.length - 1];
      if (!this.currentItem && parent && this.currentKey != null) {
        this.currentItem = def || {};
        parent.value[this.currentKey] = this.currentItem;
      }
      return !!this.currentItem;
    },
    getLocal: function (localName) {
      if (~localName.indexOf("/")) {
        var result = null;
        var parts = localName.split("/");
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (i == 0) {
            result = this.locals[part];
          } else if (result && result[part]) {
            result = result[part];
          }
        }
        return result;
      } else {
        return this.locals[localName];
      }
    },
    getGlobal: function (globalName) {
      if (~globalName.indexOf("/")) {
        var result = null;
        var parts = globalName.split("/");
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (i == 0) {
            result = this.globals[part];
          } else if (result && result[part]) {
            result = result[part];
          }
        }
        return result;
      } else {
        return this.globals[globalName];
      }
    },
    getFilter: function (filterName) {
      if (~filterName.indexOf("/")) {
        var result = null;
        var filterParts = filterName.split("/");
        for (var i = 0; i < filterParts.length; i++) {
          var part = filterParts[i];
          if (i == 0) {
            result = this.filters[part];
          } else if (result && result[part]) {
            result = result[part];
          }
        }
        return result;
      } else {
        return this.filters[filterName];
      }
    },
    addReferences: function (references) {
      if (references) {
        references.forEach(this.addReference, this);
      }
    },
    addReference: function (ref) {
      if (ref instanceof Object && !~this.currentReferences.indexOf(ref)) {
        this.currentReferences.push(ref);
      }
    },
    // helper functions
    getValues: function (values, callback) {
      return values.map(this.getValue, this);
    },
    getValue: function (value) {
      return this.getValueFrom(value, null);
    },
    getValueFrom: function (value, item) {
      if (value._param != null) {
        return this.params[value._param];
      } else if (value._sub) {
        let options = copy(this.options);
        options.force = null;
        options.currentItem = item;
        var result = this.handleQuery(value._sub, options, this.params);
        this.addReferences(result.references);
        return result.value;
      } else {
        return value;
      }
    },
    deepQuery: function (source, tokens, options, callback) {
      for (var key in source) {
        if (key in source) {
          let options = copy(this.options);
          options.currentItem = source[key];
          var result = this.handleQuery(tokens, options, this.params);
          if (result.value) {
            return result;
          }
        }
      }
      return null;
    },
  };
  function firstNonNull(...args) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] != null) {
        return arguments[i];
      }
    }
  }
  function copy(obj) {
    var result = {};
    if (obj) {
      for (var key in obj) {
        if (key in obj) {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  function depthSplit(text, delimiter, opts) {
    var max = (opts && opts.max) || Infinity;
    var includeDelimiters = (opts && opts.includeDelimiters) || false;
    var depth = 0;
    var start = 0;
    var result = [];
    var zones = [];
    text.replace(
      /([\[\(\{])|([\]\)\}])/g,
      function (current, open, close, offset) {
        if (open) {
          if (depth === 0) {
            zones.push([start, offset]);
          }
          depth += 1;
        } else if (close) {
          depth -= 1;
          if (depth === 0) {
            start = offset + current.length;
          }
        }
      }
    );
    if (depth === 0 && start < text.length) {
      zones.push([start, text.length]);
    }
    start = 0;
    for (var i = 0; i < zones.length && max > 0; i++) {
      for (
        var pos = zones[i][0],
          match = delimiter.exec(text.slice(pos, zones[i][1]));
        match && max > 1;
        pos += match.index + match[0].length,
          start = pos,
          match = delimiter.exec(text.slice(pos, zones[i][1]))
      ) {
        result.push(text.slice(start, match.index + pos));
        if (includeDelimiters) {
          result.push(match[0]);
        }
        max -= 1;
      }
    }
    if (start < text.length) {
      result.push(text.slice(start));
    }
    return result;
  }

  // todo: syntax checking
  function tokenize(query, shouldAssignParamIds) {
    if (!query) return [];
    var result = [],
      char,
      nextChar = query.charAt(0),
      bStart = 0,
      bEnd = 0,
      partOffset = 0,
      pos = 0,
      depth = 0,
      mode = "get",
      deepQuery = null;
    // if query contains params then number them
    if (shouldAssignParamIds) {
      query = assignParamIds(query);
    }
    var tokens = {
      ".": { mode: "get" },
      ":": { mode: "filter" },
      "|": { handle: "or" },
      "[": { open: "select" },
      "]": { close: "select" },
      "{": { open: "meta" },
      "}": { close: "meta" },
      "(": { open: "args" },
      ")": { close: "args" },
    };
    function push(item) {
      if (deepQuery) {
        deepQuery.push(item);
      } else {
        result.push(item);
      }
    }
    var handlers = {
      get: function (buffer) {
        var trimmed = typeof buffer === "string" ? buffer.trim() : null;
        if (trimmed) {
          push({ get: trimmed });
        }
      },
      select: function (buffer) {
        if (buffer) {
          push(tokenizeSelect(buffer));
        } else {
          // deep query override
          var x = { deep: [] };
          result.push(x);
          deepQuery = x.deep;
        }
      },
      filter: function (buffer) {
        if (buffer) {
          push({ filter: buffer.trim() });
        }
      },
      or: function () {
        deepQuery = null;
        result.push({ or: true });
        partOffset = i + 1;
      },
      args: function (buffer) {
        var args = tokenizeArgs(buffer);
        result[result.length - 1].args = args;
      },
    };
    function handleBuffer() {
      var buffer = query.slice(bStart, bEnd);
      if (handlers[mode]) {
        handlers[mode](buffer);
      }
      mode = "get";
      bStart = bEnd + 1;
    }
    for (var i = 0; i < query.length; i++) {
      char = nextChar;
      nextChar = query.charAt(i + 1);
      pos = i - partOffset;
      // root query check
      if (pos === 0 && char !== ":" && char !== ".") {
        result.push({ root: true });
      }
      // parent query check
      if (pos === 0 && char === "." && nextChar === ".") {
        result.push({ parent: true });
      }
      var token = tokens[char];
      if (token) {
        // set mode
        if (depth === 0 && (token.mode || token.open)) {
          handleBuffer();
          mode = token.mode || token.open;
        }
        if (depth === 0 && token.handle) {
          handleBuffer();
          handlers[token.handle]();
        }
        if (token.open) {
          depth += 1;
        } else if (token.close) {
          depth -= 1;
        }
        // reset mode to get
        if (depth === 0 && token.close) {
          handleBuffer();
        }
      }
      bEnd = i + 1;
    }
    handleBuffer();
    return result;
  }
  function tokenizeArgs(argsQuery) {
    if (argsQuery === ",") return [","];
    return depthSplit(argsQuery, /,/).map(function (s) {
      return handleSelectPart(s.trim());
    });
  }
  function tokenizeSelect(selectQuery) {
    if (selectQuery === "*") {
      return {
        values: true,
      };
    } else if (selectQuery === "**") {
      return {
        values: true,
        deep: true,
      };
    }
    var multiple = false;
    if (selectQuery.charAt(0) === "*") {
      multiple = true;
      selectQuery = selectQuery.slice(1);
    }
    var booleanParts = depthSplit(selectQuery, /&|\|/, {
      includeDelimiters: true,
    });
    if (booleanParts.length > 1) {
      var result = [getSelectPart(booleanParts[0].trim())];
      for (var i = 1; i < booleanParts.length; i += 2) {
        var part = getSelectPart(booleanParts[i + 1].trim());
        if (part) {
          part.booleanOp = booleanParts[i];
          result.push(part);
        }
      }
      return {
        multiple: multiple,
        boolean: true,
        select: result,
      };
    } else {
      let result = getSelectPart(selectQuery.trim());
      if (!result) {
        return {
          get: handleSelectPart(selectQuery.trim()),
        };
      } else {
        if (multiple) {
          result.multiple = true;
        }
        return result;
      }
    }
  }
  function getSelectPart(selectQuery) {
    var parts = depthSplit(selectQuery, /(!)?(=|~|\:|<=|>=|<|>)/, {
      max: 2,
      includeDelimiters: true,
    });
    if (parts.length === 3) {
      var negate = parts[1].charAt(0) === "!";
      var key = handleSelectPart(parts[0].trim());
      let result = {
        negate: negate,
        op: negate ? parts[1].slice(1) : parts[1],
      };
      if (result.op === ":") {
        result.select = [key, { _sub: module.exports(":" + parts[2].trim()) }];
      } else if (result.op === "~") {
        var value = handleSelectPart(parts[2].trim());
        if (typeof value === "string") {
          var reDef = parts[2].trim().match(/^\/(.*)\/([a-z]?)$/);
          if (reDef) {
            result.select = [key, new RegExp(reDef[1], reDef[2])];
          } else {
            result.select = [key, value];
          }
        } else {
          result.select = [key, value];
        }
      } else {
        result.select = [key, handleSelectPart(parts[2].trim())];
      }
      return result;
    }
  }
  function isInnerQuery(text) {
    return text.charAt(0) === "{" && text.charAt(text.length - 1) === "}";
  }
  function handleSelectPart(part) {
    if (isInnerQuery(part)) {
      var innerQuery = part.slice(1, -1);
      return { _sub: module.exports(innerQuery) };
    } else {
      return paramToken(part);
    }
  }
  function paramToken(text) {
    if (text.charAt(0) === "?") {
      var num = parseInt(text.slice(1));
      if (!isNaN(num)) {
        return { _param: num };
      } else {
        return text;
      }
    } else {
      return text;
    }
  }
  function assignParamIds(query) {
    var index = 0;
    return query.replace(/\?/g, function (match) {
      return match + index++;
    });
  }

  var tokenizedCache = {};
  function jsonQuery(query, options) {
    // extract params for ['test[param=?]', 'value'] type queries
    var params = (options && options.params) || null;
    if (Array.isArray(query)) {
      params = query.slice(1);
      query = query[0];
    }
    if (!tokenizedCache[query]) {
      tokenizedCache[query] = tokenize(query, true);
    }
    return handleQuery(tokenizedCache[query], options, params);
  }
  function handleQuery(tokens, options, params) {
    var state = new State(options, params, handleQuery);
    for (var i = 0; i < tokens.length; i++) {
      if (handleToken(tokens[i], state)) {
        break;
      }
    }
    // flush
    handleToken(null, state);
    // set databind hooks
    if (state.currentItem instanceof Object) {
      state.addReference(state.currentItem);
    } else {
      var parentObject = getLastParentObject(state.currentParents);
      if (parentObject) {
        state.addReference(parentObject);
      }
    }
    return {
      value: state.currentItem,
      key: state.currentKey,
      references: state.currentReferences,
      parents: state.currentParents,
    };
  }
  function handleToken(token, state) {
    // state: setCurrent, getValue, getValues, resetCurrent, deepQuery, rootContext, currentItem, currentKey, options, filters
    if (token == null) {
      // process end of query
      if (!state.currentItem && state.options.force) {
        state.force(state.options.force);
      }
    } else if (token.values) {
      if (state.currentItem) {
        var keys = Object.keys(state.currentItem);
        var values = [];
        keys.forEach(function (key) {
          if (token.deep && Array.isArray(state.currentItem[key])) {
            state.currentItem[key].forEach(function (item) {
              values.push(item);
            });
          } else {
            values.push(state.currentItem[key]);
          }
        });
        state.setCurrent(keys, values);
      } else {
        state.setCurrent(keys, []);
      }
    } else if (token.get) {
      var key = state.getValue(token.get);
      if (shouldOverride(state, key)) {
        state.setCurrent(key, state.override[key]);
      } else {
        if (state.currentItem || (state.options.force && state.force({}))) {
          if (isDeepAccessor(state.currentItem, key) || token.multiple) {
            let values = state.currentItem
              .map(function (item) {
                return item[key];
              })
              .filter(isDefined);
            values = Array.prototype.concat.apply([], values); // flatten
            state.setCurrent(key, values);
          } else {
            state.setCurrent(key, state.currentItem[key]);
          }
        } else {
          state.setCurrent(key, null);
        }
      }
    } else if (token.select) {
      if (
        Array.isArray(state.currentItem) ||
        (state.options.force && state.force([]))
      ) {
        var match = (token.boolean ? token.select : [token]).map(function (
          part
        ) {
          if (part.op === ":") {
            var key = state.getValue(part.select[0]);
            return {
              func: function (item) {
                if (key) {
                  item = item[key];
                }
                return state.getValueFrom(part.select[1], item);
              },
              negate: part.negate,
              booleanOp: part.booleanOp,
            };
          } else {
            var selector = state.getValues(part.select);
            if (
              !state.options.allowRegexp &&
              part.op === "~" &&
              selector[1] instanceof RegExp
            )
              throw new Error("options.allowRegexp is not enabled.");
            return {
              key: selector[0],
              value: selector[1],
              negate: part.negate,
              booleanOp: part.booleanOp,
              op: part.op,
            };
          }
        });
        if (token.multiple) {
          let keys = [];
          var value = [];
          state.currentItem.forEach(function (item, i) {
            if (matches(item, match)) {
              keys.push(i);
              value.push(item);
            }
          });
          state.setCurrent(keys, value);
        } else {
          if (
            !state.currentItem.some(function (item, i) {
              if (matches(item, match)) {
                state.setCurrent(i, item);
                return true;
              }
            })
          ) {
            state.setCurrent(null, null);
          }
        }
      } else {
        state.setCurrent(null, null);
      }
    } else if (token.root) {
      state.resetCurrent();
      if (token.args && token.args.length) {
        state.setCurrent(null, state.getValue(token.args[0]));
      } else {
        state.setCurrent(null, state.rootContext);
      }
    } else if (token.parent) {
      state.resetCurrent();
      state.setCurrent(null, state.options.parent);
    } else if (token.or) {
      if (state.currentItem) {
        return true;
      } else {
        state.resetCurrent();
        state.setCurrent(null, state.context);
      }
    } else if (token.filter) {
      var helper =
        state.getLocal(token.filter) || state.getGlobal(token.filter);
      if (typeof helper === "function") {
        // function(input, args...)
        let values = state.getValues(token.args || []);
        var result = helper.apply(
          state.options,
          [state.currentItem].concat(values)
        );
        state.setCurrent(null, result);
      } else {
        // fallback to old filters
        var filter = state.getFilter(token.filter);
        if (typeof filter === "function") {
          let values = state.getValues(token.args || []);
          var result = filter.call(state.options, state.currentItem, {
            args: values,
            state: state,
            data: state.rootContext,
          });
          state.setCurrent(null, result);
        }
      }
    } else if (token.deep) {
      if (state.currentItem) {
        if (token.deep.length === 0) {
          return;
        }
        var result = state.deepQuery(
          state.currentItem,
          token.deep,
          state.options
        );
        if (result) {
          state.setCurrent(result.key, result.value);
          for (var i = 0; i < result.parents.length; i++) {
            state.currentParents.push(result.parents[i]);
          }
        } else {
          state.setCurrent(null, null);
        }
      } else {
        state.currentItem = null;
      }
    }
  }
  function matches(item, parts) {
    var result = false;
    for (var i = 0; i < parts.length; i++) {
      var opts = parts[i];
      var r = false;
      if (opts.func) {
        r = opts.func(item);
      } else if (opts.op === "~") {
        if (opts.value instanceof RegExp) {
          r = item[opts.key] && !!item[opts.key].match(opts.value);
        } else {
          r = item[opts.key] && !!~item[opts.key].indexOf(opts.value);
        }
      } else if (opts.op === "=") {
        if (
          (item[opts.key] === true && opts.value === "true") ||
          (item[opts.key] === false && opts.value === "false")
        ) {
          r = true;
        } else {
          r = item[opts.key] == opts.value;
        }
      } else if (opts.op === ">") {
        r = item[opts.key] > opts.value;
      } else if (opts.op === "<") {
        r = item[opts.key] < opts.value;
      } else if (opts.op === ">=") {
        r = item[opts.key] >= opts.value;
      } else if (opts.op === "<=") {
        r = item[opts.key] <= opts.value;
      }
      if (opts.negate) {
        r = !r;
      }
      if (opts.booleanOp === "&") {
        result = result && r;
      } else if (opts.booleanOp === "|") {
        result = result || r;
      } else {
        result = r;
      }
    }
    return result;
  }
  function isDefined(value) {
    return typeof value !== "undefined";
  }
  function shouldOverride(state, key) {
    return (
      state.override &&
      state.currentItem === state.rootContext &&
      state.override[key] !== undefined
    );
  }
  function isDeepAccessor(currentItem, key) {
    return currentItem instanceof Array && parseInt(key) != key;
  }
  function getLastParentObject(parents) {
    for (var i = 0; i < parents.length; i++) {
      if (!parents[i + 1] || !(parents[i + 1].value instanceof Object)) {
        return parents[i].value;
      }
    }
  }

  class ObjectFormatter {
    static compose(data, object) {
      let newObj = object;
      for (let o in object) {
        newObj[o] = jsonQuery(object[o], { data: data }).value;
      }
      return newObj;
    }
    static concat(value, stringTemplate) {
      // get build function
      let func = this.buildFunction(value, stringTemplate);
      let params = [];
      for (var v in value) {
        params.push(value[v]);
      }
      return func(...params);
    }
  }
  ObjectFormatter.objectfunctions = {
    compose: (data, object) => ObjectFormatter.compose(data, object),
    concat: (value, stringTemplate) =>
      ObjectFormatter.concat(value, stringTemplate),
  };
  ObjectFormatter.buildFunction = (value, s) => {
    let params = [];
    for (var v in value) {
      params.push(v);
    }
    params.push(`return \`${s}\``);
    return new Function(...params);
  };

  class StringFormatter {
    static join(array, separator) {
      return Array.prototype.join.apply(array, separator);
    }
  }
  StringFormatter.stringfunctions = {
    split: (value, separator, index) => value.split(separator)[index],
    concat: (value, ...strings) => value.concat(...strings),
    join: (array, separator) => StringFormatter.join(array, separator),
  };

  class DataFormatter {
    static getFormattedValue(data, field) {
      // Check if Path is given
      if (this.isEmptyValueDescriptor(field.ValueDescriptor)) return null;
      // Retrieve data
      let typeOfData = field.ValueDescriptor.Type;
      let retrievedData;
      // Check if static
      if (typeOfData === "static") {
        return field.ValueDescriptor.Path;
      } else {
        retrievedData = this.retreiveData(data, field.ValueDescriptor.Path);
      }
      // Formatting data
      let currentValue = retrievedData;
      let formatters = this.typeformatter[typeOfData];
      let temp;
      for (let i = 0; i < field.Formatters.length; i++) {
        temp = field.Formatters[i].match(/(.*)\((.*)\)/);
        let params = window.eval("[" + temp[2] + "]");
        let funcName = temp[1];
        if (formatters[funcName]) {
          currentValue = formatters[funcName].apply(null, [
            currentValue,
            ...params,
          ]);
        } else {
          if (currentValue[funcName]) {
            currentValue[funcName].apply(currentValue, [...params]);
          }
        }
      }
      return currentValue;
    }
    static retreiveData(data, path) {
      var result = jsonQuery(path, { data: data }).value;
      return result;
    }
    static isEmptyValueDescriptor(valueDescriptor) {
      return valueDescriptor?.Path == null || valueDescriptor?.Type == null;
    }
  }
  DataFormatter.typeformatter = {
    datetime: DateTimeFormatter.datefunctions,
    string: StringFormatter.stringfunctions,
    number: NumberFormatter.numberfunctions,
    boolean: BooleanFormatter.booleanfunctions,
    object: ObjectFormatter.objectfunctions,
  };

  class TableFormatter {
    static renderTable(data, section) {
      // Retrieve list with data
      let list = DataFormatter.retreiveData(data, section.ValueDescriptor.Path);
      // Resulting table
      let resultTable = new Table();
      // Header
      resultTable.header = [];
      resultTable.header.push([...section.Fields.map((f) => f.Label)]);
      // Body
      for (let i = 0; i < list.length; i++) {
        let row = [];
        let d = list[i];
        section.Fields.forEach((f) => {
          row.push(DataFormatter.getFormattedValue(d, f));
        });
        resultTable.body.push(row);
      }
      // Footer
      section.Formatters.forEach((f) => {
        resultTable = TableFormatter.appylFormatters(resultTable, f);
      });
      return html` <table>
        <thead>
          ${repeat(
            resultTable.header,
            (r) =>
              html`<tr>
                ${repeat(r, (c) => html`<th>${c}</th>`)}
              </tr>`
          )}
        </thead>
        <tbody id="table-items">
          ${repeat(
            resultTable.body,
            (r) =>
              html`<tr>
                ${repeat(r, (c) => html`<td>${c}</td>`)}
              </tr>`
          )}
        </tbody>
        ${resultTable.footer.length
          ? html`
              <tfoot>
                ${repeat(
                  resultTable.footer,
                  (r) =>
                    html`<tr>
                      ${repeat(r, (c) => html`<td>${c}</td>`)}
                    </tr>`
                )}
              </tfoot>
            `
          : html``}
      </table>`;
    }
    static appylFormatters(data, formatter) {
      let temp = formatter.match(/(.*)\((.*)\)/);
      let params = window.eval("[" + temp[2] + "]");
      let funcName = temp[1];
      if (TableFormatter.tableWriters[funcName]) {
        return TableFormatter.tableWriters[funcName].apply(null, [
          data,
          ...params,
        ]);
      }
      return data;
    }
    static sumCol(table, fields, text, colNum) {
      let tempTable = new Table();
      let offset = 0;
      if (colNum == -1) {
        for (let i in table) {
          for (let j of table[i]) {
            tempTable[i].push([null, ...j]);
          }
        }
        offset = 1;
      } else {
        tempTable.header = [...table.header];
        tempTable.body = [...table.body];
        tempTable.footer = [...table.footer];
      }
      let result = [];
      fields.forEach((f) => {
        let sum = 0;
        try {
          sum = tempTable.body.reduce((agg, curr) => {
            let tall = curr[f + offset];
            let number = DataValidator.isNumber(tall);
            return (agg += number ? parseFloat(tall) : 0);
          }, 0);
          result[f + offset] = sum;
        } catch (e) {
          result[f + offset] = e;
        }
      });
      for (var i = 0, n = tempTable.body[0].length; i < n; ++i) {
        if (result[i] === undefined) {
          // explicit check for missing sparse value
          result[i] = "";
        }
      }
      result[offset + colNum] = text;
      tempTable.footer.push(result);
      return tempTable;
    }
  }
  TableFormatter.tableWriters = {
    sumCol: (table, fields, text, colNum) =>
      TableFormatter.sumCol(table, fields, text, colNum),
  };
  class Table {
    constructor() {
      this.header = [];
      this.body = [];
      this.footer = [];
    }
  }

  class DataRetriever {
    constructor() {
      this._dateFormatter = null;
      this._dateFormatter = new DateFormatter();
    }
    getDataFromField(data, field) {
      return this.formatStringValues(
        this.getStringFromObject(data, field.Value)
      );
    }
    getStringFromObject(data, field) {
      if (field.includes(".")) {
        let [object, value] = this.getSplitValues(field, ".");
        let dataObject = data[object];
        if (Array.isArray(dataObject)) {
          return this.getValueFromKey(dataObject, value);
        } else {
          return dataObject[value];
        }
      }
      return data[field];
    }
    formatStringValues(value) {
      if (value == "true") {
        return "Yes";
      } else if (value == "false") {
        return "No";
      }
      return value;
    }
    getConcattedValuesWithSeparator(data, field) {
      let array = field.Value.split("|");
      let element;
      let text = "";
      for (let i = 0; i < array.length; i++) {
        element = array[i];
        element = this.getStringFromObject(data, element);
        text += element;
        if (i != array.length - 1) {
          text += " " + field.Format + " ";
        }
      }
      return text;
    }
    toggleLabel(field) {
      let hideLabel = DataValidator.isEmpty(field.Label);
      return html`${hideLabel
        ? html``
        : html`<span class="label"
            >${field.Label.replace("!", "")}&nbsp;</span
          >`}`;
    }
    toggleValue(field) {
      let hideValue = DataValidator.isEmpty(field.Value);
      return html`${hideValue
        ? html``
        : html`<span class="text ${field.Format}"
            >${field.Value}&nbsp;</span
          >`}`;
    }
    isEmptyValue(data, label) {
      let missingValue = data === null || data === "" || data === undefined;
      return missingValue && label.includes("!") ? true : false;
    }
    outputValidator(data, field, input) {
      try {
        let tempData = this.getReturnType(data, field);
        return this.isEmptyValue(tempData, field.Label)
          ? html``
          : DataFormatter$1.encapsulateFieldTypeOutputInSpan(input, field);
      } catch (error) {
        console.log(
          `Error in field type ${field.Type}, check that label: %c${field.Label}%c and value: %c${field.Value}%c are correct.`,
          "color: red",
          "color: black",
          "color: red",
          error
        );
        console.log(error.message);
      }
    }
    getSplitValues(data, seperator) {
      let objectToSplit = data.split(seperator);
      return [objectToSplit[0], objectToSplit[1]];
    }
    getLabelWithLabelFormatting(field) {
      let label = this.toggleLabel(field);
      return DataFormatter$1.encapsulateTextInSpanWithClass(label, "label");
    }
    getValueFromKey(dataObject, key) {
      for (let i = 0; i < dataObject.length; i++) {
        let element = dataObject[i];
        if (element["Key"] == key) {
          return element["Value"];
        }
      }
    }
    getElementFromKey(dataObject, key, value) {
      let element;
      for (let i = 0; i < dataObject.length; i++) {
        element = dataObject[i];
        if (element[key] == value) {
          return element;
        }
      }
    }
    formatNumbers(data, format) {
      let number = data;
      if (format != null && /^\d+$/.test(format)) {
        let roundedNumber = Math.pow(10, parseFloat(format));
        number = Math.round(data * roundedNumber) / roundedNumber;
      }
      return number;
    }
    getReturnType(data, field) {
      if (data instanceof Date) {
        // is date
        return this._dateFormatter.dateFormat(new Date(data), field.Format);
      } else if (/^[0-9,.]*$/.test(data)) {
        // is number
        let result;
        if (field.Format.includes(".")) {
          let formatArray = field.Format.split(".");
          result =
            this.formatNumbers(data, formatArray[0]) + " " + formatArray[1];
        } else {
          result = this.formatNumbers(data, field.Format);
        }
        return result;
      } else {
        // is string
        return this.getDataFromField(data, field);
      }
    }
  }

  class FieldWriter {
    static getLabelWithData(data, field) {
      if (data) {
        return html`<div>
          <span class="label ${field?.Options?.styleClass}"
            >${field.Label}&nbsp;</span
          ><span class="value">${data}</span>
        </div>`;
      }
      if (field?.Options?.hideLabelIfDataIsEmpty) {
        return html``;
      }
      return html` <div>
        <span class="label"> ${field.Label}&nbsp; </span>
      </div>`;
    }
    static getEmptyField() {
      return html`<br />`;
    }
    static getLineField() {
      return html`<hr />`;
    }
    static getMultiline(data, field) {
      if (data) {
        let multiline = field.Options.Multiline;
        // check if multiline is not configuredd in SysAdmin even though the data require multiline
        if (DataValidator.isEmpty(multiline)) {
          //default is multiline 5 lines
          multiline = 5;
        }
        return html`<div>
          <span
            class="label ${field?.Options?.styleClass}"
            style="display:block"
            >${field.Label}</span
          >
          <div
            class="textContainer multiline"
            style="max-height:${multiline}em"
            id="multiline"
          >
            ${data}
          </div>
        </div>`;
      }
      if (field?.Options?.hideLabelIfDataIsEmpty) {
        return html``;
      }
      return html` <div><span class="label"> ${field.Label}</span></div>`;
    }
    static getCheckbox(data, field) {
      if (data === false || data === true) {
        let isTrue = data === true;
        let checkbox = isTrue
          ? html`<input type="checkbox" checked />`
          : html`<input type="checkbox" />`;
        return html`<div>
          <div style="display:inline" class="checkboxContainer">
            ${checkbox}<span class="checkmark"> </span>
          </div>
          <span
            class="label ${field?.Options?.styleClass}"
            style="display:inline"
            >${field.Label}</span
          >
        </div>`;
      }
      if (field?.Options?.hideLabelIfDataIsEmpty) {
        return html``;
      }
      return html` <div > </span> <div class="checkboxContainer" > <input type='checkbox' /> <span class="checkmark" > </span></div> <span class="label" > ${field.Label} </div>`;
    }
  }

  class TemplateEngine {
    constructor(templateRetriever, host) {
      this.subViewState = null;
      this.templateRetriever = null;
      this.host = null;
      this.dateService = null;
      this.textService = null;
      this.iconService = null;
      this.checkboxService = null;
      this.SectionWriters = {
        1: (data, section) => this.renderSectionOld(data, section),
        2: (data, section) => this.renderSectionOld(data, section),
        3: (data, section) => this.renderSectionOld(data, section),
        4: (data, section) => this.renderListWithSubViewSection(data, section),
        6: (data, section) => this.renderNonClickableList(data, section),
        8: (data, section) => this.renderExternalData(data, section),
        Standard: (data, section) => this.renderStandard(data, section),
        ClickableList: (data, section) =>
          this.renderClickableList(data, section),
        Table: (data, section) => TableFormatter.renderTable(data, section),
        Tab: (data, section) => this.renderTabList(data, section),
        ExternalData: (data, section) =>
          this.renderExternalDataNew(data, section),
      };
      this.FieldWriters = {
        LabelWithData: (data, field) =>
          FieldWriter.getLabelWithData(data, field),
        Multiline: (data, field) => FieldWriter.getMultiline(data, field),
        CheckBox: (data, field) => FieldWriter.getCheckbox(data, field),
        Empty: () => FieldWriter.getEmptyField(),
        Line: () => FieldWriter.getLineField(),
      };
      this.FieldWriter_TOBEDISCONTINUED = {
        1: (data, field) => this.textService.getTextOneLine(data, field),
        2: (data, field) => this.textService.getTextTwoLines(data, field),
        3: (data, field) => LinkService.getLinktoHTML(data, field),
        4: (data, field) => this.dateService.getDate(data, field),
        5: (data, field) =>
          this.textService.getSplitStringOnFirstOccurenceSelectSpecificPart(
            data,
            field,
            0
          ),
        6: (data, field) => this.textService.getDataValueToString(data, field),
        7: (data, field) => this.textService.getFieldValueToString(data, field),
        8: (data, field) => this.textService.getTextNoLabel(data, field),
        9: (data, field) => this.dateService.getDateNoLabel(data, field),
        10: (data, field) =>
          this.textService.getSplitStringOnFirstOccurenceSelectSpecificPart(
            data,
            field,
            1
          ),
        11: (data, field) =>
          ObjectService.getObjectValuesWithDevider(data, field),
        12: (data, field) => this.textService.getArrayValues(data, field),
        13: (data, field) =>
          this.checkboxService.getCheckboxWithLabel(data, field),
        14: (data, field) => this.iconService.getIconWithLabel(data, field),
        15: (data, field) => this.iconService.getLineSeperator(data, field),
        16: (data, field) =>
          this.textService.getValueWithDenomination(data, field),
        17: (data, field) => this.iconService.getEmptyLine(data, field),
        18: (data, field) => this.textService.staticText(data, field),
        19: (data, field) => this.textService.formattedNumbers(data, field),
        20: (data, field) => this.textService.customBooleanValues(data, field),
        21: (data, field) => this.textService.getConcattedValues(data, field),
        22: (data, field) =>
          this.textService.getStringReplaceWithData(data, field),
        23: (data, field) =>
          this.textService.getValueInComplexObject(data, field),
      };
      this.templateRetriever = templateRetriever;
      this.host = host;
      let dataHelper = new DataRetriever();
      this.dateService = new DateService(dataHelper);
      this.textService = new TextService(dataHelper);
      this.iconService = new IconService(dataHelper);
      this.checkboxService = new CheckboxService(dataHelper);
    }
    //-------------------------------------------------------------------------
    //
    //  Render Section...
    //
    //-------------------------------------------------------------------------
    renderData(data, sections) {
      return html` ${repeat(
        sections,
        (s) => s.Id,
        (s) => {
          try {
            return this.renderTemplateSections(data, s);
          } catch (e) {
            return html`<div class="exception">${e}</div>`;
          }
        }
      )}`;
    }
    renderTemplateSections(data, section) {
      try {
        return html`<div
          id="_${section.Id}"
          class="SectionType_${section.Type}"
        >
          ${this.SectionWriters[section.Type](data, section)}
        </div>`;
      } catch (e) {
        return html`<div class="exception">${e}</div>`;
      }
    }
    renderTemplateFieldsNew(data, fields) {
      return html`${repeat(
        fields,
        (f) => f.Id,
        (f) => {
          try {
            return this.FieldWriters[f.Type](
              DataFormatter.getFormattedValue(data, f),
              f
            );
          } catch (e) {
            return html`<div class="exception">${e}</div>`;
          }
        }
      )}`;
    }
    //-------------------------------------------------------------------------
    //
    //  Private methods Section
    //
    //-------------------------------------------------------------------------
    renderStandard(data, section) {
      try {
        return html`${this.renderTemplateFieldsNew(data, section.Fields)}`;
      } catch (e) {
        return html`<div class="exception">${e}</div>`;
      }
    }
    renderClickableList(data, section) {
      if (!data.__viewState) {
        data.__viewState = {};
      }
      this.subViewState = data.__viewState[section.Id] =
        data.__viewState[section.Id] || {};
      let list = DataFormatter.retreiveData(data, section.ValueDescriptor.Path);
      let listItemIdentifier = section.Options.ListItemIdentifier;
      if (list.length == 0) return html``;
      //Format list
      let formattedList = list;
      section.Formatters.forEach((f) => {
        formattedList = TableFormatter.appylFormatters(formattedList, f);
      });
      try {
        return html` <div class="list-label">
            ${section.Options.Title} (${formattedList.length})
          </div>
          <div id="container-list-items" class="container-list-items">
            <ul>
              ${repeat(
                formattedList,
                (i) => i[listItemIdentifier],
                (i) => this.renderListItem(i, section)
              )}
            </ul>
          </div>
          ${this.renderSelectedListItem(list, section)}`;
      } catch (e) {
        return html`<div class="exception">${e}</div>`;
      }
    }
    getItemLabel(data, section) {
      return html`${repeat(section.Fields, (f) => {
        if (f.ValueDescriptor.Type == "static")
          return html`${f.ValueDescriptor.Path}`;
        return DataFormatter.retreiveData(data, f.ValueDescriptor.Path);
      })}`;
    }
    renderListItem(item, section) {
      return html` <li>
        <div
          class="list-item"
          @click=${() => {
            this.listItemOnClick(item[section.Options.ListItemIdentifier]);
          }}
        >
          <span class="label">${this.getItemLabel(item, section)}</span>
          <span class="container-arrow">
            <svg class="more arrow" height="9.471" viewBox="0 0 5.848 9.471">
              <path
                d="M8.59,14.358,12.2,10.735,8.59,7.113,9.7,6l4.735,4.735L9.7,15.47Z"
                transform="translate(-8.59 -6)"
              />
            </svg>
          </span>
        </div>
      </li>`;
    }
    renderSelectedListItem(list, section) {
      return html`${this.subViewState.selected
        ? until(
            this.renderTemplateForListItem(
              list.find(
                (e) =>
                  e[section.Options.ListItemIdentifier] ==
                  this.subViewState.selected
              ),
              section.Options.TemplateId
            ),
            html``
          )
        : html``}`;
    }
    async renderTemplateForListItem(data, templateId) {
      let template = await this.templateRetriever.getTemplateFromTemplateId(
        templateId
      );
      let sections = template.Template.Content;
      return html` <div class="slide-in" id="slider">
        <div class="detail-view ${this.host.viewClass}">
          <div class="container-button">${this.renderBackButton()}</div>
          <div>${this.renderData(data, sections)}</div>
        </div>
      </div>`;
    }
    async renderTemplateForTab(data, templateId) {
      let template = await this.templateRetriever.getTemplateFromTemplateId(
        templateId
      );
      let sections = template.Template.Content;
      return html`<div>${this.renderData(data, sections)}</div>`;
    }
    renderTabList(data, section) {
      let tabcontent = DataFormatter.retreiveData(
        data,
        section.ValueDescriptor.Path
      );
      if (tabcontent.length == 0) return html``;
      let tabState = {
        currentIndex: 0,
        tabOnClick: (index, element) => {
          [...element.parentElement.children].forEach((c) =>
            c.classList.remove("selectedTab")
          );
          element.classList.add("selectedTab");
          tabState.currentIndex = index;
          let tabcontent = [...element.closest("div").children];
          tabcontent.forEach((c) => c.classList.remove("selectedContent"));
          tabcontent[index + 1].classList.add("selectedContent");
        },
      };
      return html`<div class="tabstrip">
        <ul class="tabheader" id="tabheader">
          ${repeat(
            tabcontent,
            (t, i) => html` <li
              class="tab-button ${i === tabState.currentIndex
                ? "selectedTab"
                : ""}"
              @click=${(e) => {
                tabState.tabOnClick(i, e.target);
              }}
            >
              ${this.getItemLabel(t, section)}
            </li>`
          )}
        </ul>
        ${repeat(
          tabcontent,
          (t, i) => html` <div
            id="tabcontent"
            class="tabcontent ${i === tabState.currentIndex
              ? "selectedContent"
              : ""}"
          >
            ${until(
              this.renderTemplateForTab(t, section.Options.TemplateId),
              html`..Loading`
            )}
          </div>`
        )}
      </div>`;
    }
    renderExternalDataNew(data, section) {
      let resolveFunction;
      const promise = new Promise((resolve, reject) => {
        resolveFunction = resolve;
      });
      let callback = (callbackData) => {
        try {
          callbackData
            ? resolveFunction(
                html`<span
                  class="popupexternaldata"
                  @click=${(event) =>
                    this.host.openPopUpExternalData(
                      callbackData,
                      section.ValueDescription.Path,
                      event
                    )}
                  >${this.renderTemplateFieldsNew(
                    callbackData,
                    section.Fields
                  )}</span
                >`
              )
            : null;
        } catch (error) {
          console.log(error.message);
        }
      };
      this.host.loadExternalData(data, section.Options.datasource, callback);
      //Render plugin data
      return html`${until(promise, html``)}`;
    }
    renderBackButton() {
      return html` <div
        id="toggle"
        class="back-button"
        @click=${(e) => this.toggleSubView()}
      >
        <div>
          <svg class="arrow" viewBox="0 0 16 8">
            <path
              d="M7.99,11H20v2H7.99v3L4,12,7.99,8Z"
              transform="translate(-4 -8)"
            />
          </svg>
          Back
        </div>
      </div>`;
    }
    toggleSubView() {
      let slider = this.host.shadowRoot.getElementById("slider");
      if (slider) {
        let isOpen = slider.classList.contains("slide-in");
        slider.setAttribute("class", isOpen ? "slide-out" : "slide-in");
      }
    }
    listItemOnClick(item) {
      this.subViewState.selected = item;
      this.host.requestUpdate();
      this.toggleSubView();
    }
    //-------------------------------------------------------------------------
    //
    //  Private Methods Section...  DISCONTINUED methods
    //
    //-------------------------------------------------------------------------
    renderTemplateFields(data, fields) {
      return html`${repeat(
        fields,
        (f) => f.Id,
        (f) => this.FieldWriter_TOBEDISCONTINUED[f.Type](data, f)
      )}`;
    }
    renderSectionOld(data, section) {
      return html`${this.renderTemplateFields(data, section.Fields)}`;
    }
    renderListWithSubViewSection(data, section) {
      if (!data.__viewState) {
        data.__viewState = {};
      }
      this.subViewState = data.__viewState[section.Id] =
        data.__viewState[section.Id] || {};
      let listName = section.Options.Source;
      let list = data[listName];
      let listItemIdentifier = section.Options.ListItemIdentifier;
      if (list.length == 0) return html``;
      let sortedlist = ListService.getSortedList(list, section);
      return html` <div class="list-label">
          ${section.Options.Title} (${sortedlist.length})
        </div>
        <div id="container-list-items" class="container-list-items">
          <ul>
            ${repeat(
              sortedlist,
              (i) => i[listItemIdentifier],
              (i) => this.renderClickableListItem(i, section)
            )}
          </ul>
        </div>
        ${this.renderSubDetailView(list, section)}`;
    }
    getListItemLabel(data, section) {
      let labelString = "";
      section.Fields.forEach((f) => {
        labelString += this.FieldWriter_TOBEDISCONTINUED[f.Type](data, f);
      });
      return labelString;
    }
    renderExternalData(data, section) {
      let resolveFunction;
      const promise = new Promise((resolve, reject) => {
        resolveFunction = resolve;
      });
      let callback = (callbackData) => {
        try {
          callbackData
            ? resolveFunction(
                html`<span
                  class="popupexternaldata"
                  @click=${(event) =>
                    this.host.openPopUpExternalData(
                      callbackData,
                      section.Options.datasource,
                      event
                    )}
                  >${this.renderTemplateFields(
                    callbackData,
                    section.Fields
                  )}</span
                >`
              )
            : null;
        } catch (error) {
          console.log(error.message);
        }
      };
      this.host.loadExternalData(data, section.Options.datasource, callback);
      //Render plugin data
      return html`${until(promise, html``)}`;
    }
    renderClickableListItem(item, section) {
      return html` <li>
        <div
          class="list-item"
          @click=${() => {
            this.listItemOnClick(item[section.Options.ListItemIdentifier]);
          }}
        >
          <span class="label">${this.getListItemLabel(item, section)}</span>
          <span class="container-arrow">
            <svg class="more arrow" height="9.471" viewBox="0 0 5.848 9.471">
              <path
                d="M8.59,14.358,12.2,10.735,8.59,7.113,9.7,6l4.735,4.735L9.7,15.47Z"
                transform="translate(-8.59 -6)"
              />
            </svg>
          </span>
        </div>
      </li>`;
    }
    renderNonClickableListItem(item, fields) {
      return html` ${repeat(
        fields,
        (f) => f.Id,
        (f) =>
          html`<div class="FieldType_${f.Type}">
            ${this.FieldWriter_TOBEDISCONTINUED[f.Type](item, f)}
          </div>`
      )}`;
    }
    renderSubDetailView(list, section) {
      return html`${this.subViewState.selected
        ? until(
            this.renderSliderDetailView(
              list.find(
                (e) =>
                  e[section.Options.ListItemIdentifier] ==
                  this.subViewState.selected
              ),
              section.Options.TemplateId
            ),
            html``
          )
        : html``}`;
    }
    async renderSliderDetailView(data, templateId) {
      let template = await this.templateRetriever.getTemplateFromTemplateId(
        templateId
      );
      let sections = template.Template.Content;
      return html` <div class="slide-in" id="slider">
        <div class="detail-view ${this.host.viewClass}">
          <div class="container-button">${this.renderBackButton()}</div>
          <div>${this.renderData(data, sections)}</div>
        </div>
      </div>`;
    }
    renderNonClickableList(data, section) {
      let listName = section.Options.Source;
      let list = data[listName];
      let listItemIdentifier = section.Options.ListItemIdentifier;
      if (list.length == 0) return html``;
      return html` <div>
        ${repeat(
          list,
          (i) => i[listItemIdentifier],
          (i) => this.renderNonClickableListItem(i, section.Fields)
        )}
      </div>`;
    }
  }

  let GenericDetailView = class GenericDetailView extends LitElement {
    constructor() {
      super();
      this.templateEngine = null;
      let templateRetriever = new TemplateRetriever();
      this.templateEngine = new TemplateEngine(templateRetriever, this);
    }
    firstUpdated() {}
    reRender(data, template, css) {
      this.data = data;
      this.template = template;
      this.requestUpdate();
      this.css = css;
    }
    //-------------------------------------------------------------------------
    //
    //  Private methods Section...
    //
    //-------------------------------------------------------------------------
    render() {
      if (!this.data) {
        this.requestUpdate();
        return null;
      }
      return html`
            <link rel='stylesheet' href='color.css'>
            <link rel='stylesheet' href='site.css'>
            <link rel='stylesheet' href='genericdetailview.css'>
        <link rel='stylesheet' href='${this.stylingPath}'>
        <link rel="stylesheet" href="/api/css/?tag=${this.tagName}&cid=${
        this.templateId
      }">
        <style>${this.css}</style>

                <div class="panel">
                    <div class='detail-view ${this.viewClass}'">
                        <div class='content'>
                            ${this.templateEngine.renderData(
                              this.data,
                              this.template
                            )}
                        </div>
                </div>
            </div> `;
    }
  };
  __decorate([property()], GenericDetailView.prototype, "data", void 0);
  __decorate([property()], GenericDetailView.prototype, "template", void 0);
  __decorate(
    [property({ type: String })],
    GenericDetailView.prototype,
    "viewClass",
    void 0
  );
  __decorate(
    [property({ type: String })],
    GenericDetailView.prototype,
    "stylingPath",
    void 0
  );
  __decorate(
    [property()],
    GenericDetailView.prototype,
    "loadExternalData",
    void 0
  );
  __decorate([property()], GenericDetailView.prototype, "templateId", void 0);
  __decorate(
    [property()],
    GenericDetailView.prototype,
    "openPopUpExternalData",
    void 0
  );
  __decorate(
    [cancelclick()],
    GenericDetailView.prototype,
    "firstUpdated",
    null
  );
  GenericDetailView = __decorate(
    [customElement("generic-detail-view")],
    GenericDetailView
  );
})();
//# sourceMappingURL=genericdetailview.js.map
