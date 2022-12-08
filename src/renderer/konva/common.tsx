import { diff } from "deep-object-diff";
import { omit, isEmpty } from "lodash";

export type Dict = {
  [key: string]: any;
};
const EMPTY_CONTEXT = {};
const Noop = () => {};

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
  prepareUpdate: (
    _instance: any,
    _type: string,
    oldProps: Dict,
    newProps: Dict
  ) => {
    const _oldProps = omit(oldProps, "children");
    const _newProps = omit(newProps, "children");
    const diffObject = diff(_oldProps, _newProps);
    return isEmpty(diffObject) ? false : diffObject;
  },
  createTextInstance: Noop,
};
