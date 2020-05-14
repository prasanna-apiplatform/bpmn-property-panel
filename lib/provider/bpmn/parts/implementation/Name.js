'use strict';
var ImplementationTypeHelper  = require('../../../../helper/ImplementationTypeHelper');
var entryFactory = require('../../../../factory/EntryFactory');
// var APIName = require('../../../camunda/parts/ConnectorDetailProps');
function getBusinessObject(element) {
  return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
}
/**
 * Create an entry to modify the name of an an element.
 *
 * @param  {djs.model.Base} element
 * @param  {Object} options
 * @param  {string} options.id the id of the entry
 * @param  {string} options.label the label of the entry
 *
 * @return {Array<Object>} return an array containing
 *                         the entry to modify the name
 */
module.exports = function(element, options, translate) {
  // console.log('element from Name ', element);
  var bo = getBusinessObject(element);
  // console.log(bo);
// console.log(options);
  options = options || {};
  var id = options.id || 'name',
      label = options.label || translate('Name'),
      modelProperty = options.modelProperty ||'name';;
  try{
    // console.log(element);
    // console.log(element['businessObject']['$attrs'][undefined]);
    if (element['businessObject']['$attrs'][undefined]){
      if (element['businessObject']['$attrs'][undefined] !== 'Select'){
        // element['businessObject']['$attrs']['name'] = element['businessObject']['$attrs'][undefined];
        element['businessObject']['name'] = element['businessObject']['$attrs'][undefined];

      }
      modelProperty = element['businessObject']['$attrs'][undefined];
    }
  }
  catch{
    console.log('error');
    modelProperty = options.modelProperty ||'name';
  }

  var nameEntry = entryFactory.textBox({
    id: id,
    label: label,
    modelProperty: modelProperty,
    get: options.get,
    set: options.set
  });
  // get: options.get,
  //     set: options.set
  // console.log(nameEntry);
  return [ nameEntry ];

};
