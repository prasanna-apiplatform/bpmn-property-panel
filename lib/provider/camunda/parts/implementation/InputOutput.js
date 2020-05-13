'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var elementHelper = require('../../../../helper/ElementHelper'),
    extensionElementsHelper = require('../../../../helper/ExtensionElementsHelper'),
    inputOutputHelper = require('../../../../helper/InputOutputHelper'),
    cmdHelper = require('../../../../helper/CmdHelper');
var createHelper = require('../../../../provider/camunda/element-templates/CreateHelper')
var extensionElementsEntry = require('./ExtensionElements');
var inputOutputParameter = require('../implementation/InputOutputParameter');

function getInputOutput(element, insideConnector) {
    return inputOutputHelper.getInputOutput(element, insideConnector);
}

function getConnector(element) {
    return inputOutputHelper.getConnector(element);
}

function getInputParameters(element, insideConnector) {
    return inputOutputHelper.getInputParameters(element, insideConnector);
}

function getOutputParameters(element, insideConnector) {
    return inputOutputHelper.getOutputParameters(element, insideConnector);
}

function getInputParameter(element, insideConnector, idx) {
    return inputOutputHelper.getInputParameter(element, insideConnector, idx);
}

function getOutputParameter(element, insideConnector, idx) {
    return inputOutputHelper.getOutputParameter(element, insideConnector, idx);
}


function createElement(type, parent, factory, properties) {
    return elementHelper.createElement(type, properties, parent, factory);
}

function createInputOutput(parent, bpmnFactory, properties) {
    return createElement('camunda:InputOutput', parent, bpmnFactory, properties);
}

function createMapInputOutput(parent, bpmnFactory, properties) {
    return createElement('camunda:Map', parent, bpmnFactory, properties);
}
function createParameter(type, parent, bpmnFactory, properties) {
    return createElement(type, parent, bpmnFactory, properties);
}


function ensureInputOutputSupported(element, insideConnector) {
    return inputOutputHelper.isInputOutputSupported(element, insideConnector);
}

function ensureOutparameterSupported(element, insideConnector) {
    return inputOutputHelper.areOutputParametersSupported(element, insideConnector);
}

module.exports = function(element, bpmnFactory, options, translate) {
    // console.log(options);
    var TYPE_LABEL = {
        'camunda:Map': translate('Map'),
        'camunda:List': translate('List'),
        'camunda:Script': translate('Script')
    };

    options = options || {};

    var insideConnector = !!options.insideConnector,
        idPrefix = options.idPrefix || '';
    var getSelected = function(element, node) {
        var selection = (inputEntry && inputEntry.getSelected(element, node)) || { idx: -1 };

        var parameter = getInputParameter(element, insideConnector, selection.idx);
        if (!parameter && outputEntry) {
            selection = outputEntry.getSelected(element, node);
            parameter = getOutputParameter(element, insideConnector, selection.idx);
        }
        return parameter;
    };

    var result = {
        getSelectedParameter: getSelected
    };

    var entries = result.entries = [];

    if (!ensureInputOutputSupported(element)) {
        return result;
    }
    var newCustomElement = function(type, prop, factory) {
        return function(element, extensionElements, value) {
            var commands = [];
            var inputOutput = getInputOutput(element, insideConnector);
            // var APIname = element['businessObject']['$attrs']['undefined']
            // console.log(element['businessObject']);
            // var APIname = element['businessObject']['$attrs'][undefined];
            if (!inputOutput) {
                var parent = !insideConnector ? extensionElements : getConnector(element);
                inputOutput = createInputOutput(parent, bpmnFactory, {
                    inputParameters: [],
                    outputParameters: []
                });
                if (!insideConnector) {
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        extensionElements,
                        'values',
                        'extensionElements',
                        [ inputOutput ],
                        []
                    ));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
                }
            }
            // var selected_exe_name = APIname.split('_');
            // selected_exe_name  =selected_exe_name[0];
            //
            // var selected_exe_version = APIname.split('_');
            // selected_exe_version = selected_exe_version[1];
            // var dataAccessAPI = localStorage.getItem('dataAccessAPI');
            // dataAccessAPI = JSON.parse(dataAccessAPI);
            // var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
            // // var map = {};
            // // map['$type'] = 'camunda:Entry';
            // // map['key'] = 'pkey';
            // // map['value'] = 'asdas';
            // // var headers = {"definition": {"$type": "camunda:Map","entries":[map]}};
            // // headers.name = 'headers';
            // //
            // // headers.definition.entries = [map];
            // // localStorage.setItem('APIname',element['businessObject']['$attrs'][undefined]);
            // // element['businessObject']['name'] = localStorage.getItem('APIname');
            // // element['businessObject']['name']  = element['businessObject']['$attrs'][undefined];
            // console.log(localStorage.getItem('APIname'));
            // var havalue = [{'key':'url','value':obj['apiUrl']},{'key':'method','value':obj['executor_method_type']}]
            //
            // for ( let i = 0 ; i<havalue.length ; i++) {
            //     var newElem = createParameter(type, inputOutput, bpmnFactory, {name: havalue[i]['key'],value:havalue[i]['value']});
            //     commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
            // }
            // var newEntry = createElement('camunda:Entry', inputOutput, bpmnFactory, { key: obj['headers'][0]['key'], value: obj['headers'][0]['value'] });
            // var newEntry1 = createElement('camunda:Entry', inputOutput, bpmnFactory, { key: obj['headers'][1]['key'], value: obj['headers'][1]['value'] });
            // var testt = {'entries':[newEntry,newEntry1]};
            // var newEntryMap = createElement('camunda:Map', inputOutput, bpmnFactory, testt);
            // commands.push(cmdHelper.addElementsTolist(newEntryMap, inputOutput, 'entries', [newEntry]));
            // var newElem = createParameter(type, inputOutput, bpmnFactory, {"name": "headers","definition": newEntryMap});
            // commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
            return commands;
        };
    };
    var newElement = function(type, prop, factory) {
        // console.log('1');
        // console.log('2');
        return function(element, extensionElements, value) {
            // console.log(element);
            // console.log(value);
            // console.log(extensionElements);
            // console.log('3');
            var commands = [];
            var inputOutput = getInputOutput(element, insideConnector);
            if (!inputOutput) {
                // console.log('4');
                var parent = !insideConnector ? extensionElements : getConnector(element);
                inputOutput = createInputOutput(parent, bpmnFactory, {
                    inputParameters: [],
                    outputParameters: []
                });
                if (!insideConnector) {
                    // console.log('5');
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        extensionElements,
                        'values',
                        'extensionElements',
                        [ inputOutput ],
                        []
                    ));
                } else {
                    // console.log('6');
                    commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
                }
            }
            // console.log('7');
            var newElem = createParameter(type, inputOutput, bpmnFactory, { name: value });
            commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [ newElem ]));
            return commands;
        };
        // console.log('8');
    };

    var removeElement = function(getter, prop, otherProp) {
        return function(element, extensionElements, value, idx) {
            var inputOutput = getInputOutput(element, insideConnector);
            var parameter = getter(element, insideConnector, idx);

            var commands = [];
            commands.push(cmdHelper.removeElementsFromList(element, inputOutput, prop, null, [ parameter ]));

            var firstLength = inputOutput.get(prop).length-1;
            var secondLength = (inputOutput.get(otherProp) || []).length;

            if (!firstLength && !secondLength) {

                if (!insideConnector) {
                    commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, inputOutput));
                } else {
                    var connector = getConnector(element);
                    commands.push(cmdHelper.updateBusinessObject(element, connector, { inputOutput: undefined }));
                }

            }

            return commands;
        };
    };

    var setOptionLabelValue = function(getter) {
        return function(element, node, option, property, value, idx) {
            var parameter = getter(element, insideConnector, idx);

            var suffix = 'Text';

            var definition = parameter.get('definition');
            if (typeof definition !== 'undefined') {
                var type = definition.$type;
                suffix = TYPE_LABEL[type];
            }

            option.text = (value || '') + ' : ' + suffix;
        };
    };


    // input parameters ///////////////////////////////////////////////////////////////
    // console.log(translate('Input Parameters'));
    var inputEntry = extensionElementsEntry(element, bpmnFactory, {
        id: idPrefix + 'inputs',
        label: translate('Input Parameters'),
        modelProperty: 'name',
        prefix: 'InputParameters',
        resizable: true,
        createExtensionElement: newElement('camunda:InputParameter', 'inputParameters'),
        removeExtensionElement: removeElement(getInputParameter, 'inputParameters', 'outputParameters'),

        getExtensionElements: function(element) {
            return getInputParameters(element, insideConnector);
        },

        onSelectionChange: function(element, node, event, scope) {
            outputEntry && outputEntry.deselect(element, node);
        },

        setOptionLabelValue: setOptionLabelValue(getInputParameter)

    });
    entries.push(inputEntry);

    if (ensureOutparameterSupported(element, insideConnector)) {
        var outputEntry = extensionElementsEntry(element, bpmnFactory, {
            id: idPrefix + 'outputs',
            label: translate('Output Parameters'),
            modelProperty: 'name',
            prefix: 'Output',
            resizable: true,

            createExtensionElement: newElement('camunda:OutputParameter', 'outputParameters'),
            removeExtensionElement: removeElement(getOutputParameter, 'outputParameters', 'inputParameters'),

            getExtensionElements: function(element) {
                return getOutputParameters(element, insideConnector);
            },

            onSelectionChange: function(element, node, event, scope) {
                inputEntry.deselect(element, node);
            },

            setOptionLabelValue: setOptionLabelValue(getOutputParameter)

        });
        entries.push(outputEntry);
    }
    // console.log(result);
    return result;
};


module.exports.createInputParameter = function createInputParameter(element, bpmnFactory, options, translate) {
// console.log('called');
    var TYPE_LABEL = {
        'camunda:Map': translate('Map'),
        'camunda:List': translate('List'),
        'camunda:Script': translate('Script')
    };

    options = options || {};

    var insideConnector = !!options.insideConnector,
        idPrefix = options.idPrefix || '';
    var getSelected = function(element, node) {
        var selection = (inputEntry && inputEntry.getSelected(element, node)) || { idx: -1 };

        var parameter = getInputParameter(element, insideConnector, selection.idx);
        if (!parameter && outputEntry) {
            selection = outputEntry.getSelected(element, node);
            parameter = getOutputParameter(element, insideConnector, selection.idx);
        }
        return parameter;
    };

    var result = {
        getSelectedParameter: getSelected
    };

    var entries = result.entries = [];

    if (!ensureInputOutputSupported(element)) {
        return result;
    }
    // console.log('before newCustomElement');

    var newElement = function(type, prop, factory) {
        // console.log('inside newCustomeElement');
        // console.log(element);
        // console.log(extensionElements);
        // console.log(value);
        return function(element, extensionElements, value) {
            // console.log('inside return newCustomeElement');
            var commands = [];
            var inputOutput = getInputOutput(element, insideConnector);
            var APIname = element['businessObject']['$attrs']['undefined']

            if (!inputOutput) {
                // console.log('inside !inputOutput if loop');
                var parent = !insideConnector ? extensionElements : getConnector(element);
                inputOutput = createInputOutput(parent, bpmnFactory, {
                    inputParameters: [],
                    outputParameters: []
                });
                if (!insideConnector) {
                    // console.log('inside !insideConnector');
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        extensionElements,
                        'values',
                        'extensionElements',
                        [ inputOutput ],
                        []
                    ));
                } else {
                    commands.push(cmdHelper.updateBusinessObject(element, parent, { inputOutput: inputOutput }));
                }
            }
            // console.log('before selected_exe_name');
            var selected_exe_name = APIname.split('_');
            selected_exe_name  =selected_exe_name[0];
            var selected_exe_version = APIname.split('_');
            selected_exe_version = selected_exe_version[1];
            var dataAccessAPI = localStorage.getItem('dataAccessAPI');
            dataAccessAPI = JSON.parse(dataAccessAPI);
            var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
            var map = {};
            map['$type'] = 'camunda:Entry';
            map['key'] = 'pkey';
            map['value'] = 'asdas';
            var headers = {"definition": {"$type": "camunda:Map","entries":[map]}};
            headers.name = 'headers';
            headers.definition.entries = [map];
            // console.log(headers);
            // console.log(JSON.stringify(headers));
            var havalue = [{'key':'url','value':obj['apiUrl']},{'key':'method','value':obj['executor_method_type']}]
            for ( let i = 0 ; i<havalue.length ; i++) {
                var newElem = createParameter(type, inputOutput, bpmnFactory, {name: havalue[i]['key'],value:havalue[i]['value']});
                commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
            }
            var newEntry = createElement('camunda:Entry', inputOutput, bpmnFactory, { key: 'asd', value: 'ss' });
            // console.log(newEntry);
            var testt = {'entries':[newEntry]};
            var newEntryMap = createElement('camunda:Map', inputOutput, bpmnFactory, testt);
            commands.push(cmdHelper.addElementsTolist(newEntryMap, inputOutput, 'entries', [newEntry]));
            // console.log(newEntryMap);

            var newElem = createParameter(type, inputOutput, bpmnFactory, {"name": "headers","definition": newEntryMap});
            commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
            return commands;
        };
    };

    var removeElement = function(getter, prop, otherProp) {
        return function(element, extensionElements, value, idx) {
            var inputOutput = getInputOutput(element, insideConnector);
            var parameter = getter(element, insideConnector, idx);

            var commands = [];
            commands.push(cmdHelper.removeElementsFromList(element, inputOutput, prop, null, [ parameter ]));

            var firstLength = inputOutput.get(prop).length-1;
            var secondLength = (inputOutput.get(otherProp) || []).length;

            if (!firstLength && !secondLength) {

                if (!insideConnector) {
                    commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, inputOutput));
                } else {
                    var connector = getConnector(element);
                    commands.push(cmdHelper.updateBusinessObject(element, connector, { inputOutput: undefined }));
                }

            }

            return commands;
        };
    };

    var setOptionLabelValue = function(getter) {
        return function(element, node, option, property, value, idx) {
            var parameter = getter(element, insideConnector, idx);

            var suffix = 'Text';

            var definition = parameter.get('definition');
            if (typeof definition !== 'undefined') {
                var type = definition.$type;
                suffix = TYPE_LABEL[type];
            }

            option.text = (value || '') + ' : ' + suffix;
        };
    };


    // input parameters ///////////////////////////////////////////////////////////////

    var inputEntry = extensionElementsEntry(element, bpmnFactory, {
        id: idPrefix + 'inputs',
        label: translate('Input Parameters'),
        modelProperty: 'name',
        prefix: 'Input',
        resizable: true,
        createExtensionElement: newElement('camunda:InputParameter', 'inputParameters'),
        removeExtensionElement: removeElement(getInputParameter, 'inputParameters', 'outputParameters'),

        getExtensionElements: function(element) {
            return getInputParameters(element, insideConnector);
        },

        onSelectionChange: function(element, node, event, scope) {
            outputEntry && outputEntry.deselect(element, node);
        },

        setOptionLabelValue: setOptionLabelValue(getInputParameter)

    });
    // console.log(inputEntry);
    entries.push(inputEntry);




    // output parameters ///////////////////////////////////////////////////////

    if (ensureOutparameterSupported(element, insideConnector)) {
        var outputEntry = extensionElementsEntry(element, bpmnFactory, {
            id: idPrefix + 'outputs',
            label: translate('Output Parameters'),
            modelProperty: 'name',
            prefix: 'Output',
            resizable: true,

            createExtensionElement: newElement('camunda:OutputParameter', 'outputParameters'),
            removeExtensionElement: removeElement(getOutputParameter, 'outputParameters', 'inputParameters'),

            getExtensionElements: function(element) {
                return getOutputParameters(element, insideConnector);
            },

            onSelectionChange: function(element, node, event, scope) {
                inputEntry.deselect(element, node);
            },

            setOptionLabelValue: setOptionLabelValue(getOutputParameter)

        });
        entries.push(outputEntry);
    }
    return result;

};
