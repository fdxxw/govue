export const baseSize = 16;
export const baseWidth = 1920;

// 设置 rem 函数

export function setRem() {
  // 设置页面根节点字体大小
  // document.documentElement.style.fontSize = (baseSize * Math.min(scale, 5)) + 'px'
  document.documentElement.style.fontSize = getFontSize() + "px";
}

export function getFontSize() {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const clientWidth = document.documentElement.clientWidth;
  let fontSize = baseSize;
  if (clientWidth <= 1500) {
    fontSize = 12;
  } else if (clientWidth > 1500 && clientWidth <= 1920) {
    fontSize = 14;
  } else {
    fontSize = 18;
  }
  return fontSize;
}
