import React, { useRef, useEffect } from "react";
import ReactReconciler from "react-reconciler";
import Konva from "konva";
import { options as commonReconcilerOptions, Dict } from "./common";
import * as Host from "./Host";

const Noop = () => {};

const HostConfig: any = {
  ...commonReconcilerOptions,
  supportsMutation: false,
  supportsPersistence: true,
  cloneInstance: (
    node: any,
    updatePayload: null | Object,
    type: string,
    oldProps: Dict,
    newProps: Dict,
    internalInstanceHandle: Object,
    keepChildren: boolean
    // recyclableInstance: null | Instance,
  ) => {
    console.log('re-creating node', {type,newProps})
    return Host.createInstance(type, newProps);
  },
  cloneHiddenInstance: Noop,
  cloneHiddenTextInstance: Noop,
  createContainerChildSet: (container: any) => {
    console.log("creating container childset", container);
    return [];
  },
  appendChildToContainerChildSet: (childSet: any[], child: any) => {
    console.log("append child to set ", { child, childSet });
    childSet.push(child);
  },
  replaceContainerChildren(container: any, newChildren: any[]) {
    console.log("replace container children", { container, newChildren });
    container.destroyChildren();
    for (const child of newChildren) {
      Host.appendChild(container, child);
    }
  },
  appendInitialChild: (parent: any, child: any) => {
    console.log("append initial child", { child, parent });
    Host.appendChild(parent, child);
  },

  finalizeInitialChildren: (
    node: any,
    type: string,
    props: Dict,
    rootContainer: any
  ) => {
    //console.log("finalizing children ====>", { type, node });
  },
  finalizeContainerChildren(container: any, newChildren: any[]) {
    console.log("finalize container children", { container, newChildren });
  }
};

const reconciler = ReactReconciler(HostConfig);

export function render(reactElement: any, hostElement: any) {
  if (!hostElement._root) {
    //@ts-ignore
    hostElement._root = reconciler.createContainer(hostElement);
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

export function Canvas({
  children,
  style = {},
  ...props
}: React.PropsWithChildren & Dict) {
  const domRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<any>();
  useEffect(() => {
    const stage = new Konva.Stage({ ...props, container: domRef.current! });
    //@ts-ignore
    window.__stage = stage;
    rootRef.current = stage;
    render(children, stage);

    return () => {
      unmount(stage);
    };
  }, []);

  useEffect(() => {
    render(children, rootRef.current);
  }, [children]);

  return <div style={style} ref={domRef}></div>;
}
