function flattenDomElements(node) {
  if (node.tagName === 'svg') {
    return [node];
  }
  let elementsArray = []; // 初始化数组，用于存放元素节点
  elementsArray.push(node);
  // if (node.nodeType === Node.ELEMENT_NODE) {
  //   elementsArray.push(node); // 如果当前节点是元素节点，加入数组
  // }
  node.childNodes.forEach((child) => {
    // if (child.nodeType === Node.ELEMENT_NODE) {
    //   // 递归遍历子节点，如果子节点也是元素节点，则递归调用函数
    //   elementsArray = elementsArray.concat(flattenDomElements(child));
    // }
    elementsArray = elementsArray.concat(flattenDomElements(child));
  });
  return elementsArray;
}

function getFontStyle(dom) {
  // 如果dom是文本节点
  if (isTextElement(dom)) {
    const style = window.getComputedStyle(dom);
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    };
  }
  const doms = dom.children;
  for (let i = 0; i < doms.length; i++) {
    const fontSize = getFontStyle(doms[i]);
    if (fontSize) {
      return fontSize;
    }
  }
  return null;
}

function isTextElement(dom) {
  if (dom.nodeType !== 1) {
    return false;
  }
  const hasChildren = dom.children.length !== 0;
  if (hasChildren) {
    return false;
  }
  const childNodes = dom.childNodes || [];
  if (childNodes.length === 0) {
    return false;
  }
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType !== 3) {
      return false;
    }
  }
  return true;
}

function getDomNodes(rootElement = document.body) {
  // let rootElement = document.getElementById('rootPage'); // 获取你想要遍历的DOM元素
  const domNodes = flattenDomElements(rootElement);
  // 基点
  let rootTop = 0;
  let rootLeft = 0;
  // 映射每个节点到所需的信息对象
  const nodesInfo = Array.from(domNodes).map((node) => {
    let rect = null;
    // 获取滚动位置以计算相对于文档的位置
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    let style = {};
    if (node instanceof Element) {
      style = window.getComputedStyle(node);
    }

    // 兼容文本节点
    if (node.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.selectNodeContents(node);
      rect = range.getBoundingClientRect();
      return {
        childElementCount: node.childElementCount,
        nodeType: node.nodeType,
        id: '', // 获取data-figma-id的值
        width: rect.width, // 元素宽度
        height: rect.height, // 元素高度
        left: rect.left + scrollLeft, // 元素相对于文档左上角的横坐标
        top: rect.top + scrollTop, // 元素相对于文档左上角的纵坐标
        cssStyle: {
          borderRadius: style?.borderRadius,
          fontStyle: {
            fontFamily: style?.fontFamily,
            fontSize: style?.fontSize,
            fontWeight: style?.fontWeight,
          },
        },
        node: {},
      };
    } else {
      rect = node.getBoundingClientRect();
      const className = node.getAttribute('class');
      const textElementType = isTextElement(node);
      if (node === rootElement) {
        rootLeft = rect.left + scrollLeft;
        rootTop = rect.top + scrollTop;
      }
      return {
        childElementCount: node.childElementCount,
        nodeType: node.nodeType,
        id: node.getAttribute('id'), // 获取data-figma-id的值
        width: rect.width, // 元素宽度
        height: rect.height, // 元素高度
        left: rect.left + scrollLeft, // 元素相对于文档左上角的横坐标
        top: rect.top + scrollTop, // 元素相对于文档左上角的纵坐标
        className,
        textElementType, // dom节点，里面是纯文本
        cssStyle: {
          borderRadius: style?.borderRadius,
          fontStyle: {
            fontFamily: style?.fontFamily,
            fontSize: getFontStyle(node)?.fontSize,
            fontWeight: getFontStyle(node)?.fontWeight,
          },
        },
        node: {},
      };
    }
  });

  // 获取wrapperGrounp节点的坐标
  nodesInfo.forEach((item) => {
    item.top = item.top - rootTop;
    item.left = item.left - rootLeft;
  });
  return nodesInfo;
}

window.addEventListener('load', function () {
  // DOM完全加载和解析完成了
  setTimeout(function () {
    const doms = getDomNodes(document.body);
    const data = {
      doms: doms,
      type: 'check',
    };
    window.parent.postMessage(JSON.stringify(data), '*');
  }, 1000);
});
