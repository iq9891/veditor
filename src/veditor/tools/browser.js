export default () => {
  /**
   * 浏览器判断是否是手机
   * @static
   * @since 1.0.0
   * @returns {Object<booean>} Returns {isMobile是否是手机, os是否是ios}
   * @example
   *
   * _.versions()
   * // => Logs {isMobile: true, os: true} // 是一个ios手机
   */
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isBlackBerry = /BlackBerry/i.test(ua);
  const isWindowPhone = /IEMobile/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isOpera = /Opera|OPR/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isSafari = /Safari/i.test(ua);
  const isChrome = /Chrome/i.test(ua);
  const isQQBrowser = /QQBrowser/i.test(ua);
  const isMaxthon = /Maxthon/i.test(ua);
  const isIE = /compatible/i.test(ua) && /MSIE/i.test(ua);

  const isMobile = isAndroid || isBlackBerry || isWindowPhone || isIOS;
  let os = 'pc';
  if (isAndroid) os = 'android';
  if (isBlackBerry) os = 'BlackBerry';
  if (isWindowPhone) os = 'WindowPhone';
  if (isSafari) os = 'Safari';
  if (isFirefox) os = 'Firefox';
  if (isChrome) os = 'Chrome';
  if (isOpera) os = 'Opera';
  if (isQQBrowser) os = 'QQ';
  if (isMaxthon) os = 'Maxthon';
  if (isIE && !isOpera) os = 'msie';

  return {
    isMobile,
    os,
  };
};
