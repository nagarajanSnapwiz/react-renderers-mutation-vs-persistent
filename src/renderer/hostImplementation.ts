import { cloneDeep } from 'lodash';

function idFactory() {
  let id = 1;
  return () => {
    id = id + 1;
    return id;
  };
}

export type Dict = {
  [key: string]: any;
};

const getId = idFactory();

export type Instance = {
  id: number;
  type: string;
  _props: Dict;
  rootContainer: any;
  childs: Array<Instance>;
  childSet?: Set<Instance>;
};

function arraymove(arr: any[], fromIndex: number, toIndex: number) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
/*
* Mutation utilities
*/
export function createInstance(type: string, props: Dict, rootContainer: any) {
  console.log("create instance", { type, props, rootContainer });
  const __id = props.id;
  return { type, _props: {...props}, childs: [], id: getId() , __id };
}

export function appendChild(parent: Instance, child: Instance) {
  if(!parent){
    console.warn('parent undefined', parent, child);
  }
  console.log('appending child', {child, parent} )
  parent!.childs.push(child);
}


export function removeChild(parent: Instance, child: Instance) {
    console.log('removing child', {child, exChilds: parent?.childs})
    parent!.childs = parent!.childs.filter(x => x?.id === child?.id);
}

export function updateItem(instance: Instance, propsToUpdate: Dict) {
    instance!._props = {...instance!._props, ...propsToUpdate};
}

export function reOrderBeforeChild(
  child: Instance,
  beforeChild: Instance,
  parent: Instance
) {
  const { childs: children } = parent!;
  const toIndex = children.findIndex((x) => x?.id === beforeChild?.id);
  const fromIndex = children.findIndex((x) => x?.id === child?.id);
  arraymove(parent!.childs, fromIndex, toIndex);
}

export function insertBefore(
  child: Instance,
  beforeChild: Instance,
  parent: Instance
) {
  const exists = parent!.childs.findIndex((x) => x?.id === child?.id) != -1;
  if (!exists) {
    appendChild(parent, child);
  }
  reOrderBeforeChild(child, beforeChild, parent);
}


export function clone(instance: Instance){
    console.log('clone',instance);
    return cloneDeep(instance)
}

export function cloneWithNewProps(instance: Instance, updatePayload: Dict){
    const cloned = clone(instance)
    cloned._props = {...cloned?._props, ...updatePayload};
    return cloned
}

export function cloneWithNewChildren(instance: Instance){
  console.log('cloneWithNewChildren');
    const cloned = clone(instance);
    cloned.childs = []
    return cloned
}

export function cloneWithNewChildrenAndProps(instance: Instance, updatePayload: Dict){
  console.log('cloneWithNewChildrenAndProps', updatePayload);
    const cloned = clone(instance);
    cloned.childs = []
    cloned._props = {...cloned?._props, ...updatePayload};
}

export function createChildSet(instance: Instance){
    console.log('createChildSet', instance);
     
     return [];
}

export function appendChildToSet(childSet: Instance["childs"],child: Instance ){
  console.log('appendChildToSet',{childSet,child})
    // if(!childSet.find(x => x.id == child.id)){
    //   childSet.push(child);
    // }
    childSet.push(child)
}