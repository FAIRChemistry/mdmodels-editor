/**
 * Creates a unique handle ID for a node attribute by combining the object name and attribute name
 * @param objName The name of the object/node
 * @param attrName The name of the attribute/handle
 * @returns A string ID in the format "objectName-attributeName"
 */
export function createHandleId(objName: string, attrName?: string | null) {
  if (!attrName) return objName;
  return `${objName}-${attrName}`;
}
