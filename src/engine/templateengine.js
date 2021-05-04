(() => {
  var directives = new WeakMap(),
    directive = (f) => (...args) => {
      let d = f(...args);
      return directives.set(d, !0), d;
    },
    isDirective = (o) => typeof o == "function" && directives.has(o);
  var isCEPolyfill =
      typeof window != "undefined" &&
      window.customElements != null &&
      window.customElements.polyfillWrapFlushCallback !== void 0,
    reparentNodes = (container, start, end = null, before = null) => {
      for (; start !== end; ) {
        let n = start.nextSibling;
        container.insertBefore(start, before), (start = n);
      }
    },
    removeNodes = (container, start, end = null) => {
      for (; start !== end; ) {
        let n = start.nextSibling;
        container.removeChild(start), (start = n);
      }
    };
  var noChange = {},
    nothing = {};
  var marker = `{{lit-${String(Math.random()).slice(2)}}}`,
    nodeMarker = `<!--${marker}-->`,
    markerRegex = new RegExp(`${marker}|${nodeMarker}`),
    boundAttributeSuffix = "$lit$";
  var isTemplatePartActive = (part) => part.index !== -1,
    createMarker = () => document.createComment(""),
    lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
  var TemplateInstance = class {
    constructor(template, processor, options) {
      (this.__parts = []),
        (this.template = template),
        (this.processor = processor),
        (this.options = options);
    }
    update(values) {
      let i = 0;
      for (let part of this.__parts)
        part !== void 0 && part.setValue(values[i]), i++;
      for (let part of this.__parts) part !== void 0 && part.commit();
    }
    _clone() {
      let fragment = isCEPolyfill
          ? this.template.element.content.cloneNode(!0)
          : document.importNode(this.template.element.content, !0),
        stack = [],
        parts2 = this.template.parts,
        walker = document.createTreeWalker(fragment, 133, null, !1),
        partIndex = 0,
        nodeIndex = 0,
        part,
        node = walker.nextNode();
      for (; partIndex < parts2.length; ) {
        if (((part = parts2[partIndex]), !isTemplatePartActive(part))) {
          this.__parts.push(void 0), partIndex++;
          continue;
        }
        for (; nodeIndex < part.index; )
          nodeIndex++,
            node.nodeName === "TEMPLATE" &&
              (stack.push(node), (walker.currentNode = node.content)),
            (node = walker.nextNode()) === null &&
              ((walker.currentNode = stack.pop()), (node = walker.nextNode()));
        if (part.type === "node") {
          let part2 = this.processor.handleTextExpression(this.options);
          part2.insertAfterNode(node.previousSibling), this.__parts.push(part2);
        } else
          this.__parts.push(
            ...this.processor.handleAttributeExpressions(
              node,
              part.name,
              part.strings,
              this.options
            )
          );
        partIndex++;
      }
      return (
        isCEPolyfill &&
          (document.adoptNode(fragment), customElements.upgrade(fragment)),
        fragment
      );
    }
  };
  var policy =
      window.trustedTypes &&
      trustedTypes.createPolicy("lit-html", { createHTML: (s) => s }),
    commentMarker = ` ${marker} `,
    TemplateResult = class {
      constructor(strings, values, type, processor) {
        (this.strings = strings),
          (this.values = values),
          (this.type = type),
          (this.processor = processor);
      }
      getHTML() {
        let l = this.strings.length - 1,
          html2 = "",
          isCommentBinding = !1;
        for (let i = 0; i < l; i++) {
          let s = this.strings[i],
            commentOpen = s.lastIndexOf("<!--");
          isCommentBinding =
            (commentOpen > -1 || isCommentBinding) &&
            s.indexOf("-->", commentOpen + 1) === -1;
          let attributeMatch = lastAttributeNameRegex.exec(s);
          attributeMatch === null
            ? (html2 += s + (isCommentBinding ? commentMarker : nodeMarker))
            : (html2 +=
                s.substr(0, attributeMatch.index) +
                attributeMatch[1] +
                attributeMatch[2] +
                boundAttributeSuffix +
                attributeMatch[3] +
                marker);
        }
        return (html2 += this.strings[l]), html2;
      }
      getTemplateElement() {
        let template = document.createElement("template"),
          value = this.getHTML();
        return (
          policy !== void 0 && (value = policy.createHTML(value)),
          (template.innerHTML = value),
          template
        );
      }
    };
  var isPrimitive = (value) =>
      value === null ||
      !(typeof value == "object" || typeof value == "function"),
    isIterable = (value) =>
      Array.isArray(value) || !!(value && value[Symbol.iterator]),
    AttributeCommitter = class {
      constructor(element, name, strings) {
        (this.dirty = !0),
          (this.element = element),
          (this.name = name),
          (this.strings = strings),
          (this.parts = []);
        for (let i = 0; i < strings.length - 1; i++)
          this.parts[i] = this._createPart();
      }
      _createPart() {
        return new AttributePart(this);
      }
      _getValue() {
        let strings = this.strings,
          l = strings.length - 1,
          parts2 = this.parts;
        if (l === 1 && strings[0] === "" && strings[1] === "") {
          let v = parts2[0].value;
          if (typeof v == "symbol") return String(v);
          if (typeof v == "string" || !isIterable(v)) return v;
        }
        let text = "";
        for (let i = 0; i < l; i++) {
          text += strings[i];
          let part = parts2[i];
          if (part !== void 0) {
            let v = part.value;
            if (isPrimitive(v) || !isIterable(v))
              text += typeof v == "string" ? v : String(v);
            else for (let t of v) text += typeof t == "string" ? t : String(t);
          }
        }
        return (text += strings[l]), text;
      }
      commit() {
        this.dirty &&
          ((this.dirty = !1),
          this.element.setAttribute(this.name, this._getValue()));
      }
    },
    AttributePart = class {
      constructor(committer) {
        (this.value = void 0), (this.committer = committer);
      }
      setValue(value) {
        value !== noChange &&
          (!isPrimitive(value) || value !== this.value) &&
          ((this.value = value),
          isDirective(value) || (this.committer.dirty = !0));
      }
      commit() {
        for (; isDirective(this.value); ) {
          let directive2 = this.value;
          (this.value = noChange), directive2(this);
        }
        this.value !== noChange && this.committer.commit();
      }
    },
    NodePart = class {
      constructor(options) {
        (this.value = void 0),
          (this.__pendingValue = void 0),
          (this.options = options);
      }
      appendInto(container) {
        (this.startNode = container.appendChild(createMarker())),
          (this.endNode = container.appendChild(createMarker()));
      }
      insertAfterNode(ref) {
        (this.startNode = ref), (this.endNode = ref.nextSibling);
      }
      appendIntoPart(part) {
        part.__insert((this.startNode = createMarker())),
          part.__insert((this.endNode = createMarker()));
      }
      insertAfterPart(ref) {
        ref.__insert((this.startNode = createMarker())),
          (this.endNode = ref.endNode),
          (ref.endNode = this.startNode);
      }
      setValue(value) {
        this.__pendingValue = value;
      }
      commit() {
        if (this.startNode.parentNode === null) return;
        for (; isDirective(this.__pendingValue); ) {
          let directive2 = this.__pendingValue;
          (this.__pendingValue = noChange), directive2(this);
        }
        let value = this.__pendingValue;
        value !== noChange &&
          (isPrimitive(value)
            ? value !== this.value && this.__commitText(value)
            : value instanceof TemplateResult
            ? this.__commitTemplateResult(value)
            : value instanceof Node
            ? this.__commitNode(value)
            : isIterable(value)
            ? this.__commitIterable(value)
            : value === nothing
            ? ((this.value = nothing), this.clear())
            : this.__commitText(value));
      }
      __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      __commitNode(value) {
        this.value !== value &&
          (this.clear(), this.__insert(value), (this.value = value));
      }
      __commitText(value) {
        let node = this.startNode.nextSibling;
        value = value ?? "";
        let valueAsString = typeof value == "string" ? value : String(value);
        node === this.endNode.previousSibling && node.nodeType === 3
          ? (node.data = valueAsString)
          : this.__commitNode(document.createTextNode(valueAsString)),
          (this.value = value);
      }
      __commitTemplateResult(value) {
        let template = this.options.templateFactory(value);
        if (
          this.value instanceof TemplateInstance &&
          this.value.template === template
        )
          this.value.update(value.values);
        else {
          let instance = new TemplateInstance(
              template,
              value.processor,
              this.options
            ),
            fragment = instance._clone();
          instance.update(value.values),
            this.__commitNode(fragment),
            (this.value = instance);
        }
      }
      __commitIterable(value) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        let itemParts = this.value,
          partIndex = 0,
          itemPart;
        for (let item of value)
          (itemPart = itemParts[partIndex]),
            itemPart === void 0 &&
              ((itemPart = new NodePart(this.options)),
              itemParts.push(itemPart),
              partIndex === 0
                ? itemPart.appendIntoPart(this)
                : itemPart.insertAfterPart(itemParts[partIndex - 1])),
            itemPart.setValue(item),
            itemPart.commit(),
            partIndex++;
        partIndex < itemParts.length &&
          ((itemParts.length = partIndex),
          this.clear(itemPart && itemPart.endNode));
      }
      clear(startNode = this.startNode) {
        removeNodes(
          this.startNode.parentNode,
          startNode.nextSibling,
          this.endNode
        );
      }
    },
    BooleanAttributePart = class {
      constructor(element, name, strings) {
        if (
          ((this.value = void 0),
          (this.__pendingValue = void 0),
          strings.length !== 2 || strings[0] !== "" || strings[1] !== "")
        )
          throw new Error(
            "Boolean attributes can only contain a single expression"
          );
        (this.element = element), (this.name = name), (this.strings = strings);
      }
      setValue(value) {
        this.__pendingValue = value;
      }
      commit() {
        for (; isDirective(this.__pendingValue); ) {
          let directive2 = this.__pendingValue;
          (this.__pendingValue = noChange), directive2(this);
        }
        if (this.__pendingValue === noChange) return;
        let value = !!this.__pendingValue;
        this.value !== value &&
          (value
            ? this.element.setAttribute(this.name, "")
            : this.element.removeAttribute(this.name),
          (this.value = value)),
          (this.__pendingValue = noChange);
      }
    },
    PropertyCommitter = class extends AttributeCommitter {
      constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
          strings.length === 2 && strings[0] === "" && strings[1] === "";
      }
      _createPart() {
        return new PropertyPart(this);
      }
      _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
      }
      commit() {
        this.dirty &&
          ((this.dirty = !1), (this.element[this.name] = this._getValue()));
      }
    },
    PropertyPart = class extends AttributePart {},
    eventOptionsSupported = !1;
  (() => {
    try {
      let options = {
        get capture() {
          return (eventOptionsSupported = !0), !1;
        },
      };
      window.addEventListener("test", options, options),
        window.removeEventListener("test", options, options);
    } catch (_e) {}
  })();
  var EventPart = class {
      constructor(element, eventName, eventContext) {
        (this.value = void 0),
          (this.__pendingValue = void 0),
          (this.element = element),
          (this.eventName = eventName),
          (this.eventContext = eventContext),
          (this.__boundHandleEvent = (e) => this.handleEvent(e));
      }
      setValue(value) {
        this.__pendingValue = value;
      }
      commit() {
        for (; isDirective(this.__pendingValue); ) {
          let directive2 = this.__pendingValue;
          (this.__pendingValue = noChange), directive2(this);
        }
        if (this.__pendingValue === noChange) return;
        let newListener = this.__pendingValue,
          oldListener = this.value,
          shouldRemoveListener =
            newListener == null ||
            (oldListener != null &&
              (newListener.capture !== oldListener.capture ||
                newListener.once !== oldListener.once ||
                newListener.passive !== oldListener.passive)),
          shouldAddListener =
            newListener != null &&
            (oldListener == null || shouldRemoveListener);
        shouldRemoveListener &&
          this.element.removeEventListener(
            this.eventName,
            this.__boundHandleEvent,
            this.__options
          ),
          shouldAddListener &&
            ((this.__options = getOptions(newListener)),
            this.element.addEventListener(
              this.eventName,
              this.__boundHandleEvent,
              this.__options
            )),
          (this.value = newListener),
          (this.__pendingValue = noChange);
      }
      handleEvent(event) {
        typeof this.value == "function"
          ? this.value.call(this.eventContext || this.element, event)
          : this.value.handleEvent(event);
      }
    },
    getOptions = (o) =>
      o &&
      (eventOptionsSupported
        ? { capture: o.capture, passive: o.passive, once: o.once }
        : o.capture);
  var DefaultTemplateProcessor = class {
      handleAttributeExpressions(element, name, strings, options) {
        let prefix = name[0];
        return prefix === "."
          ? new PropertyCommitter(element, name.slice(1), strings).parts
          : prefix === "@"
          ? [new EventPart(element, name.slice(1), options.eventContext)]
          : prefix === "?"
          ? [new BooleanAttributePart(element, name.slice(1), strings)]
          : new AttributeCommitter(element, name, strings).parts;
      }
      handleTextExpression(options) {
        return new NodePart(options);
      }
    },
    defaultTemplateProcessor = new DefaultTemplateProcessor();
  var templateCaches = new Map();
  var parts = new WeakMap();
  typeof window != "undefined" &&
    (window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.3.0");
  var html = (strings, ...values) =>
    new TemplateResult(strings, values, "html", defaultTemplateProcessor);
  var createAndInsertPart = (containerPart, beforePart) => {
      let container = containerPart.startNode.parentNode,
        beforeNode =
          beforePart === void 0 ? containerPart.endNode : beforePart.startNode,
        startNode = container.insertBefore(createMarker(), beforeNode);
      container.insertBefore(createMarker(), beforeNode);
      let newPart = new NodePart(containerPart.options);
      return newPart.insertAfterNode(startNode), newPart;
    },
    updatePart = (part, value) => (part.setValue(value), part.commit(), part),
    insertPartBefore = (containerPart, part, ref) => {
      let container = containerPart.startNode.parentNode,
        beforeNode = ref ? ref.startNode : containerPart.endNode,
        endNode = part.endNode.nextSibling;
      endNode !== beforeNode &&
        reparentNodes(container, part.startNode, endNode, beforeNode);
    },
    removePart = (part) => {
      removeNodes(
        part.startNode.parentNode,
        part.startNode,
        part.endNode.nextSibling
      );
    },
    generateMap = (list, start, end) => {
      let map = new Map();
      for (let i = start; i <= end; i++) map.set(list[i], i);
      return map;
    },
    partListCache = new WeakMap(),
    keyListCache = new WeakMap(),
    repeat = directive((items, keyFnOrTemplate, template) => {
      let keyFn;
      return (
        template === void 0
          ? (template = keyFnOrTemplate)
          : keyFnOrTemplate !== void 0 && (keyFn = keyFnOrTemplate),
        (containerPart) => {
          if (!(containerPart instanceof NodePart))
            throw new Error("repeat can only be used in text bindings");
          let oldParts = partListCache.get(containerPart) || [],
            oldKeys = keyListCache.get(containerPart) || [],
            newParts = [],
            newValues = [],
            newKeys = [],
            index = 0;
          for (let item of items)
            (newKeys[index] = keyFn ? keyFn(item, index) : index),
              (newValues[index] = template(item, index)),
              index++;
          let newKeyToIndexMap,
            oldKeyToIndexMap,
            oldHead = 0,
            oldTail = oldParts.length - 1,
            newHead = 0,
            newTail = newValues.length - 1;
          for (; oldHead <= oldTail && newHead <= newTail; )
            if (oldParts[oldHead] === null) oldHead++;
            else if (oldParts[oldTail] === null) oldTail--;
            else if (oldKeys[oldHead] === newKeys[newHead])
              (newParts[newHead] = updatePart(
                oldParts[oldHead],
                newValues[newHead]
              )),
                oldHead++,
                newHead++;
            else if (oldKeys[oldTail] === newKeys[newTail])
              (newParts[newTail] = updatePart(
                oldParts[oldTail],
                newValues[newTail]
              )),
                oldTail--,
                newTail--;
            else if (oldKeys[oldHead] === newKeys[newTail])
              (newParts[newTail] = updatePart(
                oldParts[oldHead],
                newValues[newTail]
              )),
                insertPartBefore(
                  containerPart,
                  oldParts[oldHead],
                  newParts[newTail + 1]
                ),
                oldHead++,
                newTail--;
            else if (oldKeys[oldTail] === newKeys[newHead])
              (newParts[newHead] = updatePart(
                oldParts[oldTail],
                newValues[newHead]
              )),
                insertPartBefore(
                  containerPart,
                  oldParts[oldTail],
                  oldParts[oldHead]
                ),
                oldTail--,
                newHead++;
            else if (
              (newKeyToIndexMap === void 0 &&
                ((newKeyToIndexMap = generateMap(newKeys, newHead, newTail)),
                (oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail))),
              !newKeyToIndexMap.has(oldKeys[oldHead]))
            )
              removePart(oldParts[oldHead]), oldHead++;
            else if (!newKeyToIndexMap.has(oldKeys[oldTail]))
              removePart(oldParts[oldTail]), oldTail--;
            else {
              let oldIndex = oldKeyToIndexMap.get(newKeys[newHead]),
                oldPart = oldIndex !== void 0 ? oldParts[oldIndex] : null;
              if (oldPart === null) {
                let newPart = createAndInsertPart(
                  containerPart,
                  oldParts[oldHead]
                );
                updatePart(newPart, newValues[newHead]),
                  (newParts[newHead] = newPart);
              } else
                (newParts[newHead] = updatePart(oldPart, newValues[newHead])),
                  insertPartBefore(containerPart, oldPart, oldParts[oldHead]),
                  (oldParts[oldIndex] = null);
              newHead++;
            }
          for (; newHead <= newTail; ) {
            let newPart = createAndInsertPart(
              containerPart,
              newParts[newTail + 1]
            );
            updatePart(newPart, newValues[newHead]),
              (newParts[newHead++] = newPart);
          }
          for (; oldHead <= oldTail; ) {
            let oldPart = oldParts[oldHead++];
            oldPart !== null && removePart(oldPart);
          }
          partListCache.set(containerPart, newParts),
            keyListCache.set(containerPart, newKeys);
        }
      );
    });
  var _state = new WeakMap(),
    _infinity = 2147483647,
    until = directive((...args) => (part) => {
      let state = _state.get(part);
      state === void 0 &&
        ((state = { lastRenderedIndex: _infinity, values: [] }),
        _state.set(part, state));
      let previousValues = state.values,
        previousLength = previousValues.length;
      state.values = args;
      for (let i = 0; i < args.length && !(i > state.lastRenderedIndex); i++) {
        let value = args[i];
        if (isPrimitive(value) || typeof value.then != "function") {
          part.setValue(value), (state.lastRenderedIndex = i);
          break;
        }
        (i < previousLength && value === previousValues[i]) ||
          ((state.lastRenderedIndex = _infinity),
          (previousLength = 0),
          Promise.resolve(value).then((resolvedValue) => {
            let index = state.values.indexOf(value);
            index > -1 &&
              index < state.lastRenderedIndex &&
              ((state.lastRenderedIndex = index),
              part.setValue(resolvedValue),
              part.commit());
          }));
      }
    });
  var DataValidator = class {
    static isEmpty(value) {
      return value === null || value === "" || value === void 0;
    }
    static isEmptyDataWithLabel(data, label) {
      return !!(this.isEmpty(data) && label.includes("!"));
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
        ),
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
      return this.isValidFormat(format) ? format : "";
    }
  };
  var CheckboxService = class {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getCheckboxWithLabel(data, field) {
      let label = field.Label,
        temp = this._dataHelper.getDataFromField(data, field);
      DataValidator.isEmpty(temp) && (temp = "false"),
        (temp = temp.toLowerCase());
      let checkbox =
          temp === "true" || temp === "yes"
            ? html`<input type="checkbox" checked />`
            : html`<input type="checkbox" />`,
        text = html`<div class="checkboxContainer">
          ${checkbox}
          <span class="checkmark"></span>
          <span class="${field.Format}">${label}</span>
        </div> `;
      return this._dataHelper.outputValidator(data, field, text);
    }
  };
  var PeriodTypes;
  (function (PeriodTypes2) {
    (PeriodTypes2.Hour = "Hour"),
      (PeriodTypes2.Day = "Day"),
      (PeriodTypes2.Week = "Week"),
      (PeriodTypes2.Month = "Month"),
      (PeriodTypes2.Year = "Year");
  })(PeriodTypes || (PeriodTypes = {}));
  function calculateWeekNo(d) {
    let dayMap = [6, 0, 1, 2, 3, 4, 5],
      year = d.getFullYear(),
      month = d.getMonth(),
      day = d.getDate(),
      dow = dayMap[d.getDay()],
      mondayInWeek = Date.UTC(year, month, day - dow),
      jan1st = new Date(Date.UTC(year, 0, 1)),
      jan1stDow = dayMap[jan1st.getDay()],
      firstMondayOfYear =
        jan1stDow < 4
          ? Date.UTC(year - 1, 11, 32 - jan1stDow)
          : Date.UTC(year, 0, 7 - jan1stDow),
      diff = mondayInWeek - firstMondayOfYear;
    return Math.floor(1 + diff / 6048e5);
  }
  var DateFormatter = class {
      constructor(locale = null) {
        this._dateFormatMap = new Map();
        this._locale = locale || this.getCurrentLocale();
      }
      dateFormat(date, format) {
        let dateFormat = this._dateFormatMap.get(format);
        dateFormat ||
          ((dateFormat = this.parseDateFormat(format)),
          this._dateFormatMap.set(format, dateFormat));
        let dateTimeFormatResults = Intl.DateTimeFormat(
            this._locale,
            dateFormat.options
          ).formatToParts(date),
          processResult = (dateFormatResult, value) =>
            dateFormatResult.postProcess
              ? dateFormatResult.postProcess(value)
              : value,
          resultData = dateFormat.createResultData();
        return (
          dateTimeFormatResults.forEach((df) => {
            let dateFormatResult = dateFormat.getDateFormatData(df.type);
            dateFormatResult &&
              (resultData[dateFormatResult.index] = processResult(
                dateFormatResult,
                df.value
              ));
          }),
          dateFormat
            .getSpecialDirectives()
            .forEach(
              (dateFormatResult) =>
                (resultData[dateFormatResult.index] = processResult(
                  dateFormatResult,
                  dateFormatResult.specialDirective(date)
                ))
            ),
          [...resultData.filter((v) => v)].join("")
        );
      }
      getCurrentLocale() {
        return window.navigator.languages
          ? window.navigator.languages[0]
          : window.navigator.language;
      }
      parseDateFormat(format) {
        let length = format.length,
          result = new DateFormatData(),
          resultIx = 0,
          position = 0,
          options,
          literalPosition = 0;
        for (; position < length; ) {
          let dateOption = dateOptions[format[position]];
          if (dateOption) {
            let patternLength = this.parseRepeatPattern(
                format,
                format[position],
                position,
                length
              ),
              pattern = format.substr(position, patternLength),
              optionsMatched = dateOption[pattern];
            if (optionsMatched) {
              literalPosition != position &&
                result.addLiteral(
                  format.substr(literalPosition, position - literalPosition)
                );
              let specialDirective = optionsMatched.specialDirective,
                postProcessResult = optionsMatched.postProcess;
              if (specialDirective)
                result.addSpecialDirective(specialDirective, postProcessResult);
              else {
                let entries = Object.entries(optionsMatched.options),
                  [key, value] = entries[0];
                result.addOptions(key, entries, postProcessResult);
              }
              dateOption.localeExtention &&
                dateOption.localeExtention.forEach((le) =>
                  result.addExtention(le)
                ),
                (position += patternLength),
                (literalPosition = position);
              continue;
            }
          }
          position++;
        }
        return (
          literalPosition != position &&
            result.addLiteral(
              format.substr(literalPosition, position - literalPosition)
            ),
          result
        );
      }
      parseRepeatPattern(format, patternChar, position, length) {
        let index = position + 1;
        for (; index < length && format[index] == patternChar; ) index++;
        return index - position;
      }
    },
    dateOptions = {
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
    },
    DateFormatResultData = class {
      constructor(index, specialDirective, postProcess) {
        (this.index = index),
          (this.specialDirective = specialDirective),
          (this.postProcess = postProcess);
      }
    },
    DateFormatData = class {
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
      getDateFormatData(directive2) {
        return this._optionsMap.get(directive2);
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
      addOptions(directive2, entries, postProcessResult) {
        this._optionsMap.set(
          directive2,
          new DateFormatResultData(this._index++, null, postProcessResult)
        );
        for (let [key, value] of entries) this._options[key] = value;
      }
      addExtention(extention) {
        this._optionsMap.set(
          extention,
          new DateFormatResultData(this._index++, null, null)
        );
      }
      createResultData() {
        let result = new Array(this._index++);
        return (
          this._literals.forEach(
            (literal) => (result[literal.index] = literal.value)
          ),
          result
        );
      }
    };
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
  var DateService = class {
    constructor(dataHelper) {
      this._dateFormatter = null;
      (this._dataHelper = dataHelper),
        (this._dateFormatter = new DateFormatter());
    }
    getDate(data, field) {
      let date = data[field.Value];
      if (field.Value.includes(".")) {
        let objectToSplit = field.Value.split("."),
          object = objectToSplit[0],
          value = objectToSplit[1];
        date = data[object][value];
      }
      if (date === void 0 || date === "" || date === null)
        try {
          let text = html`${this._dataHelper.toggleLabel(field)}
            <span class="${field.Format}"></span>`;
          return this._dataHelper.outputValidator(data, field, text);
        } catch (error) {
          console.log(error.message);
        }
      try {
        let formatedDate = this._dateFormatter.dateFormat(
            new Date(date),
            field.Format
          ),
          text = html`${this._dataHelper.toggleLabel(field)}
            <span class="${field.Format}">${formatedDate}</span>`;
        return this._dataHelper.outputValidator(data, field, text);
      } catch (error) {
        console.log(`Error in field ${field.Type}:`, error.message),
          error instanceof RangeError &&
            console.log(
              "Possible solutions: Value does not exist in dataset, or typos in template properties"
            );
      }
    }
    getDateNoLabel(data, field) {
      let date = this._dateFormatter.dateFormat(
          new Date(data[field.Value]),
          field.Format
        ),
        text = html`<span class="${field.Format}">${date}</span>`;
      return html`<span id="${field.Id}" class="FieldType_${field.Type}"
        >${text}</span
      >`;
    }
  };
  var IconService = class {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getIconWithLabel(data, field) {
      let label = field.Label,
        icon = field.Value,
        text = html`<img src=${icon} alt="${label}" />
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
  };
  var LinkService = class {
    static getLinktoHTML(data, field) {
      return html`<span class="label">${field.Label} </span>
        <a class="${field.Format}" href="url" target="_blank"
          >${data[field.Value]}</a
        >`;
    }
  };
  var ListService = class {
    static getSortedList(list, section) {
      let sortorder = section.Options.SortOrder;
      if (section.Options.SortOrder == null) return list;
      let sortValue = section.Fields[0].Value;
      switch (sortorder) {
        case "Asc":
          return this.sortList(list, sortValue, 1);
        case "Desc":
          return this.sortList(list, sortValue, -1);
        default:
          return list;
      }
    }
    static sortList(list, sortValue, number) {
      return list.sort(
        (a, b) => number * a[sortValue].localeCompare(b[sortValue])
      );
    }
  };
  var ObjectService = class {
    static getObjectValuesWithDevider(data, field) {
      let objectToSplit = field.Value.split(" "),
        object = objectToSplit[0],
        devider = objectToSplit[1],
        dataObject = data[object],
        code = dataObject.Code,
        name = dataObject.Name;
      return html`<span class="label">${field.Label}</span>
        <span class="${field.Format}">${code} ${devider} ${name}</span>`;
    }
  };
  var DataFormatter = class {
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
  };
  var TextService = class {
    constructor(dataHelper) {
      this._dataHelper = dataHelper;
    }
    getTextOneLine(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field),
        dataSpan = DataFormatter.encapsulateTextInSpanWithClass(
          tempData,
          "text " + field.Format
        ),
        text = html`${this._dataHelper.toggleLabel(field)} ${dataSpan}`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getTextTwoLines(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field),
        labelSpan = this._dataHelper.toggleLabel(field);
      if (DataValidator.isEmpty(tempData))
        try {
          return field.Label.includes("!") ? html`` : html`${labelSpan}`;
        } catch (error) {
          return console.log("Field.Label needs a value."), html``;
        }
      let isMultiline = tempData.length > 60,
        textClass = isMultiline ? "multiline" : "",
        formatting = DataValidator.getValidFormat(field.Format),
        text,
        isNumber = DataValidator.isNumber(formatting),
        isEmpty = DataValidator.isEmpty(formatting),
        dataSpan;
      if (isMultiline && (isNumber || isEmpty)) {
        let styling = isNumber && !isEmpty ? formatting : 5;
        (dataSpan = DataFormatter.encapsulateTextInSpanWithClass(
          tempData,
          "text"
        )),
          (text = html`${labelSpan}
            <div
              class="textContainer ${textClass}"
              style="max-height:${styling}em"
              id="${textClass}"
            >
              ${dataSpan}
            </div> `);
      } else
        (dataSpan = DataFormatter.encapsulateTextInSpanWithClass(
          tempData,
          "text " + formatting
        )),
          (text = html`${labelSpan}${dataSpan}`);
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
        let tempData = this._dataHelper.getDataFromField(data, field),
          text = DataFormatter.getTextSpanWithFormatting(tempData, field);
        return DataFormatter.encapsulateFieldTypeOutputInSpan(text, field);
      } catch (error) {
        console.log("Error in text with no label properties");
      }
    }
    getArrayValues(data, field) {
      let array = data[field.Value],
        labelWithFormatting = this._dataHelper.getLabelWithLabelFormatting(
          field
        );
      if (array.length > 0) {
        let text2 = html` ${labelWithFormatting}
          <span class="arrayContainer"
            >${array.map((i) => html` <span>${i}</span> `)}</span
          >`;
        return DataFormatter.encapsulateFieldTypeOutputInSpan(text2, field);
      }
      let text = html`${labelWithFormatting}`;
      return DataFormatter.encapsulateFieldTypeOutputInSpan(text, field);
    }
    getValueWithDenomination(data, field) {
      let tempData = this._dataHelper.getDataFromField(data, field),
        dataSpan = DataFormatter.encapsulateTextInSpanWithClass(
          tempData,
          field.Format
        ),
        labelSpan = this._dataHelper.toggleLabel(field),
        text = html`${labelSpan} ${dataSpan}`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    staticText(data, field) {
      let text = html`${this._dataHelper.toggleLabel(
        field
      )}${this._dataHelper.toggleValue(field)}`;
      return DataFormatter.encapsulateFieldTypeOutputInSpan(text, field);
    }
    formattedNumbers(data, field) {
      let formatArray = field.Format.split("."),
        textNumber = parseFloat(this._dataHelper.getDataFromField(data, field)),
        roundedNumber = Math.pow(10, parseFloat(formatArray[0])),
        formattedText = Math.round(textNumber * roundedNumber) / roundedNumber,
        text = html`${this._dataHelper.toggleLabel(field)}
          <span class="text">${formattedText} ${formatArray[1]}</span>`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getSplitStringOnFirstOccurenceSelectSpecificPart(data, field, item) {
      try {
        let separator = field.Format,
          text = (DataValidator.isEmpty(
            this._dataHelper.getDataFromField(data, field)
          )
            ? ""
            : this._dataHelper.getDataFromField(data, field)
          ).split(separator)[item],
          output = html`${this._dataHelper.toggleLabel(field)}
          ${DataFormatter.encapsulateTextInSpanWithClass(text, "text")}`;
        return DataValidator.isEmpty(
          this._dataHelper.getDataFromField(data, field)
        ) && field.Label.includes("!")
          ? html``
          : DataFormatter.encapsulateFieldTypeOutputInSpan(output, field);
      } catch (error) {
        return html``;
      }
    }
    customBooleanValues(data, field) {
      let booleanValues = field.Format.split("."),
        decider =
          this._dataHelper.getDataFromField(data, field).toLowerCase() ===
            "true" ||
          this._dataHelper.getDataFromField(data, field).toLowerCase() ===
            "yes",
        text = html`${this._dataHelper.toggleLabel(field)}
          <span class="text"
            >${decider
              ? html`${booleanValues[0]}`
              : html`${booleanValues[1]}`}</span
          >`;
      return this._dataHelper.outputValidator(data, field, text);
    }
    getConcattedValues(data, field) {
      let text = this._dataHelper.getConcattedValuesWithSeparator(data, field),
        input = html`${this._dataHelper.toggleLabel(
          field
        )}${DataFormatter.encapsulateTextInSpanWithClass(text, "text")}`;
      return DataFormatter.encapsulateFieldTypeOutputInSpan(input, field);
    }
    getStringReplaceWithData(data, field) {
      try {
        let array = field.Value.split("|"),
          tempData,
          stringToBeUpdated = array[0];
        for (let i = 1; i < array.length; i++) {
          let tempField = array[i];
          (tempData = this._dataHelper.getStringFromObject(data, tempField)),
            (stringToBeUpdated = stringToBeUpdated.replace("$", tempData));
        }
        let text = html`${this._dataHelper.toggleLabel(
          field
        )}${DataFormatter.encapsulateTextInSpanWithClass(
          stringToBeUpdated,
          "text"
        )}`;
        return DataFormatter.encapsulateFieldTypeOutputInSpan(text, field);
      } catch (error) {
        console.log(error);
      }
    }
    getValueInComplexObject(data, field) {
      let objectToSplit = field.Value.split("."),
        temp,
        result,
        element;
      for (let i = 0; i < objectToSplit.length; i++)
        if (((temp = objectToSplit[i]), temp.includes("["))) {
          let [object, rest] = this._dataHelper.getSplitValues(temp, "[");
          if (rest.includes("|")) {
            let [key, value] = this._dataHelper.getSplitValues(rest, "|"),
              val = value.split("]")[0],
              objectData = data[object];
            (element = this._dataHelper.getElementFromKey(
              objectData,
              key,
              val
            )),
              (result = element);
            continue;
          } else {
            let elm = element[object],
              tempVal = rest.split("]")[0];
            result = elm[tempVal];
            continue;
          }
        } else {
          result = this._dataHelper.getReturnType(result[temp], field);
          continue;
        }
      return (
        (result = html`${this._dataHelper.toggleLabel(field)}
        ${DataFormatter.encapsulateTextInSpanWithClass(
          result,
          "textcontent " + field.Format
        )}`),
        DataFormatter.encapsulateFieldTypeOutputInSpan(result, field)
      );
    }
  };
  var _BooleanFormatter = class {
      static setCustomBooleanValue(value, trueValue, falseValue) {
        return (
          value instanceof Array &&
            value.map((e) => (e == "true" ? trueValue : falseValue)),
          value === "true" ? trueValue : falseValue
        );
      }
      static join(array, separator) {
        return Array.prototype.join.apply(array, separator);
      }
    },
    BooleanFormatter = _BooleanFormatter;
  BooleanFormatter.booleanfunctions = {
    customBooleanValue: (value, trueValue, falseValue) =>
      _BooleanFormatter.setCustomBooleanValue(value, trueValue, falseValue),
    join: (array, separator) => _BooleanFormatter.join(array, separator),
  };
  var _DateTimeFormatter = class {
      static formatDate(value, format) {
        let dateFormatter = new DateFormatter();
        return (
          value instanceof Array &&
            value.map((e) => dateFormatter.dateFormat(new Date(e), format)),
          dateFormatter.dateFormat(new Date(value), format)
        );
      }
      static join(array, separator) {
        return Array.prototype.join.apply(array, separator);
      }
    },
    DateTimeFormatter = _DateTimeFormatter;
  DateTimeFormatter.datefunctions = {
    formatDate: (value, format) => _DateTimeFormatter.formatDate(value, format),
    join: (array, separator) => _DateTimeFormatter.join(array, separator),
  };
  var _NumberFormatter = class {
      static setDecimales(value, decimales) {
        return (
          value instanceof Array &&
            value.map((e) =>
              _NumberFormatter.roundNumberAndSetDecimales(e, decimales)
            ),
          _NumberFormatter.roundNumberAndSetDecimales(value, decimales)
        );
      }
      static roundNumberAndSetDecimales(value, decimales) {
        let textNumber = parseFloat(value),
          roundedNumber = Math.pow(10, parseFloat(decimales));
        return (
          Math.round(textNumber * roundedNumber) / roundedNumber
        ).toString();
      }
      static setDenomination(value, denomination) {
        return (value + " ").concat(denomination);
      }
      static join(array, separator) {
        return Array.prototype.join.apply(array, separator);
      }
    },
    NumberFormatter = _NumberFormatter;
  NumberFormatter.numberfunctions = {
    setDenomination: (value, denomination) =>
      _NumberFormatter.setDenomination(value, denomination),
    setDecimales: (value, decimales) =>
      _NumberFormatter.setDecimales(value, decimales),
    join: (array, separator) => _NumberFormatter.join(array, separator),
  };
  function State(options, params, handleQuery2) {
    (options = options || {}),
      (this.handleQuery = handleQuery2),
      (this.options = options),
      (this.locals = this.options.locals || {}),
      (this.globals = this.options.globals || {}),
      (this.rootContext = firstNonNull(
        options.data,
        options.rootContext,
        options.context,
        options.source
      )),
      (this.parent = options.parent),
      (this.override = options.override),
      (this.filters = options.filters || {}),
      (this.params = params || options.params || []),
      (this.context = firstNonNull(
        options.currentItem,
        options.context,
        options.source
      )),
      (this.currentItem = firstNonNull(
        this.context,
        options.rootContext,
        options.data
      )),
      (this.currentKey = null),
      (this.currentReferences = []),
      (this.currentParents = []);
  }
  State.prototype = {
    setCurrent: function (key, value) {
      (this.currentItem || this.currentKey || this.currentParents.length > 0) &&
        this.currentParents.push({
          key: this.currentKey,
          value: this.currentItem,
        }),
        (this.currentItem = value),
        (this.currentKey = key);
    },
    resetCurrent: function () {
      (this.currentItem = null),
        (this.currentKey = null),
        (this.currentParents = []);
    },
    force: function (def) {
      var parent = this.currentParents[this.currentParents.length - 1];
      return (
        !this.currentItem &&
          parent &&
          this.currentKey != null &&
          ((this.currentItem = def || {}),
          (parent.value[this.currentKey] = this.currentItem)),
        !!this.currentItem
      );
    },
    getLocal: function (localName) {
      if (~localName.indexOf("/")) {
        for (
          var result = null, parts2 = localName.split("/"), i = 0;
          i < parts2.length;
          i++
        ) {
          var part = parts2[i];
          i == 0
            ? (result = this.locals[part])
            : result && result[part] && (result = result[part]);
        }
        return result;
      } else return this.locals[localName];
    },
    getGlobal: function (globalName) {
      if (~globalName.indexOf("/")) {
        for (
          var result = null, parts2 = globalName.split("/"), i = 0;
          i < parts2.length;
          i++
        ) {
          var part = parts2[i];
          i == 0
            ? (result = this.globals[part])
            : result && result[part] && (result = result[part]);
        }
        return result;
      } else return this.globals[globalName];
    },
    getFilter: function (filterName) {
      if (~filterName.indexOf("/")) {
        for (
          var result = null, filterParts = filterName.split("/"), i = 0;
          i < filterParts.length;
          i++
        ) {
          var part = filterParts[i];
          i == 0
            ? (result = this.filters[part])
            : result && result[part] && (result = result[part]);
        }
        return result;
      } else return this.filters[filterName];
    },
    addReferences: function (references) {
      references && references.forEach(this.addReference, this);
    },
    addReference: function (ref) {
      ref instanceof Object &&
        !~this.currentReferences.indexOf(ref) &&
        this.currentReferences.push(ref);
    },
    getValues: function (values, callback) {
      return values.map(this.getValue, this);
    },
    getValue: function (value) {
      return this.getValueFrom(value, null);
    },
    getValueFrom: function (value, item) {
      if (value._param != null) return this.params[value._param];
      if (value._sub) {
        let options = copy(this.options);
        (options.force = null), (options.currentItem = item);
        var result = this.handleQuery(value._sub, options, this.params);
        return this.addReferences(result.references), result.value;
      } else return value;
    },
    deepQuery: function (source, tokens, options, callback) {
      var keys = Object.keys(source);
      for (var key in source)
        if (key in source) {
          let options2 = copy(this.options);
          options2.currentItem = source[key];
          var result = this.handleQuery(tokens, options2, this.params);
          if (result.value) return result;
        }
      return null;
    },
  };
  function firstNonNull(...args) {
    for (var i = 0; i < arguments.length; i++)
      if (arguments[i] != null) return arguments[i];
  }
  function copy(obj) {
    var result = {};
    if (obj) for (var key in obj) key in obj && (result[key] = obj[key]);
    return result;
  }
  function depthSplit(text, delimiter, opts) {
    var max = (opts && opts.max) || Infinity,
      includeDelimiters = (opts && opts.includeDelimiters) || !1,
      depth = 0,
      start = 0,
      result = [],
      zones = [];
    text.replace(
      /([\[\(\{])|([\]\)\}])/g,
      function (current, open, close, offset) {
        open
          ? (depth === 0 && zones.push([start, offset]), (depth += 1))
          : close &&
            ((depth -= 1), depth === 0 && (start = offset + current.length));
      }
    ),
      depth === 0 && start < text.length && zones.push([start, text.length]),
      (start = 0);
    for (var i = 0; i < zones.length && max > 0; i++)
      for (
        var pos = zones[i][0],
          match = delimiter.exec(text.slice(pos, zones[i][1]));
        match && max > 1;
        pos += match.index + match[0].length,
          start = pos,
          match = delimiter.exec(text.slice(pos, zones[i][1]))
      )
        result.push(text.slice(start, match.index + pos)),
          includeDelimiters && result.push(match[0]),
          (max -= 1);
    return start < text.length && result.push(text.slice(start)), result;
  }
  function tokenize(query, shouldAssignParamIds) {
    if (!query) return [];
    var result = [],
      prevChar,
      char,
      nextChar = query.charAt(0),
      bStart = 0,
      bEnd = 0,
      partOffset = 0,
      pos = 0,
      depth = 0,
      mode = "get",
      deepQuery = null;
    shouldAssignParamIds && (query = assignParamIds(query));
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
      deepQuery ? deepQuery.push(item) : result.push(item);
    }
    var handlers = {
      get: function (buffer) {
        var trimmed = typeof buffer == "string" ? buffer.trim() : null;
        trimmed && push({ get: trimmed });
      },
      select: function (buffer) {
        if (buffer) push(tokenizeSelect(buffer));
        else {
          var x = { deep: [] };
          result.push(x), (deepQuery = x.deep);
        }
      },
      filter: function (buffer) {
        buffer && push({ filter: buffer.trim() });
      },
      or: function () {
        (deepQuery = null), result.push({ or: !0 }), (partOffset = i + 1);
      },
      args: function (buffer) {
        var args = tokenizeArgs(buffer);
        result[result.length - 1].args = args;
      },
    };
    function handleBuffer() {
      var buffer = query.slice(bStart, bEnd);
      handlers[mode] && handlers[mode](buffer),
        (mode = "get"),
        (bStart = bEnd + 1);
    }
    for (var i = 0; i < query.length; i++) {
      (prevChar = char),
        (char = nextChar),
        (nextChar = query.charAt(i + 1)),
        (pos = i - partOffset),
        pos === 0 && char !== ":" && char !== "." && result.push({ root: !0 }),
        pos === 0 &&
          char === "." &&
          nextChar === "." &&
          result.push({ parent: !0 });
      var token = tokens[char];
      token &&
        (depth === 0 &&
          (token.mode || token.open) &&
          (handleBuffer(), (mode = token.mode || token.open)),
        depth === 0 &&
          token.handle &&
          (handleBuffer(), handlers[token.handle]()),
        token.open ? (depth += 1) : token.close && (depth -= 1),
        depth === 0 && token.close && handleBuffer()),
        (bEnd = i + 1);
    }
    return handleBuffer(), result;
  }
  function tokenizeArgs(argsQuery) {
    return argsQuery === ","
      ? [","]
      : depthSplit(argsQuery, /,/).map(function (s) {
          return handleSelectPart(s.trim());
        });
  }
  function tokenizeSelect(selectQuery) {
    if (selectQuery === "*") return { values: !0 };
    if (selectQuery === "**") return { values: !0, deep: !0 };
    var multiple = !1;
    selectQuery.charAt(0) === "*" &&
      ((multiple = !0), (selectQuery = selectQuery.slice(1)));
    var booleanParts = depthSplit(selectQuery, /&|\|/, {
      includeDelimiters: !0,
    });
    if (booleanParts.length > 1) {
      for (
        var result = [getSelectPart(booleanParts[0].trim())], i = 1;
        i < booleanParts.length;
        i += 2
      ) {
        var part = getSelectPart(booleanParts[i + 1].trim());
        part && ((part.booleanOp = booleanParts[i]), result.push(part));
      }
      return { multiple, boolean: !0, select: result };
    } else {
      let result2 = getSelectPart(selectQuery.trim());
      return result2
        ? (multiple && (result2.multiple = !0), result2)
        : { get: handleSelectPart(selectQuery.trim()) };
    }
  }
  function getSelectPart(selectQuery) {
    var parts2 = depthSplit(selectQuery, /(!)?(=|~|\:|<=|>=|<|>)/, {
      max: 2,
      includeDelimiters: !0,
    });
    if (parts2.length === 3) {
      var negate = parts2[1].charAt(0) === "!",
        key = handleSelectPart(parts2[0].trim());
      let result = { negate, op: negate ? parts2[1].slice(1) : parts2[1] };
      if (result.op === ":")
        result.select = [key, { _sub: module.exports(":" + parts2[2].trim()) }];
      else if (result.op === "~") {
        var value = handleSelectPart(parts2[2].trim());
        if (typeof value == "string") {
          var reDef = parts2[2].trim().match(/^\/(.*)\/([a-z]?)$/);
          reDef
            ? (result.select = [key, new RegExp(reDef[1], reDef[2])])
            : (result.select = [key, value]);
        } else result.select = [key, value];
      } else result.select = [key, handleSelectPart(parts2[2].trim())];
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
    } else return paramToken(part);
  }
  function paramToken(text) {
    if (text.charAt(0) === "?") {
      var num = parseInt(text.slice(1));
      return isNaN(num) ? text : { _param: num };
    } else return text;
  }
  function assignParamIds(query) {
    var index = 0;
    return query.replace(/\?/g, function (match) {
      return match + index++;
    });
  }
  var tokenizedCache = {};
  function jsonQuery(query, options) {
    var params = (options && options.params) || null;
    return (
      Array.isArray(query) && ((params = query.slice(1)), (query = query[0])),
      tokenizedCache[query] || (tokenizedCache[query] = tokenize(query, !0)),
      handleQuery(tokenizedCache[query], options, params)
    );
  }
  function handleQuery(tokens, options, params) {
    for (
      var state = new State(options, params, handleQuery), i = 0;
      i < tokens.length && !handleToken(tokens[i], state);
      i++
    );
    if ((handleToken(null, state), state.currentItem instanceof Object))
      state.addReference(state.currentItem);
    else {
      var parentObject = getLastParentObject(state.currentParents);
      parentObject && state.addReference(parentObject);
    }
    return {
      value: state.currentItem,
      key: state.currentKey,
      references: state.currentReferences,
      parents: state.currentParents,
    };
  }
  function handleToken(token, state) {
    if (token == null)
      !state.currentItem &&
        state.options.force &&
        state.force(state.options.force);
    else if (token.values)
      if (state.currentItem) {
        var keys = Object.keys(state.currentItem),
          values = [];
        keys.forEach(function (key2) {
          token.deep && Array.isArray(state.currentItem[key2])
            ? state.currentItem[key2].forEach(function (item) {
                values.push(item);
              })
            : values.push(state.currentItem[key2]);
        }),
          state.setCurrent(keys, values);
      } else state.setCurrent(keys, []);
    else if (token.get) {
      var key = state.getValue(token.get);
      if (shouldOverride(state, key))
        state.setCurrent(key, state.override[key]);
      else if (state.currentItem || (state.options.force && state.force({})))
        if (isDeepAccessor(state.currentItem, key) || token.multiple) {
          let values2 = state.currentItem
            .map(function (item) {
              return item[key];
            })
            .filter(isDefined);
          (values2 = Array.prototype.concat.apply([], values2)),
            state.setCurrent(key, values2);
        } else state.setCurrent(key, state.currentItem[key]);
      else state.setCurrent(key, null);
    } else if (token.select)
      if (
        Array.isArray(state.currentItem) ||
        (state.options.force && state.force([]))
      ) {
        var match = (token.boolean ? token.select : [token]).map(function (
          part
        ) {
          if (part.op === ":") {
            var key2 = state.getValue(part.select[0]);
            return {
              func: function (item) {
                return (
                  key2 && (item = item[key2]),
                  state.getValueFrom(part.select[1], item)
                );
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
          let keys2 = [];
          var value = [];
          state.currentItem.forEach(function (item, i2) {
            matches(item, match) && (keys2.push(i2), value.push(item));
          }),
            state.setCurrent(keys2, value);
        } else
          state.currentItem.some(function (item, i2) {
            if (matches(item, match)) return state.setCurrent(i2, item), !0;
          }) || state.setCurrent(null, null);
      } else state.setCurrent(null, null);
    else if (token.root)
      state.resetCurrent(),
        token.args && token.args.length
          ? state.setCurrent(null, state.getValue(token.args[0]))
          : state.setCurrent(null, state.rootContext);
    else if (token.parent)
      state.resetCurrent(), state.setCurrent(null, state.options.parent);
    else if (token.or) {
      if (state.currentItem) return !0;
      state.resetCurrent(), state.setCurrent(null, state.context);
    } else if (token.filter) {
      var helper =
        state.getLocal(token.filter) || state.getGlobal(token.filter);
      if (typeof helper == "function") {
        let values2 = state.getValues(token.args || []);
        var result = helper.apply(
          state.options,
          [state.currentItem].concat(values2)
        );
        state.setCurrent(null, result);
      } else {
        var filter = state.getFilter(token.filter);
        if (typeof filter == "function") {
          let values2 = state.getValues(token.args || []);
          var result = filter.call(state.options, state.currentItem, {
            args: values2,
            state,
            data: state.rootContext,
          });
          state.setCurrent(null, result);
        }
      }
    } else if (token.deep)
      if (state.currentItem) {
        if (token.deep.length === 0) return;
        var result = state.deepQuery(
          state.currentItem,
          token.deep,
          state.options
        );
        if (result) {
          state.setCurrent(result.key, result.value);
          for (var i = 0; i < result.parents.length; i++)
            state.currentParents.push(result.parents[i]);
        } else state.setCurrent(null, null);
      } else state.currentItem = null;
  }
  function matches(item, parts2) {
    for (var result = !1, i = 0; i < parts2.length; i++) {
      var opts = parts2[i],
        r = !1;
      opts.func
        ? (r = opts.func(item))
        : opts.op === "~"
        ? opts.value instanceof RegExp
          ? (r = item[opts.key] && !!item[opts.key].match(opts.value))
          : (r = item[opts.key] && !!~item[opts.key].indexOf(opts.value))
        : opts.op === "="
        ? (item[opts.key] === !0 && opts.value === "true") ||
          (item[opts.key] === !1 && opts.value === "false")
          ? (r = !0)
          : (r = item[opts.key] == opts.value)
        : opts.op === ">"
        ? (r = item[opts.key] > opts.value)
        : opts.op === "<"
        ? (r = item[opts.key] < opts.value)
        : opts.op === ">="
        ? (r = item[opts.key] >= opts.value)
        : opts.op === "<=" && (r = item[opts.key] <= opts.value),
        opts.negate && (r = !r),
        opts.booleanOp === "&"
          ? (result = result && r)
          : opts.booleanOp === "|"
          ? (result = result || r)
          : (result = r);
    }
    return result;
  }
  function isDefined(value) {
    return typeof value != "undefined";
  }
  function shouldOverride(state, key) {
    return (
      state.override &&
      state.currentItem === state.rootContext &&
      state.override[key] !== void 0
    );
  }
  function isDeepAccessor(currentItem, key) {
    return currentItem instanceof Array && parseInt(key) != key;
  }
  function getLastParentObject(parents) {
    for (var i = 0; i < parents.length; i++)
      if (!parents[i + 1] || !(parents[i + 1].value instanceof Object))
        return parents[i].value;
  }
  var _ObjectFormatter = class {
      static compose(data, object) {
        let newObj = object;
        for (let o in object) newObj[o] = jsonQuery(object[o], { data }).value;
        return newObj;
      }
      static concat(value, stringTemplate) {
        let func = this.buildFunction(value, stringTemplate),
          params = [];
        for (var v in value) params.push(value[v]);
        return func(...params);
      }
    },
    ObjectFormatter = _ObjectFormatter;
  (ObjectFormatter.objectfunctions = {
    compose: (data, object) => _ObjectFormatter.compose(data, object),
    concat: (value, stringTemplate) =>
      _ObjectFormatter.concat(value, stringTemplate),
  }),
    (ObjectFormatter.buildFunction = (value, s) => {
      let params = [];
      for (var v in value) params.push(v);
      return params.push(`return \`${s}\``), new Function(...params);
    });
  var _StringFormatter = class {
      static join(array, separator) {
        return Array.prototype.join.apply(array, separator);
      }
    },
    StringFormatter = _StringFormatter;
  StringFormatter.stringfunctions = {
    split: (value, separator, index) => value.split(separator)[index],
    concat: (value, ...strings) => value.concat(...strings),
    join: (array, separator) => _StringFormatter.join(array, separator),
  };
  var DataFormatter2 = class {
    static getFormattedValue(data, field) {
      if (this.isEmptyValueDescriptor(field.ValueDescriptor)) return null;
      let typeOfData = field.ValueDescriptor.Type,
        retrievedData;
      if (typeOfData === "static") return field.ValueDescriptor.Path;
      retrievedData = this.retreiveData(data, field.ValueDescriptor.Path);
      let currentValue = retrievedData,
        formatters = this.typeformatter[typeOfData],
        temp;
      for (let i = 0; i < field.Formatters.length; i++) {
        temp = field.Formatters[i].match(/(.*)\((.*)\)/);
        let params = window.eval("[" + temp[2] + "]"),
          funcName = temp[1];
        formatters[funcName]
          ? (currentValue = formatters[funcName].apply(null, [
              currentValue,
              ...params,
            ]))
          : currentValue[funcName] &&
            currentValue[funcName].apply(currentValue, [...params]);
      }
      return currentValue;
    }
    static retreiveData(data, path) {
      var result = jsonQuery(path, { data }).value;
      return result;
    }
    static isEmptyValueDescriptor(valueDescriptor) {
      return valueDescriptor?.Path == null || valueDescriptor?.Type == null;
    }
  };
  DataFormatter2.typeformatter = {
    datetime: DateTimeFormatter.datefunctions,
    string: StringFormatter.stringfunctions,
    number: NumberFormatter.numberfunctions,
    boolean: BooleanFormatter.booleanfunctions,
    object: ObjectFormatter.objectfunctions,
  };
  var _TableFormatter = class {
      static renderTable(data, section) {
        let list = DataFormatter2.retreiveData(
            data,
            section.ValueDescriptor.Path
          ),
          resultTable = new Table();
        (resultTable.header = []),
          resultTable.header.push([...section.Fields.map((f) => f.Label)]);
        for (let i = 0; i < list.length; i++) {
          let row = [],
            d = list[i];
          section.Fields.forEach((f) => {
            row.push(DataFormatter2.getFormattedValue(d, f));
          }),
            resultTable.body.push(row);
        }
        return (
          section.Formatters.forEach((f) => {
            resultTable = _TableFormatter.appylFormatters(resultTable, f);
          }),
          html` <table>
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
          </table>`
        );
      }
      static appylFormatters(data, formatter) {
        let temp = formatter.match(/(.*)\((.*)\)/),
          params = window.eval("[" + temp[2] + "]"),
          funcName = temp[1];
        return _TableFormatter.tableWriters[funcName]
          ? _TableFormatter.tableWriters[funcName].apply(null, [
              data,
              ...params,
            ])
          : data;
      }
      static sumCol(table, fields, text, colNum) {
        let tempTable = new Table(),
          offset = 0;
        if (colNum == -1) {
          for (let i2 in table)
            for (let j of table[i2]) tempTable[i2].push([null, ...j]);
          offset = 1;
        } else
          (tempTable.header = [...table.header]),
            (tempTable.body = [...table.body]),
            (tempTable.footer = [...table.footer]);
        let result = [];
        fields.forEach((f) => {
          let sum = 0;
          try {
            (sum = tempTable.body.reduce((agg, curr) => {
              let tall = curr[f + offset];
              return (agg += DataValidator.isNumber(tall)
                ? parseFloat(tall)
                : 0);
            }, 0)),
              (result[f + offset] = sum);
          } catch (e) {
            result[f + offset] = e;
          }
        });
        for (var i = 0, n = tempTable.body[0].length; i < n; ++i)
          result[i] === void 0 && (result[i] = "");
        return (
          (result[offset + colNum] = text),
          tempTable.footer.push(result),
          tempTable
        );
      }
    },
    TableFormatter = _TableFormatter;
  TableFormatter.tableWriters = {
    sumCol: (table, fields, text, colNum) =>
      _TableFormatter.sumCol(table, fields, text, colNum),
  };
  var Table = class {
    constructor() {
      this.header = [];
      this.body = [];
      this.footer = [];
    }
  };
  var DataRetriever = class {
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
        let [object, value] = this.getSplitValues(field, "."),
          dataObject = data[object];
        return Array.isArray(dataObject)
          ? this.getValueFromKey(dataObject, value)
          : dataObject[value];
      }
      return data[field];
    }
    formatStringValues(value) {
      return value == "true" ? "Yes" : value == "false" ? "No" : value;
    }
    getConcattedValuesWithSeparator(data, field) {
      let array = field.Value.split("|"),
        element,
        text = "";
      for (let i = 0; i < array.length; i++)
        (element = array[i]),
          (element = this.getStringFromObject(data, element)),
          (text += element),
          i != array.length - 1 && (text += " " + field.Format + " ");
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
      return !!(
        (data === null || data === "" || data === void 0) &&
        label.includes("!")
      );
    }
    outputValidator(data, field, input) {
      try {
        let tempData = this.getReturnType(data, field);
        return this.isEmptyValue(tempData, field.Label)
          ? html``
          : DataFormatter.encapsulateFieldTypeOutputInSpan(input, field);
      } catch (error) {
        console.log(
          `Error in field type ${field.Type}, check that label: %c${field.Label}%c and value: %c${field.Value}%c are correct.`,
          "color: red",
          "color: black",
          "color: red",
          error
        ),
          console.log(error.message);
      }
    }
    getSplitValues(data, seperator) {
      let objectToSplit = data.split(seperator);
      return [objectToSplit[0], objectToSplit[1]];
    }
    getLabelWithLabelFormatting(field) {
      let label = this.toggleLabel(field);
      return DataFormatter.encapsulateTextInSpanWithClass(label, "label");
    }
    getValueFromKey(dataObject, key) {
      for (let i = 0; i < dataObject.length; i++) {
        let element = dataObject[i];
        if (element.Key == key) return element.Value;
      }
    }
    getElementFromKey(dataObject, key, value) {
      let element;
      for (let i = 0; i < dataObject.length; i++)
        if (((element = dataObject[i]), element[key] == value)) return element;
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
      if (data instanceof Date)
        return this._dateFormatter.dateFormat(new Date(data), field.Format);
      if (/^[0-9,.]*$/.test(data)) {
        let result;
        if (field.Format.includes(".")) {
          let formatArray = field.Format.split(".");
          result =
            this.formatNumbers(data, formatArray[0]) + " " + formatArray[1];
        } else result = this.formatNumbers(data, field.Format);
        return result;
      } else return this.getDataFromField(data, field);
    }
  };
  var FieldWriter = class {
    static getLabelWithData(data, field) {
      return data
        ? html`<div>
            <span class="label ${field?.Options?.styleClass}"
              >${field.Label}&nbsp;</span
            ><span class="value">${data}</span>
          </div>`
        : field?.Options?.hideLabelIfDataIsEmpty
        ? html``
        : html` <div><span class="label"> ${field.Label}&nbsp; </span></div>`;
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
        return (
          DataValidator.isEmpty(multiline) && (multiline = 5),
          html`<div>
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
          </div>`
        );
      }
      return field?.Options?.hideLabelIfDataIsEmpty
        ? html``
        : html` <div><span class="label"> ${field.Label}</span></div>`;
    }
    static getCheckbox(data, field) {
      if (data === !1 || data === !0) {
        let checkbox =
          data === !0
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
      return field?.Options?.hideLabelIfDataIsEmpty
        ? html``
        : html` <div > </span> <div class="checkboxContainer" > <input type='checkbox' /> <span class="checkmark" > </span></div> <span class="label" > ${field.Label} </div>`;
    }
  };
  var TemplateEngine = class {
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
      (this.templateRetriever = templateRetriever), (this.host = host);
      let dataHelper = new DataRetriever();
      (this.dateService = new DateService(dataHelper)),
        (this.textService = new TextService(dataHelper)),
        (this.iconService = new IconService(dataHelper)),
        (this.checkboxService = new CheckboxService(dataHelper));
    }
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
              DataFormatter2.getFormattedValue(data, f),
              f
            );
          } catch (e) {
            return html`<div class="exception">${e}</div>`;
          }
        }
      )}`;
    }
    renderStandard(data, section) {
      try {
        return html`${this.renderTemplateFieldsNew(data, section.Fields)}`;
      } catch (e) {
        return html`<div class="exception">${e}</div>`;
      }
    }
    renderClickableList(data, section) {
      data.__viewState || (data.__viewState = {}),
        (this.subViewState = data.__viewState[section.Id] =
          data.__viewState[section.Id] || {});
      let list = DataFormatter2.retreiveData(
          data,
          section.ValueDescriptor.Path
        ),
        listItemIdentifier = section.Options.ListItemIdentifier;
      if (list.length == 0) return html``;
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
      return html`${repeat(section.Fields, (f) =>
        f.ValueDescriptor.Type == "static"
          ? html`${f.ValueDescriptor.Path}`
          : DataFormatter2.retreiveData(data, f.ValueDescriptor.Path)
      )}`;
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
      let sections = (
        await this.templateRetriever.getTemplateFromTemplateId(templateId)
      ).Template.Content;
      return html` <div class="slide-in" id="slider">
        <div class="detail-view ${this.host.viewClass}">
          <div class="container-button">${this.renderBackButton()}</div>
          <div>${this.renderData(data, sections)}</div>
        </div>
      </div>`;
    }
    async renderTemplateForTab(data, templateId) {
      let sections = (
        await this.templateRetriever.getTemplateFromTemplateId(templateId)
      ).Template.Content;
      return html`<div>${this.renderData(data, sections)}</div>`;
    }
    renderTabList(data, section) {
      let tabcontent = DataFormatter2.retreiveData(
        data,
        section.ValueDescriptor.Path
      );
      if (tabcontent.length == 0) return html``;
      let tabState = {
        currentIndex: 0,
        tabOnClick: (index, element) => {
          [...element.parentElement.children].forEach((c) =>
            c.classList.remove("selectedTab")
          ),
            element.classList.add("selectedTab"),
            (tabState.currentIndex = index);
          let tabcontent2 = [...element.closest("div").children];
          tabcontent2.forEach((c) => c.classList.remove("selectedContent")),
            tabcontent2[index + 1].classList.add("selectedContent");
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
      let resolveFunction,
        promise = new Promise((resolve, reject) => {
          resolveFunction = resolve;
        }),
        callback = (callbackData) => {
          try {
            callbackData &&
              resolveFunction(
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
              );
          } catch (error) {
            console.log(error.message);
          }
        };
      return (
        this.host.loadExternalData(data, section.Options.datasource, callback),
        html`${until(promise, html``)}`
      );
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
      (this.subViewState.selected = item),
        this.host.requestUpdate(),
        this.toggleSubView();
    }
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
      data.__viewState || (data.__viewState = {}),
        (this.subViewState = data.__viewState[section.Id] =
          data.__viewState[section.Id] || {});
      let listName = section.Options.Source,
        list = data[listName],
        listItemIdentifier = section.Options.ListItemIdentifier;
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
      return (
        section.Fields.forEach((f) => {
          labelString += this.FieldWriter_TOBEDISCONTINUED[f.Type](data, f);
        }),
        labelString
      );
    }
    renderExternalData(data, section) {
      let resolveFunction,
        promise = new Promise((resolve, reject) => {
          resolveFunction = resolve;
        }),
        callback = (callbackData) => {
          try {
            callbackData &&
              resolveFunction(
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
              );
          } catch (error) {
            console.log(error.message);
          }
        };
      return (
        this.host.loadExternalData(data, section.Options.datasource, callback),
        html`${until(promise, html``)}`
      );
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
      let sections = (
        await this.templateRetriever.getTemplateFromTemplateId(templateId)
      ).Template.Content;
      return html` <div class="slide-in" id="slider">
        <div class="detail-view ${this.host.viewClass}">
          <div class="container-button">${this.renderBackButton()}</div>
          <div>${this.renderData(data, sections)}</div>
        </div>
      </div>`;
    }
    renderNonClickableList(data, section) {
      let listName = section.Options.Source,
        list = data[listName],
        listItemIdentifier = section.Options.ListItemIdentifier;
      return list.length == 0
        ? html``
        : html` <div>
            ${repeat(
              list,
              (i) => i[listItemIdentifier],
              (i) => this.renderNonClickableListItem(i, section.Fields)
            )}
          </div>`;
    }
  };
})();
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
//# sourceMappingURL=templateengine.js.map
