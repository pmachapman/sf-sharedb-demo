/**
 * Determines whether an object has the specified property.
 * @param obj The object to check.
 * @param property The name of the property.
 * @returns `true` if the object has the property.
 */
export function hasProp<X, Y extends PropertyKey>(
  obj: X,
  property: Y
): obj is X & Record<Y, unknown> {
  return (isObj(obj) || isFn(obj)) && property in obj;
}

/**
 * Determines whether an object has the specified property and value.
 * @param obj The object to check.
 * @param property The name of the property.
 * @param value The value of the property.
 * @returns `true` if the object has the property with the specified value.
 */
export function hasPropWithValue<X, Y extends PropertyKey>(
  obj: X,
  property: Y,
  value: unknown
): obj is X & Record<Y, unknown> {
  return hasProp(obj, property) && obj[property] === value;
}

/**
 *  Determines whether an object has the specified string property.
 * @param obj The object to check.
 * @param property The name of the property.
 * @returns `true` if the object has the property with a string type.
 */
export function hasStringProp<X, Y extends PropertyKey>(obj: X, property: Y): obj is X & Record<Y, string> {
  return hasProp(obj, property) && typeof obj[property] === 'string';
}

/**
 * Determines whether the given value is a message sending an op to the server.
 * @param data The data to be sent to the server.
 * @returns `true` if the value is a message sending operation.
 */
export function isMessageSendingOp(value: unknown): boolean {
  return hasPropWithValue(value, "a", "op");
}

/**
 * Determines whether a value is a function.
 * @param value
 * @returns `true` if the value is an function.
 */
export function isFn(value: unknown): value is Function {
  return typeof value === "function";
}

/**
 * Determines whether a value is a non-null object, and narrows the type to object if so.
 * @param value The value.
 * @returns `true` if the value is an object.
 */
export function isObj(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

/**
 * Attempts to parse a value as JSON. If the value is not a string or cannot be parsed, returns null.
 * @param data The data to attempt to parse as JSON.
 * @returns The JSON object or null.
 */
export function tryParseJSON(data: unknown): unknown {
  if (typeof data !== "string") return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
