export const loadCSSUrl = function(url: string, callback: any) {
  const loaderCss = document.createElement("link");
  loaderCss.rel = "stylesheet";
  loaderCss.href = url;
  loaderCss.addEventListener("load", () => {
    if (callback) {
      callback();
    }
  });
  document.head.appendChild(loaderCss);
};

export const loadCssString = function(cssString: string, callback: any) {
  const loaderCss = document.createElement("style");
  loaderCss.type = "text/css";
  loaderCss.innerText = cssString;
  loaderCss.addEventListener("load", () => {
    if (callback) {
      callback();
    }
  });
  document.head.appendChild(loaderCss);
};
