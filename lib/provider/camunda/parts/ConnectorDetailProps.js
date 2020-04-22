'use strict';

var ImplementationTypeHelper = require('../../../helper/ImplementationTypeHelper'),
    InputOutputHelper = require('../../../helper/InputOutputHelper');
var createHelper = require('../../../provider/camunda/element-templates/CreateHelper')
var entryFactory = require('../../../factory/EntryFactory'),
    cmdHelper = require('../../../helper/CmdHelper');
var customProps = require('../element-templates/parts/CustomProps')
var customHeaders = require('../parts/implementation/InputOutput')
var elementHelper = require('../../../helper/ElementHelper')
var extensionElementsEntry = require('../parts/implementation/ExtensionElements');
// var inputOutputHelper = require('../../../../helper/InputOutputHelper'),
function getImplementationType(element) {
  return ImplementationTypeHelper.getImplementationType(element);
}
function getInputOutput(element, insideConnector) {
  return InputOutputHelper.getInputOutput(element, insideConnector);
}
function getInputParameters(element, insideConnector) {
  return InputOutputHelper.getInputParameters(element, insideConnector);
}
function getInputParameter(element, insideConnector, idx) {
  return InputOutputHelper.getInputParameter(element, insideConnector, idx);
}
function getBusinessObject(element) {
  return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
}
function getConnector1(element) {
  return InputOutputHelper.getConnector(element);
}
function createInputOutput(parent, bpmnFactory, properties) {
  return createElement('camunda:InputOutput', parent, bpmnFactory, properties);
}
function createParameter(type, parent, bpmnFactory, properties) {
  return createElement(type, parent, bpmnFactory, properties);
}
function createElement(type, parent, factory, properties) {
  return elementHelper.createElement(type, properties, parent, factory);
}
function getConnector(bo) {
// console.log(JSON.stringify(bo));
  // console.log(bo['$attrs'][undefined]);
//   console.log(InputOutputHelper.getConnector(bo));
  try{
    console.log(bo);
    // console.log(JSON.stringify(bo));
    // bo['extensionElements']['values'][0].inputOutput = {'inputParameters':{"$type":"camunda:InputParameter","name":"url","value":bo['$attrs'][undefined]}}
    // bo['extensionElements']['values'][0].inputOutput.inputParameters.push({"$type":"camunda:InputParameter","name":"url","value":bo['$attrs'][undefined]});
    // bo['$attrs'][undefined] = 'manipulated';
    // var selected = bo['$attrs'][undefined];
    // console.log(JSON.stringify(selected));
    // var selected_exe_name = selected.split('_');
    // selected_exe_name  =selected_exe_name[0];
    //
    // var selected_exe_version = selected.split('_');
    // selected_exe_version = selected_exe_version[1];
    // console.log(selected_exe_name + '   ' + selected_exe_version);
    // var dataAccessAPI = localStorage.getItem('dataAccessAPI');
    // dataAccessAPI = JSON.parse(dataAccessAPI);
    // console.log(dataAccessAPI);
    // var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
    // // users = dataAccessAPI.filter(x => x.name == 'Mark' && x.address == 'England');
    // console.log(obj);
    // var input = {'name':'url'}
    // console.log('INPUT '+ JSON.stringify(input));
    // console.log('obj[apiUrl]' + obj['apiUrl']);
    // console.log('bpmn from connector details' + JSON.stringify(bpmnFactory));
    // var createInputParameter = createHelper.createInputParameter(input, '${source}',bpmnFactory);

  }
  catch (err){
    console.log('error happened');
    console.log(err);
  }
  return InputOutputHelper.getConnector(bo);
  // return 'Users API';
}

function isConnector(element) {
  return getImplementationType(element) === 'connector';
}

module.exports = function(group, element, bpmnFactory, translate) {
  var options = {idPrefix: "connector-",insideConnector: true}
  // //
  // var newCustomElement = function(type, prop, factory) {
  //   console.log('called inside connectiondetailsprops 1');
  //   return function(element, extensionElements, value) {
  //     console.log('called inside connectiondetailsprops 1');
  //     var commands = [];
  //     var inputOutput = getInputOutput(element, insideConnector);
  //     var APIname = element['businessObject']['$attrs']['undefined']
  //     if (!inputOutput) {
  //       console.log('called inside connectiondetailsprops 2');
  //       var parent = !insideConnector ? extensionElements : getConnector(element);
  //       inputOutput = createInputOutput(parent, bpmnFactory, {
  //         inputParameters: [],
  //         outputParameters: []
  //       });
  //       if (!insideConnector) {
  //         commands.push(cmdHelper.addAndRemoveElementsFromList(
  //             element,
  //             extensionElements,
  //             'values',
  //             'extensionElements',
  //             [ inputOutput ],
  //             []
  //         ));
  //       } else {
  //         commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
  //       }
  //     }
  //     var selected_exe_name = APIname.split('_');
  //     selected_exe_name  =selected_exe_name[0];
  //
  //     var selected_exe_version = APIname.split('_');
  //     selected_exe_version = selected_exe_version[1];
  //     var dataAccessAPI = localStorage.getItem('dataAccessAPI');
  //     dataAccessAPI = JSON.parse(dataAccessAPI);
  //     var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
  //     var map = {};
  //     map['$type'] = 'camunda:Entry';
  //     map['key'] = 'pkey';
  //     map['value'] = 'asdas';
  //     var headers = {"definition": {"$type": "camunda:Map","entries":[map]}};
  //     headers.name = 'headers';
  //
  //     headers.definition.entries = [map];
  //
  //     var havalue = [{'key':'url','value':obj['apiUrl']},{'key':'method','value':obj['executor_method_type']}]
  //
  //     for ( let i = 0 ; i<havalue.length ; i++) {
  //       var newElem = createParameter(type, inputOutput, bpmnFactory, {name: havalue[i]['key'],value:havalue[i]['value']});
  //       commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
  //     }
  //     var newEntry = createElement('camunda:Entry', inputOutput, bpmnFactory, { key: 'asd', value: 'ss' });
  //
  //     var testt = {'entries':[newEntry]};
  //     var newEntryMap = createElement('camunda:Map', inputOutput, bpmnFactory, testt);
  //     commands.push(cmdHelper.addElementsTolist(newEntryMap, inputOutput, 'entries', [newEntry]));
  //     var newElem = createParameter(type, inputOutput, bpmnFactory, {"name": "headers","definition": newEntryMap});
  //     commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
  //     return commands;
  //   };
  // };
  // newCustomElement('camunda:InputParameter', 'inputParameters');
  // //
  // comment working
//   var commands = [];
//   // customHeaders()
//   console.log('0');
//   var insideConnector = true;
//   console.log('0.5');
//   var inputOutput = getInputOutput(element, insideConnector);
//   console.log(inputOutput);
//   if (!inputOutput) {
//     console.log('1');
//     var parent = !insideConnector ? extensionElements : getConnector1(element);
//     inputOutput = createInputOutput(parent, bpmnFactory, {
//       inputParameters: [],
//       outputParameters: []
//     });
//     console.log('2'+ JSON.stringify(inputOutput));
//     if (!insideConnector) {
//       // console.log('5');
//       console.log('3');
//       commands.push(cmdHelper.addAndRemoveElementsFromList(
//           element,
//           extensionElements,
//           'values',
//           'extensionElements',
//           [ inputOutput ],
//           []
//       ));
//
//     } else {
//       // console.log('6');
//       commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
//     }
//     console.log('4 '+ JSON.stringify(commands));
//   }
//   // console.log('7');
//   var newElem = createParameter('camunda:InputParameter', inputOutput, bpmnFactory, { name: 'method' });
//   console.log('5 ' +JSON.stringify(newElem));
//   inputOutput.inputParameters.push(newElem);
//   commands.push(cmdHelper.addElementsTolist(element, inputOutput, 'inputParameters', [ newElem ]));
//   console.log(element, inputOutput, newElem);
//
//   console.log(JSON.stringify(element), JSON.stringify(inputOutput), JSON.stringify(newElem));
//
//
//   //
//   var setOptionLabelValue = function(getter) {
//     return function(element, node, option, property, value, idx) {
//       var parameter = getter(element, insideConnector, idx);
//
//       var suffix = 'Text';
//
//       var definition = parameter.get('definition');
//       if (typeof definition !== 'undefined') {
//         var type = definition.$type;
//         suffix = TYPE_LABEL[type];
//       }
//
//       option.text = (value || '') + ' : ' + suffix;
//     };
//   };
//   var inputResult = extensionElementsEntry(element, bpmnFactory, {
//     id: 'connector-' + 'inputs',
//     label: translate('Input Parameters'),
//     modelProperty: 'name',
//     prefix: 'InputParameters',
//     resizable: true,
//     createExtensionElement: inputOutput,
//     removeExtensionElement: inputOutput,
//
//     getExtensionElements: function(element) {
//       return getInputParameters(element, insideConnector);
//     },
//
//     onSelectionChange: function(element, node, event, scope) {
//       // outputEntry && outputEntry.deselect(element, node);
//     },
//     //
//     setOptionLabelValue: setOptionLabelValue(getInputParameter)
//
//   });
// console.log(inputResult);
  // comment -end
  //
  // var xx = customHeaders.createInputParameter(element, bpmnFactory, options, translate);
  // var ch = customHeaders(element, bpmnFactory, options, translate);
  // group.entries = group.entries.concat(xx.entries);
  // console.log(ch);
  // var property = {'binding':{"$type": "camunda:InputParameter", "name": "Input_22iahn5"}}
  // customProps.setPropertyValue(element, property, 'textt', bpmnFactory)
  // var createInputParameter = createHelper.customInputParameter(bpmnFactory);
  // console.log(createInputParameter);
// console.log(bpmnFactory);
//   var test = customHeaders.createInputParameter(element, bpmnFactory, {}, translate)
//   console.log(test);
  group.entries.push(entryFactory.textField({
    id: 'connectorId',
    label: translate('Connector Id'),
    modelProperty: 'connectorId',

    get: function(element, node) {
      console.log('element from connectorDetailsProps ', element);
      var bo = getBusinessObject(element);
      console.log(bo)
      try{
        bo['name'] = bo['$attrs'][undefined]
      }
      catch{
        console.log(bo);
      }
      console.log(bo);
      var connector = bo && getConnector(bo);

      try{
        // var selected = bo['$attrs'][undefined];
        var value  = bo['$attrs'][undefined];
        value = 'http-connector';
        // ['extensionElements']['values'][0]['inputOutput']['inputParameters'].push({"$type":"camunda:InputParameter","name":"url","value":"https://gateway.apiplatform.io"})
        // var selected = bo['$attrs'][undefined];
        // console.log(JSON.stringify(selected));
        // var selected_exe_name = selected.split('_');
        // selected_exe_name  =selected_exe_name[0];
        //
        // var selected_exe_version = selected.split('_');
        // selected_exe_version = selected_exe_version[1];
        // console.log(selected_exe_name + '   ' + selected_exe_version);
        // var dataAccessAPI = localStorage.getItem('dataAccessAPI');
        // dataAccessAPI = JSON.parse(dataAccessAPI);
        // console.log(dataAccessAPI);
        // var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
        // // users = dataAccessAPI.filter(x => x.name == 'Mark' && x.address == 'England');
        // console.log(obj);
        // var input = {'name':'url'}
        // console.log('INPUT '+ JSON.stringify(input));
        // console.log('obj[apiUrl]' + obj['apiUrl']);
        // console.log('bpmn from connector details' + JSON.stringify(bpmnFactory));
        // var createInputParameter = createHelper.createInputParameter(input, '${source}',bpmnFactory);

      }
      catch{
        var value = connector && connector.get('connectorId');
      }
      // var test = customHeaders.customHeaders();

      // console.log(test);
      // console.log('get value get '+JSON.stringify(value));
      return { connectorId: value };
    },

    set: function(element, values, node) {
      var bo = getBusinessObject(element);
      var connector = getConnector(bo);
      return cmdHelper.updateBusinessObject(element, connector, {
        connectorId: values.connectorId || undefined
      });
    },

    validate: function(element, values, node) {
      return isConnector(element) && !values.connectorId ? { connectorId: translate('Must provide a value') } : {};
    },

    hidden: function(element, node) {
      return !isConnector(element);
    }

  }));

};
