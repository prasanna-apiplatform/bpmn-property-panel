'use strict';

var ImplementationTypeHelper = require('../../../helper/ImplementationTypeHelper'),
    InputOutputHelper = require('../../../helper/InputOutputHelper');

var utils = require('../../../Utils'),
    escapeHTML = utils.escapeHTML,
    triggerClickEvent = utils.triggerClickEvent;

var implementationType = require('./implementation/ImplementationType'),
    delegate = require('./implementation/Delegate'),
    external = require('./implementation/External'),
    callable = require('./implementation/Callable'),
    resultVariable = require('./implementation/ResultVariable');
var delegateSelect     = require('../../../../../../src/app/bpmn/DelegateSelect');
var elementHelper = require('../../../helper/ElementHelper')
function createParameter(type, parent, bpmnFactory, properties) {
    return createElement(type, parent, bpmnFactory, properties);
}
function createElement(type, parent, factory, properties) {
    return elementHelper.createElement(type, properties, parent, factory);
}
var entryFactory = require('../../../factory/EntryFactory');

var domQuery = require('min-dom').query,
    domClosest = require('min-dom').closest,
    domClasses = require('min-dom').classes;

function getImplementationType(element) {
    return ImplementationTypeHelper.getImplementationType(element);
}

function getBusinessObject(element) {
    return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
}

function isDmnCapable(element) {
    return ImplementationTypeHelper.isDmnCapable(element);
}

function isExternalCapable(element) {
    return ImplementationTypeHelper.isExternalCapable(element);
}

function isServiceTaskLike(element) {
    return ImplementationTypeHelper.isServiceTaskLike(element);
}

module.exports = function(group, element, bpmnFactory, translate) {

    if (!isServiceTaskLike(getBusinessObject(element))) {
        return;
    }

    var hasDmnSupport = isDmnCapable(element);
    var hasExternalSupport = isExternalCapable(getBusinessObject(element));

    // implementation type ////////////////////////////////////

    group.entries = group.entries.concat(implementationType(element, bpmnFactory, {
        getBusinessObject: getBusinessObject,
        getImplementationType: getImplementationType,
        hasDmnSupport: hasDmnSupport,
        hasExternalSupport: hasExternalSupport,
        hasServiceTaskLikeSupport: true
    }, translate));


    // delegate (class, expression, delegateExpression) //////////

    group.entries = group.entries.concat(delegate(element, bpmnFactory, {
        getBusinessObject: getBusinessObject,
        getImplementationType: getImplementationType
    }, translate));


    // result variable /////////////////////////////////////////

    group.entries = group.entries.concat(resultVariable(element, bpmnFactory, {
        getBusinessObject: getBusinessObject,
        getImplementationType: getImplementationType,
        hideResultVariable: function(element, node) {
            return getImplementationType(element) !== 'expression';
        }
    }, translate));

    // external //////////////////////////////////////////////////
    // console.log(JSON.stringify(delegateSelect(element, bpmnFactory, {
    //   getBusinessObject: getBusinessObject,
    //   getImplementationType: getImplementationType,
    //   hideDelegateSelect: function(element, node) {
    //     return getImplementationType(element) !== 'class';
    //   }
    // })));
    group.entries = group.entries.concat(delegateSelect(element, bpmnFactory, {
        getBusinessObject: getBusinessObject,
        getImplementationType: getImplementationType,
        hideDelegateSelect: function(element, node) {
            return getImplementationType(element) !== 'class';
        }
    }, translate));
    if (hasExternalSupport) {
        group.entries = group.entries.concat(external(element, bpmnFactory, {
            getBusinessObject: getBusinessObject,
            getImplementationType: getImplementationType
        }, translate));
    }


    // dmn ////////////////////////////////////////////////////////

    if (hasDmnSupport) {
        group.entries = group.entries.concat(callable(element, bpmnFactory, {
            getCallableType: getImplementationType
        }, translate));
    }


    // connector ////////////////////////////////////////////////

    var isConnector = function(element) {
        return getImplementationType(element) === 'connector';
    };

    group.entries.push(entryFactory.link({
        id: 'configureConnectorLink',
        label: translate('Configure Connector'),
        handleClick: function(element, node, event) {

            var connectorTabEl = getTabNode(node, 'connector');

            if (connectorTabEl) {
                triggerClickEvent(connectorTabEl);
            }

            // suppress actual link click
            return false;
        },
        showLink: function(element, node) {
            var link = domQuery('a', node);
            link.textContent = '';

            domClasses(link).remove('bpp-error-message');

            if (isConnector(element)) {
                var connectorId = InputOutputHelper.getConnector(element).get('connectorId');
                // console.log('connectorID');
                // var APIname = element['businessObject']['$attrs']['undefined']
                // element['businessObject']['$attrs']['name'] = element['businessObject']['$attrs'][undefined];
                // var APIname = element['businessObject']['$attrs'][undefined];
                // element['businessObject']['name'] = APIname;
                // console.log(element);
                // console.log(APIname);
                // delete element['businessObject']['$attrs'][undefined];
                // element['businessObject']['$attrs'] = {};
                // element['businessObject']['$attrs']['name'] = APIname
                // console.log(element);
                // console.log(InputOutputHelper.getConnector(element).get('connectorId'));
                // console.log(InputOutputHelper.getConnector(element).set('connectorId','http-connector'));
                // console.log(InputOutputHelper.getConnector(element).get('connectorId'));
                // test
                console.log(element);
                console.log(element['businessObject']['name']);
                try {
                    if (element['businessObject']['name'] !== undefined){
                        console.log('1');
                        if (element['businessObject']['name'] !== 'Select' ){
                            console.log('2');
                            link.textContent = translate('Configure Connector');
                            var APIname = element['businessObject']['name'];
                            var selected_exe_name = APIname.split('_');
                            selected_exe_name  =selected_exe_name[0];
                            var selected_exe_version = APIname.split('_');
                            selected_exe_version = selected_exe_version[1];
                            var dataAccessAPI = localStorage.getItem('dataAccessAPI');
                            dataAccessAPI = JSON.parse(dataAccessAPI);
                            var obj = dataAccessAPI.find(o => o.executor_name === selected_exe_name && o.executor_version === selected_exe_version);
                            var havalue = [{'key':'url','value':obj['apiUrl']},{'key':'method','value':obj['executor_method_type']}]
                            var temp = []
                            InputOutputHelper.getConnector(element).set('connectorId','http-connector')
                            if ( havalue[1]['value'] === 'PUT' || havalue[1]['value'] === 'DELETE'){
                                var editedValue;
                                editedValue = havalue[0]['value'].split(':');
                                editedValue = editedValue[0] +editedValue[1]+ '${'+editedValue[2]+'}';
                                var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: havalue[0]['key'],value:editedValue});
                                temp.push(newElem);
                                console.log('asd');
                            } else if ( havalue[1]['value'] === 'POST'){
                                var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: havalue[0]['key'],value:havalue[0]['value']});
                                var newElem2 = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: 'payload',value:'${payload}'});
                                temp.push(newElem);
                                temp.push(newElem2);

                            } else {
                                var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: havalue[0]['key'],value:havalue[0]['value']});
                                temp.push(newElem);
                            }
                            // for ( let i = 0 ; i<havalue.length ; i++) {
                            var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: havalue[1]['key'],value:havalue[1]['value']});
                            // commands.push(cmdHelper.addElementsTolist(element, inputOutput, prop, [newElem]));
                            temp.push(newElem);
                            // }
                            var newEntry = createElement('camunda:Entry', 'inputParameters', bpmnFactory, { key: obj['headers'][0]['key'], value: obj['headers'][0]['value'] });
                            var newEntry1 = createElement('camunda:Entry', 'inputParameters', bpmnFactory, { key: obj['headers'][1]['key'], value: obj['headers'][1]['value'] });
                            var newEntry2 = createElement('camunda:Entry', 'inputParameters', bpmnFactory, { key: 'Content-Type', value: 'application/json' });
                            var testt = {"entries":[newEntry,newEntry1, newEntry2]};
                            console.log(testt);
                            var newEntryMap = createElement('camunda:Map', 'inputParameters', bpmnFactory, testt);
                            console.log(newEntryMap);
                            var headerElement = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: 'headers',definition:newEntryMap});
                            temp.push(headerElement);
                            var extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {}, element['businessObject'], bpmnFactory);
                            var connector = elementHelper.createElement('camunda:Connector', {}, extensionElements, bpmnFactory);
                            connector['connectorId'] = 'http-connector';
                            console.log(connector);
                            var InputOutput = elementHelper.createElement('camunda:InputOutput', {}, connector, bpmnFactory);
                            console.log(InputOutput);


                            //
                            // var newEntry = createElement('camunda:Entry', 'inputParameters', bpmnFactory, { key: obj['headers'][0]['key'], value: obj['headers'][0]['value'] });
                            var newScriptEntryMap = createElement('camunda:Script', 'inputParameters', bpmnFactory, {'value':'var response = connector.getVariable("response");\n' +
                                    'var responseCode = connector.getVariable("statusCode");\n' +
                                    '//create a default response empty body\n' +
                                    'var res = S(\'[]\');\n' +
                                    '// check response code is ok\n' +
                                    'if (responseCode > 200 && responseCode < 300){ \n' +
                                    ' res =S(response);\n' +
                                    '}\n' +
                                    '\n' +
                                    'res;','scriptFormat':'JavaScript'});
                            // var testt = {"entries":[newEntry,newEntry1]};
                            var activityId = element['businessObject']['id'];
                            activityId = activityId.split('_');
                            var outputElement = createParameter('camunda:OutputParameter', 'inputParameters', bpmnFactory, {name: APIname+'_'+activityId[1]+'_'+'response',definition:newScriptEntryMap});
                            console.log(outputElement);

                            //
                            InputOutput.inputParameters = temp;
                            InputOutput.outputParameters = [outputElement];
                            connector.inputOutput = InputOutput;

                            // console.log('****connector*****');
                            // console.log(connector);
                            // extensionElements.values = {'$type':'camunda:Connector','inputOutput':{'$type':'camunda:InputOutput','inputParameters':temp}};
                            extensionElements.values = connector;
                            // extensionElements['$type'] = 'bpmn:ExtensionElements';
                            console.log(extensionElements);
                            element['businessObject']['extensionElements']['values'][0] = extensionElements['values'];
                            console.log(element);
                            var temp2 = [];
                            if (obj['executor_method_type'] === 'PUT' || obj['executor_method_type'] === 'DELETE' ){
                                var InputOutput = elementHelper.createElement('camunda:InputOutput', {}, extensionElements, bpmnFactory);
                                var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: 'id',value:'${id}'});
                                temp2.push(newElem);
                                InputOutput.inputParameters = temp2;
                                element['businessObject']['extensionElements']['values'][1] = InputOutput;
                            } else if (obj['executor_method_type'] === 'POST'){
                                var InputOutput = elementHelper.createElement('camunda:InputOutput', {}, extensionElements, bpmnFactory);
                                var newElem = createParameter('camunda:InputParameter', 'inputParameters', bpmnFactory, {name: 'payload',value:'${payloadx}'});
                                temp2.push(newElem);
                                InputOutput.inputParameters = temp2;
                                element['businessObject']['extensionElements']['values'][1] = InputOutput;
                            }
                            else{
                                delete element['businessObject']['extensionElements']['values'][1];
                            }
                            delete element['businessObject']['$attrs']['undefined'];
                        }
                    }
                }
                catch {
                    console.log('Not a platform API');
                }


                // test

                if (connectorId) {
                    link.textContent = translate('Configure Connector');
                } else {
                    link.innerHTML = '<span class="bpp-icon-warning"></span> ' + escapeHTML(translate('Must configure Connector'));
                    domClasses(link).add('bpp-error-message');
                }

                return true;
            }

            return false;
        }
    }));

};



// helpers ///////////////////////////

function getTabNode(el, id) {
    var containerEl = domClosest(el, '.bpp-properties-panel');

    return domQuery('a[data-tab-target="' + id + '"]', containerEl);
}
