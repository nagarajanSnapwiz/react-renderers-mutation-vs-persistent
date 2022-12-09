import { diff } from "deep-object-diff";
import { omit, isEmpty } from "lodash";
import * as Host from "./Host";

export type Dict = {
  [key: string]: any;
};
const EMPTY_CONTEXT = {};
const Noop = () => {};

function diffForFunctions(diffObject: Dict, oldProps: Dict, newProps: Dict) {
  const keys = Object.keys(diffObject);
  return keys
    .map((k) => {
      if (typeof diffObject[k] === "function") {
        if (oldProps[k].toString() !== newProps[k].toString()) {
          return k;
        }
      } else {
        return k;
      }
    })
    .filter((x) => x)
    .reduce((acc, k) => ({ ...acc, [`${k}`]: diffObject[k!] }), {});
}

export const options = {
  now: Date.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  warnsIfNotActing: false,
  getRootHostContext: (rootContainer: any) => {
    return EMPTY_CONTEXT;
  },
  getChildHostContext: (
    parentHostContext: any,
    type: string,
    rootContainer: any
  ) => {
    return parentHostContext;
  },
  getPublicInstance: (instance: any) => instance,
  prepareForCommit: (containerInfo: any) => {},
  resetAfterCommit: (containerInfo: any) => {},
  detachDeletedInstance: Noop,
  finalizeInitialChildren: Noop,
  shouldSetTextContent: (type: string, props: any) => false,
  clearContainer: Noop,
  createInstance: (type: string, props: Dict, rootContainer: any) => {
    console.log("createInstance", { type, props });
    return Host.createInstance(type, props);
  },
  prepareUpdate: (
    _instance: any,
    _type: string,
    oldProps: Dict,
    newProps: Dict
  ) => {
    const _oldProps = omit(oldProps, "children");
    const _newProps = omit(newProps, "children");
    const diffObject = diff(_oldProps, _newProps)
    return isEmpty(diffObject) ? false : diffObject;
  },
  createTextInstance: Noop,
};
