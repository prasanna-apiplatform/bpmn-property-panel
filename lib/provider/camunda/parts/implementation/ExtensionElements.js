'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var domQuery = require('min-dom').query,
    domClosest = require('min-dom').closest,
    domify = require('min-dom').domify,
    forEach = require('lodash/forEach');

var elementHelper = require('../../../../helper/ElementHelper'),
    cmdHelper = require('../../../../helper/CmdHelper'),
    utils = require('../../../../Utils'),
    escapeHTML = utils.escapeHTML;
// var elementHelper = require('../../../../helper/ElementHelper'),
function getSelectBox(node, id) {
  var currentTab = domClosest(node, 'div.bpp-properties-tab');
  var query = 'select[name=selectedExtensionElement]' + (id ? '[id=cam-extensionElements-' + id + ']' : '');
  return domQuery(query, currentTab);
}
function createParameter(type, parent, bpmnFactory, properties) {
  return createElement(type, parent, bpmnFactory, properties);
}
function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}
function getSelected(node, id) {
  var selectBox = getSelectBox(node, id);
  return {
    value: (selectBox || {}).value,
    idx: (selectBox || {}).selectedIndex
  };
}

function generateElementId(prefix) {
  prefix = prefix + '_';
  return utils.nextId(prefix);
}

var CREATE_EXTENSION_ELEMENT_ACTION = 'create-extension-element',
    REMOVE_EXTENSION_ELEMENT_ACTION = 'remove-extension-element';

module.exports = function(element, bpmnFactory, options, translate) {

  var id = options.id,
      prefix = options.prefix || 'elem',
      label = options.label || id,
      idGeneration = (options.idGeneration === false) ? options.idGeneration : true,
      businessObject = options.businessObject || getBusinessObject(element);

  var modelProperty = options.modelProperty || 'id';

  var getElements = options.getExtensionElements;

  var createElement = options.createExtensionElement,
      canCreate = typeof createElement === 'function';

  var removeElement = options.removeExtensionElement,
      canRemove = typeof removeElement === 'function';

  var onSelectionChange = options.onSelectionChange;

  var hideElements = options.hideExtensionElements,
      canBeHidden = typeof hideElements === 'function';

  var setOptionLabelValue = options.setOptionLabelValue;

  var defaultSize = options.size || 5,
      resizable = options.resizable;

  var reference = options.reference || undefined;

  var selectionChanged = function(element, node, event, scope) {
    if (typeof onSelectionChange === 'function') {
      return onSelectionChange(element, node, event, scope);
    }
  };

  var createOption = function(value) {
    return '<option value="' + escapeHTML(value) + '" data-value data-name="extensionElementValue">' + escapeHTML(value) + '</option>';
  };

  var initSelectionSize = function(selectBox, optionsLength) {
    if (resizable) {
      selectBox.size = optionsLength > defaultSize ? optionsLength : defaultSize;
    }
  };

  return {
    id: id,
    html: '<div class="bpp-row bpp-element-list" ' +
            (canBeHidden ? 'data-show="hideElements"' : '') + '>' +
            '<label for="cam-extensionElements-' + escapeHTML(id) + '">' + escapeHTML(label) + '</label>' +
            '<div class="bpp-field-wrapper">' +
              '<select id="cam-extensionElements-' + escapeHTML(id) + '"' +
                      'name="selectedExtensionElement" ' +
                      'size="' + escapeHTML(defaultSize) + '" ' +
                      'data-list-entry-container ' +
                      'data-on-change="selectElement">' +
              '</select>' +
              (canCreate ? '<button class="add" ' +
                                   'id="cam-extensionElements-create-' + escapeHTML(id) + '" ' +
                                   'data-action="createElement">' +
                             '<span>+</span>' +
                           '</button>' : '') +
              (canRemove ? '<button class="clear" ' +
                                   'id="cam-extensionElements-remove-' + escapeHTML(id) + '" ' +
                                   'data-action="removeElement" ' +
                                   'data-disable="disableRemove">' +
                             '<span>-</span>' +
                           '</button>' : '') +
            '</div>' +
          '</div>',

    get: function(element, node) {
      var elements = getElements(element, node);

      var result = [];
      forEach(elements, function(elem) {
        result.push({
          extensionElementValue: elem.get(modelProperty)
        });
      });

      var selectBox = getSelectBox(node.parentNode, id);
      initSelectionSize(selectBox, result.length);

      return result;
    },

    set: function(element, values, node) {
      // console.log('****');
      // console.log('values');
      // console.log(values);
      // console.log('****');
      var action = this.__action;
      console.log('node');
      console.log(node);
      console.log(JSON.stringify(node));
      // console.log('****');
      // console.log('action');
      // console.log(action);
      // console.log('****');
      delete this.__action;

      businessObject = businessObject || getBusinessObject(element);

      var bo =
        (reference && businessObject.get(reference))
          ? businessObject.get(reference)
          : businessObject;

      var extensionElements = bo.get('extensionElements');

      if (action.id === CREATE_EXTENSION_ELEMENT_ACTION) {
        var commands = [];
        if (!extensionElements) {
          values = [
            {
              "$type": "camunda:Connector",
              "inputOutput": {
                "$type": "camunda:InputOutput",
                "inputParameters": [
                  {
                    "$type": "camunda:InputParameter",
                    "name": "url",
                    "value": "https://services.apiplatform.io/v1/data/stejas101/stejas101/test1"
                  },
                  {
                    "$type": "camunda:InputParameter",
                    "name": "method",
                    "value": "GET"
                  },
                  {
                    "$type": "camunda:InputParameter",
                    "name": "headers",
                    "definition": {
                      "$type": "camunda:Map",
                      "entries": [
                        {
                          "$type": "camunda:Entry",
                          "key": "pkey",
                          "value": "3fd76a9d5731190c3fd9932aa4253dce"
                        },
                        {
                          "$type": "camunda:Entry",
                          "key": "apikey",
                          "value": ""
                        }
                      ]
                    }
                  }
                ],
                "outputParameters": [],
                "entries": [
                  {
                    "$type": "camunda:Entry",
                    "key": "pkey",
                    "value": "3fd76a9d5731190c3fd9932aa4253dce"
                  }
                ]
              }
            }
          ];
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          // extensionElements.values = values;
          commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));


        }
        commands.push(createElement(element, extensionElements, action.value, node));

//         // console.log('outside');
//         // values = [
//         //   {
//         //     "$type": "camunda:Connector",
//         //     "inputOutput": {
//         //       "$type": "camunda:InputOutput",
//         //       "inputParameters": [
//         //         {
//         //           "$type": "camunda:InputParameter",
//         //           "name": "url",
//         //           "value": "https://services.apiplatform.io/v1/data/stejas101/stejas101/test1"
//         //         },
//         //         {
//         //           "$type": "camunda:InputParameter",
//         //           "name": "method",
//         //           "value": "GET"
//         //         },
//         //         {
//         //           "$type": "camunda:InputParameter",
//         //           "name": "headers",
//         //           "definition": {
//         //             "$type": "camunda:Map",
//         //             "entries": [
//         //               {
//         //                 "$type": "camunda:Entry",
//         //                 "key": "pkey",
//         //                 "value": "3fd76a9d5731190c3fd9932aa4253dce"
//         //               },
//         //               {
//         //                 "$type": "camunda:Entry",
//         //                 "key": "apikey",
//         //                 "value": ""
//         //               }
//         //             ]
//         //           }
//         //         }
//         //       ],
//         //       "outputParameters": [],
//         //       "entries": [
//         //         {
//         //           "$type": "camunda:Entry",
//         //           "key": "pkey",
//         //           "value": "3fd76a9d5731190c3fd9932aa4253dce"
//         //         }
//         //       ]
//         //     }
//         //   }
//         // ];
//         // console.log('before changing extension ele');
//         // console.log(extensionElements);
//         // extensionElements.values = values;
//         // console.log('after changing extension ele');
//         // console.log('*****************');
//         // console.log('Extension Element: ');
//         var APIname = element['businessObject']['$attrs']['undefined']
//         var selected_exe_name = APIname.split('_');
//         selected_exe_name  =selected_exe_name[0];
//
//         var selected_exe_version = APIname.split('_');
//         selected_exe_version = selected_exe_version[1];
//         var dataAccessAPI = localStorage.getItem('dataAccessAPI');
//         dataAccessAPI = JSON.parse(dataAccessAPI);
//         var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
//         // var map = {};
//         // map['$type'] = 'camunda:Entry';
//         // map['key'] = 'pkey';
//         // map['value'] = 'asdas';
//         // var headers = {"definition": {"$type": "camunda:Map","entries":[map]}};
//         // headers.name = 'headers';
//         //
//         // headers.definition.entries = [map];
//
//         var havalue = [{'key':'url','value':obj['apiUrl']},{'key':'method','value':obj['executor_method_type']}]
//         var temp = []
//         for ( let i = 0 ; i<havalue.length ; i++) {
//           var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: havalue[i]['key'],value:havalue[i]['value']});
//           // commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
//           temp.push(newElem);
//         }
//         // console.log(temp);
//         // console.log(extensionElements);
//         var connector = elementHelper.createElement('camunda:Connector', {}, extensionElements, bpmnFactory);
//         console.log(connector);
//         var InputOutput = elementHelper.createElement('camunda:InputOutput', {}, connector, bpmnFactory);
//         console.log(InputOutput);
//         InputOutput.inputParameters = temp;
//         connector.inputOutput = InputOutput;
//         console.log('****connector*****');
//         console.log(connector);
//         // extensionElements.values = {'$type':'camunda:Connector','inputOutput':{'$type':'camunda:InputOutput','inputParameters':temp}};
//         extensionElements.values = connector;
//         // console.log(extensionElements);
//         commands.push(cmdHelper.updateBusinessObject(element, bo, { extensionElements: extensionElements }));
//         console.log('extension ele');
//         console.log(extensionElements);
//         console.log('Business Object: ');
//         console.log(bo);
//         // console.log('*****************');
// // console.log(element, action);
// //         var id = 'xyz123';
// //         var canBeHidden = false;
// //         var canCreate = true;
// //         var canRemove = true;
// //         var htmlContent = '<div class="bpp-row bpp-element-list" ' +
// //         (canBeHidden ? 'data-show="hideElements"' : '') + '>' +
// //         '<label for="cam-extensionElements-">one api</label>' +
// //         '<div class="bpp-field-wrapper">' +
// //         '<select id="cam-extensionElements-' + escapeHTML(id) + '"' +
// //         'name="selectedExtensionElement" ' +
// //         'size="100" ' +
// //         'data-list-entry-container ' +
// //         'data-on-change="selectElement">' +
// //             '<option value="method" data-value data-name="extensionElementValue">method</option>' +
// //             '<option value="url" data-value data-name="extensionElementValue">url</option>' +
// //         '</select>' +
// //         (canCreate ? '<button class="add" ' +
// //             'id="cam-extensionElements-create-' + escapeHTML(id) + '" ' +
// //             'data-action="createElement">' +
// //             '<span>+</span>' +
// //             '</button>' : '') +
// //         (canRemove ? '<button class="clear" ' +
// //             'id="cam-extensionElements-remove-' + escapeHTML(id) + '" ' +
// //             'data-action="removeElement" ' +
// //             'data-disable="disableRemove">' +
// //             '<span>-</span>' +
// //             '</button>' : '') +
// //         '</div>' +
// //         '</div>'
// //         commands.push(createElement(element, extensionElements, 'url', htmlContent));
// //         commands.push(createElement(element, extensionElements, 'method', htmlContent));

        return commands;

      }
      else if (action.id === REMOVE_EXTENSION_ELEMENT_ACTION) {
        return removeElement(element, extensionElements, action.value, action.idx, node);
      }

    },

    createListEntryTemplate: function(value, index, selectBox) {
      initSelectionSize(selectBox, selectBox.options.length + 1);
      return createOption(value.extensionElementValue);
    },

    deselect: function(element, node) {
      var selectBox = getSelectBox(node, id);
      selectBox.selectedIndex = -1;
    },

    getSelected: function(element, node) {
      return getSelected(node, id);
    },

    setControlValue: function(element, node, option, property, value, idx) {
      node.value = value;

      if (!setOptionLabelValue) {
        node.text = value;
      } else {
        setOptionLabelValue(element, node, option, property, value, idx);
      }
    },

    createElement: function(element, node) {
      // create option template
      var generatedId;
      if (idGeneration) {
        generatedId = generateElementId(prefix);
      }

      var selectBox = getSelectBox(node, id);
      var template = domify(createOption(generatedId));

      // add new empty option as last child element
      selectBox.appendChild(template);

      // select last child element
      selectBox.lastChild.selected = 'selected';
      selectionChanged(element, node);

      // update select box size
      initSelectionSize(selectBox, selectBox.options.length);

      this.__action = {
        id: CREATE_EXTENSION_ELEMENT_ACTION,
        value: generatedId
      };

      return true;
    },

    removeElement: function(element, node) {
      var selection = getSelected(node, id);

      var selectBox = getSelectBox(node, id);
      selectBox.removeChild(selectBox.options[selection.idx]);

      // update select box size
      initSelectionSize(selectBox, selectBox.options.length);

      this.__action = {
        id: REMOVE_EXTENSION_ELEMENT_ACTION,
        value: selection.value,
        idx: selection.idx
      };

      return true;
    },

    hideElements: function(element, entryNode, node, scopeNode) {
      return !hideElements(element, entryNode, node, scopeNode);
    },

    disableRemove: function(element, entryNode, node, scopeNode) {
      return (getSelected(entryNode, id) || {}).idx < 0;
    },

    selectElement: selectionChanged
  };

};
