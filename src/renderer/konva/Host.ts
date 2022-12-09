import Konva from "konva";
import { omit } from "lodash";

export type Dict = {
  [key: string]: any;
};

function captialize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 *
 *  Mutation methods
 */

function createHostElement(type: string, props: Dict) {
  const element = new (Konva as any)[captialize(type)]();
  applyPropsToHost(element, props);
  return element;
}

function applyPropsToHost(hostElement: any, _props: Dict) {
  const props = omit(_props, "children");
  for (const key of Object.keys(props)) {
    if (key.startsWith("on")) {
      const eventName = key.replace(/^on/, "").toLowerCase();
      hostElement.on(eventName, props[key]);
    } else {
      hostElement[key](props[key]);
    }
  }
}

export function createInstance(type: string, props: Dict) {
  const hostElement = createHostElement(type, props);
  Object.assign(hostElement, { _type: type });
  return hostElement;
}

export function appendChild(parent: any, child: any) {
  parent.add(child);
}

export function removeChild(parent: any, child: any) {
  if (child.destroy) {
    child.destroy();
  } else {
    console.warn("child not having destroy", child);
  }
}

export function updateItem(hostElement: any, props: Dict) {
  applyPropsToHost(hostElement, props);
}

export function reOrderBeforeChild(child: any, beforeChild: any, parent: any) {
  const index = beforeChild.zIndex();
  child.zIndex(index);
}

export function insertBefore(child: any, beforeChild: any, parent: any) {
  appendChild(parent, child);
  reOrderBeforeChild(child, beforeChild, parent);
}

/**
 * Methods to be used for persistent shadow nodes
 */

export type ShadowNode = {
  type: string;
  props: Dict;
  __children?: ShadowNode[];
};

export function createShadowNode(type: string, props: Dict) {
  return { type, props: omit(props,"children") };
}

export function clone(node: ShadowNode) {
  return { ...node };
}

export function cloneWithNewProps(node: ShadowNode, _newProps: Dict) {
  const newProps = omit(_newProps,"children");
  const { type, props, __children = [] } = node;
  return { type, props: { ...newProps }, __children };
}

export function cloneWithNewChildrenAndProps(node: ShadowNode, newProps: Dict) {
  const { type } = node;
  return { type, props: omit(newProps, "children") };
}

export function cloneWithNewChildren(node: ShadowNode) {
  const { type, props } = node;
  return { type, props: omit(props, "children") };
}

export function initialAppend(parent: ShadowNode,child: ShadowNode){
  parent.__children = parent.__children||[];
  parent.__children.push(child);
}
