// Common helper functions to convert the gRPC response (protobuf Struct/Value format)
// into a plain JavaScript object

/**
 * Recursively converts a gRPC Value into its plain JS equivalent.
 * @param {Object} value - The gRPC Value.
 * @returns {*} - The extracted value.
 */
function convertValue(value) {
    if (value.hasOwnProperty("stringValue")) {
      return value.stringValue;
    } else if (value.hasOwnProperty("numberValue")) {
      return value.numberValue;
    } else if (value.hasOwnProperty("boolValue")) {
      return value.boolValue;
    } else if (value.hasOwnProperty("structValue")) {
      return convertStruct(value.structValue);
    } else if (value.hasOwnProperty("listValue")) {
      return convertList(value.listValue);
    }
    return null;
  }
  
  /**
   * Converts a gRPC Struct into a plain JavaScript object.
   * @param {Object} struct - The gRPC Struct.
   * @returns {Object} - The plain JS object.
   */
  function convertStruct(struct) {
    const result = {};
    if (!struct.fields) return result;
    for (const key in struct.fields) {
      if (Object.prototype.hasOwnProperty.call(struct.fields, key)) {
        result[key] = convertValue(struct.fields[key]);
      }
    }
    return result;
  }
  
  /**
   * Converts a gRPC ListValue into a plain JavaScript array.
   * @param {Object} list - The gRPC ListValue.
   * @returns {Array} - The array of converted values.
   */
  function convertList(list) {
    return list.values.map(item => convertValue(item));
  }
  
  /**
   * Converts the top-level gRPC response (which is a Struct) to a plain object.
   * @param {Object} response - The gRPC response.
   * @returns {Object} - The plain JavaScript object.
   */
  export function convertGrpcResponse(response) {
    return convertStruct(response);
  }
  