const {
  CLOB, CHAR, INT, NUMERIC, NULL, BOOLEAN, BINARY, IN, OUT, INOUT,
} = require('idb-connector');

/**
  *Internal helper function to format params and set Param Indicator & Bind Type
  * @param {array} boundParams - the array to push the formatted parameter.
  * @param {object} options - an object with config options:
  * {io: in | out | both, asClob: true | false}.
  */
function formatParams(boundParams, value, options) {
  const { asClob } = options;
  let { io } = options;

  if (io === 'both') {
    io = INOUT;
  } else if (io === 'in') {
    io = IN;
  } else if (io === 'out') {
    io = OUT;
  }

  if (typeof value === 'string') { // String
    if (asClob) { // as clob
      boundParams.push([value, io, CLOB]);
    } else { // as string
      boundParams.push([value, io, CHAR]);
    }
  } else if (typeof value === 'number') { // Number
    let indicator;

    // eslint-disable-next-line no-unused-expressions
    Number.isInteger(value)
      ? indicator = INT
      : indicator = NUMERIC;

    boundParams.push([value, io, indicator]);
  } else if (value === null) { // Null
    boundParams.push([value, io, NULL]);
  } else if (Buffer.isBuffer(value)) { // Binary/blob
    boundParams.push([value, io, BINARY]);
  } else if (typeof value === 'boolean') { // Boolean
    boundParams.push([value, io, BOOLEAN]);
  } else {
    throw new TypeError('Parameters to bind should be String, Number, null, boolean or Buffer');
  }
}

/**
   * Internal helper function to format params and set Param Indicator & Bind Type
   * @param {array} params - an array of values to bind. type of values should be:
   * (string , number , or null)
   * @param {object} options - an object with config options to set for all parameters.
   * Currently, the input/output indicator is the only available option to set:
   * {io: in | out | both}.
   * This will override the default which is to bind as 'both'.
   * @returns {array} - an array of bounded params properly formated to use.
   */
function setupParams(params, options = {}) {
  const boundParams = [];
  let { io } = options;

  io = io || 'both';

  params.forEach((parameter) => {
    if (parameter instanceof Object) {
      const { value, asClob = false } = parameter;

      if (!value && value !== null) {
        throw new Error('The parameter object must define a value property');
      }
      // assigning the value of io from the parameter object to the io variable declared before.
      // if io from parameter object is undefined default back to value of io from before.
      ({ io = io } = parameter);
      // allows customization of io for an individual parameter.
      formatParams(boundParams, value, { io, asClob });
    } else {
      // when just passing values but would like to override default io (INPUT_OUTPUT)
      formatParams(boundParams, parameter, { io });
    }
  });

  return boundParams;
}

module.exports = setupParams;
