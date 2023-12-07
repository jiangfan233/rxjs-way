#### 业务场景：

- 一个树有一个根节点、多个子节点；
- 一个父节点下的子节点数量不确定、会变化；
- 每个节点都要绘制一个方形图片；
- 父节点在右侧，子节点在父节点的左侧，即一个“横放”的树；
- 每个子节点都要有一个箭头指向其对应的父节点，并且指向同一个父节点的箭头标号相同；指向不同父节点的箭头不同；

这个问题想了很久才想出来一个近似完美(节点不会重叠)的解法（晚点上图）：

- 同一列上面节点位置、数量会对下面节点位置有影响，因此需要递归画出上面节点，在绘制下面节点的时候进行碰撞检测；


***回溯算法 + 碰撞检测***


```javascript
import { useEffect, useRef } from "react";
import { EdgeType, fakedata, NodeType, Reactiontree } from "./data";
import LogicFlow from "@logicflow/core";
import { SmilesNodeConfig, SmilesNodeConfigType } from "./BaseNode";
import { ProcessEdge, ProcessEdgeName } from "./BaseLine";

const ImageLength = 200;
const Length = 1200;
const Height = 700;
const NodeLength = 100;
const RowGap = 200;
const ColGap = 250;
const EdgeTypeValue = ProcessEdgeName;

let counter = 1;
const maxYofEachLevel: Record<number, number | undefined> = {};

const getChildYByParent = (parentNode: NodeType, childCount: number) => {
  return childCount > 1
    ? parentNode.y - (NodeLength * childCount + RowGap * (childCount - 1)) / 2
    : parentNode.y;
};

const generateNodeInfo = (
  node: Reactiontree,
  level: number,
  parentNode: NodeType | null,
  childCount: number
): NodeType => {
  let y = 0;
  let x = 0;
  if (!Boolean(parentNode)) {
    y = Height / 2 - NodeLength / 2;
    x = Length - NodeLength - ColGap;
  } else if (maxYofEachLevel[level] != undefined) {
    const childYByParent = getChildYByParent(parentNode!, childCount);
    let tmpY = maxYofEachLevel[level]! + 0;
    // 碰撞检测
    if (childYByParent < tmpY) {
      parentNode!.y = parentNode!.y + (tmpY - childYByParent);
      maxYofEachLevel[level - 1] = Math.max(
        maxYofEachLevel[level - 1]!,
        parentNode!.y
      );
    }
    y = Math.max(tmpY + RowGap, childYByParent);
    x = parentNode!.x - NodeLength - ColGap;
  } else {
    y = getChildYByParent(parentNode!, childCount);
    x = parentNode!.x - NodeLength - ColGap;
  }

  return {
    id: `${counter++}`,
    y,
    x,
    type: SmilesNodeConfigType,
    properties: {
      smiles: node.smiles,
      in_stock: node.in_stock,
      imageLength: ImageLength,
    },
  };
};

const collectEdges = (
  parentNode: NodeType,
  childNode: NodeType,
  edges: EdgeType[],
  step: number
) => {
  edges.push({
    type: EdgeTypeValue,
    id: `${childNode.id}->${parentNode.id}`,
    sourceNodeId: childNode.id,
    targetNodeId: parentNode.id,
    text: step.toString(),
    properties: {
      ci: step,
      targetId: parentNode.id,
    },
  });
};

const handleReactionTreePro = (tree: Reactiontree) => {
  const nodes: NodeType[] = [];
  const edges: EdgeType[] = [];
  let step = 1;

  const handle = (
    mol: Reactiontree,
    level = 1,
    parentNode: null | NodeType = null
  ) => {
    const childCount = Array.isArray(mol.children) ? mol.children.length : 0;
    const node = generateNodeInfo(mol, level, parentNode, childCount);
    nodes.push(node);
    maxYofEachLevel[level] =
      Math.max(
        node.y,
        Boolean(maxYofEachLevel[level]) ? maxYofEachLevel[level]! : -999
      ) + RowGap;
    if (childCount > 0) {
      // 用于记录箭头标号
      let memoStep = step++;
      // forEach作用在于回溯
      mol.children!.forEach((childTree) => {
        // 进行递归
        const childNode = handle(childTree, level + 1, node);
        collectEdges(node, childNode, edges, memoStep);
      });
    }
    return node;
  };

  handle(tree);

  return { nodes, edges };
};

export const ReverseTreeCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const lf = new LogicFlow({
      container: canvasRef.current,
      stopScrollGraph: true,
      stopZoomGraph: false,
      width: Length,
      height: Height,
      textEdit: false, // 文本可编辑
      isSilentMode: true, // 仅浏览不可编辑模式
      hideAnchors: true,
      grid: false,
      hoverOutline: true,
    });
    // lf.register(SmilesNodeConfig);
    lf.batchRegister([SmilesNodeConfig, ProcessEdge]);

    const { nodes, edges } = handleReactionTreePro(fakedata);

    // const { tailSmiles, reactions, stepCount, ...rest } =
    //   handleReactionTreePro(reactionTree);
    // startTransition(() => {
    //   setReactions(reactions);
    //   setTailSmiles(tailSmiles);
    //   setStepCount(stepCount);
    // });
    // nodesAndEdgesRef.current = rest;
    lf.render({ nodes, edges });
    // lfRef.current = lf;
  }, []);

  return (
    <>
      <div ref={containerRef} className="mt-2 overflow-x-auto">
        <p>reverse tree</p>
        <div
          ref={canvasRef}
          style={{ width: `${Length}px`, height: `${Height}px` }}
          id="dag-canvas"
        ></div>
      </div>
    </>
  );
};

```