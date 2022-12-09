import React, { useRef, useEffect } from "react";
import ReactReconciler from "react-reconciler";
import Konva from "konva";
import { options as commonReconcilerOptions, Dict } from "./common";
import * as Host from "./Host";

const HostConfig: any = {
  ...commonReconcilerOptions,
  appendChildToContainer: (container: any, child: any) => {
    console.log('append Child to container',{container,child});
    Host.appendChild(container, child);
  },
  appendInitialChild: (parent: any, child: any) => {
    console.log('append initial child',{parent,child});
    return Host.appendChild(parent, child);
  },
  removeChildFromContainer: (container: any, child: any) => {
    console.log('remove child from container',{container,child});
    Host.removeChild(container, child);
  },
  removeChild: (parent: any, child: any) => {
    console.log('removeChild',{parent,child});
    Host.removeChild(parent, child);
  },
  finalizeInitialChildren: (
    any: any,
    type: string,
    props: Dict,
    rootContainer: any
  ) => {},

  supportsMutation: true,
  supportsPersistence: false,
  commitUpdate: (
    node: any,
    updatePayload: Dict,
    type: string,
    prevProps: Dict,
    nextProps: Dict
  ) => {
    if (updatePayload) {
      console.log('commiting update', {node,updatePayload});
      Host.updateItem(node, updatePayload);
    }
  },

  insertBefore: (parent: any, child: any, beforeChild: any) => {
    console.log('insert before', {parent,child,beforeChild});
    Host.insertBefore(child, beforeChild, parent);
  },
  insertInContainerBefore: (container: any, child: any, beforeChild: any) => {
    console.log('insertInContainerBefore', {container,child,beforeChild});
    Host.insertBefore(child, beforeChild, container);
  },
  appendChild: (parent: any, child: any) => {
    console.log('append child',{parent,child});
    Host.appendChild(parent, child);
  },
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


  export function Canvas({children,style={},...props}: React.PropsWithChildren & Dict){
    const domRef = useRef<HTMLDivElement|null>(null);
    const rootRef = useRef<any>();
    useEffect(() => {
        const stage = new Konva.Stage({...props, container: domRef.current!});
        rootRef.current = stage;
        render(children, stage);

        return () => {
            unmount(stage);
        }
    },[]);

    useEffect(() => {
        render(children, rootRef.current);
      }, [children]);

      return <div style={style} ref={domRef}></div>;
  }