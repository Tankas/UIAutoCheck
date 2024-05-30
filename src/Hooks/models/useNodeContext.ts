import { useContext } from "react";
import { NodesContext } from "@/models/nodes";

export const useNodeContext = () => {
  const { state, dispatch } = useContext(NodesContext)
  const { rightNodes, errorNodes, showRightNodes, showErrorNodes, showNodeTable, nodeTableInfo } = state;
  return {
    state,
    dispatch,
    rightNodes,
    errorNodes,
    showRightNodes,
    showErrorNodes,
    showNodeTable,
    nodeTableInfo
  }
}