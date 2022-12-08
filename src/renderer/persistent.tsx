import React, { useRef, useEffect } from "react";

import { diff } from "deep-object-diff";
import { omit, isEmpty } from "lodash";
import ReactReconciler from "react-reconciler";
import {
    DiscreteEventPriority,
    ContinuousEventPriority,
    DefaultEventPriority,
  } from 'react-reconciler/constants';
import * as Host from "./hostImplementation";
import { Dict, Instance } from "./hostImplementation";

  

const NO_CONTEXT = {};
const Noop = () => {};

/**
 * @type {ReactReconciler.HostConfig}
 */
const HostConfig = {
  now: Date.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  warnsIfNotActing: false,
  getRootHostContext: (rootContainer: any) => {
    return NO_CONTEXT;
  },
  getChildHostContext: (
    parentHostContext: any,
    type: string,
    rootContainer: any
  ) => {
    return NO_CONTEXT;
  },
  getPublicInstance: (instance: Host.Instance) => instance,
  prepareForCommit: (containerInfo: any) => {},
  resetAfterCommit: (containerInfo: any) => {},
  detachDeletedInstance: () => {},
  createInstance: (type: string, props: Dict, rootContainer: any) => {
    return Host.createInstance(type, props, rootContainer);
  },
  appendInitialChild: (parent: Instance, child: Instance) => {
    console.log('initial append---',)
    return Host.appendChild(parent, child);
  },
  useSyncScheduling: true,
  finalizeInitialChildren: (
    instance: Instance,
    type: string,
    props: Dict,
    rootContainer: any
  ) => {},
  shouldSetTextContent: (type: string, props: Dict) => false,

  supportsMutation: false,
  supportsMicrotasks: false,
  supportsResources: false,
  supportsSingletons: false,
  supportsPersistence: true,
  getCurrentEventPriority() {
    return DefaultEventPriority
  },
  clearContainer: (container: any) => {},
  appendChildToContainer: Noop,
  removeChild: Noop,
  removeChildFromContainer: (container: any, child: Instance) => {
    Host.removeChild(container, child);
  },
  createTextInstance: Noop,
  prepareUpdate: (
    _instance: Instance,
    _type: string,
    oldProps: Dict,
    newProps: Dict
  ) => {
    const _oldProps = omit(oldProps, "children");
    const _newProps = omit(newProps, "children");
    const diffObject = diff(_oldProps, _newProps);
    return isEmpty(diffObject) ? false : diffObject;
  },
  commitUpdate: Noop,
  insertBefore: Noop,
  insertInContainerBefore: Noop,
  appendChild: Noop,
  isPrimaryRenderer: false,

  cloneInstance: (
    instance: Instance,
    updatePayload: null | Object,
    type: string,
    oldProps: Dict,
    newProps: Dict,
    internalInstanceHandle: Object,
    keepChildren: boolean
    // recyclableInstance: null | Instance,
  ) => {
    let clone;
    if (keepChildren) {
      if (updatePayload) {
        clone = Host.cloneWithNewProps(instance, updatePayload);
      } else {
        clone = Host.clone(instance);
      }
    } else {
      if (updatePayload) {
        clone = Host.cloneWithNewChildrenAndProps(instance, updatePayload);
      } else {
        clone = Host.cloneWithNewChildren(instance);
      }
    }

    return clone;
  },
  cloneHiddenInstance: (
    instance: Instance,
    type: string,
    props: Dict,
    internalInstanceHandle: Object
  ) => {
    //return Host.cloneWithNewProps(instance, { hidden: true });
  },
  cloneHiddenTextInstance: Noop,
  createContainerChildSet: (container: Instance) => {
    return Host.createChildSet(container);
  },
  appendChildToContainerChildSet: (childSet: Instance[], child: Instance) => {
    Host.appendChildToSet(childSet, child);
  },

  finalizeContainerChildren(container: Instance, newChildren: Instance[]) {
    //container.childs = newChildren;
  },
  
  replaceContainerChildren(container: Instance, newChildren: Instance[]) {
    console.log('replace container children', {container, newChildren})
    container.childs = newChildren;
  },
  onRecoverableError: Noop,
};

//@ts-ignore
const reconciler = ReactReconciler(HostConfig);

export function render(reactElement: any, hostElement: any) {
  if (!hostElement._root) {
    //@ts-ignore
    hostElement._root = reconciler.createContainer(hostElement);
    hostElement._root.onRecoverableError = (...args: any[]) => {
      console.warn("got error in renderer", ...args);
    };
  }

  reconciler.updateContainer(reactElement, hostElement._root);
  return reconciler.getPublicRootInstance(hostElement._root);
}

export function unmount(hostElement: any) {
  if (hostElement._root) {
    reconciler.updateContainer(null, hostElement._root, undefined, () => {
      delete hostElement._root;
    });
  }
}

export const Custom = ({ children }: React.PropsWithChildren) => {
  const domRef = useRef<any>();
  const rootInstance = useRef<any>();
  useEffect(() => {
    const root = Host.createInstance("_root", {}, {});

    //@ts-ignore
    window.___root = root;
    rootInstance.current = root;
    render(children, root);

    return () => {
      unmount(root);
    };
  }, []);

  useEffect(() => {
    render(children, rootInstance.current);
  }, [children]);

  return <span ref={domRef} />;
};
