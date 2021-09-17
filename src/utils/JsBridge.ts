// 与原生app交互的js,最终输出一个对象, 交互逻辑
// 1.如果H5在调完app的方法之后,需要执行对应的回调函数,则需要这些操作: 将回调函数挂在到window的一个唯一的属性上面(属性名可以是app方法名+时间戳); 将属性名加入到将要传递给app的参数里
// 2.如果没有回调函数, 则不需执行步骤1; 参数拼接在schemeurl中,利用iframe的src属性去调用url,app会拦截到这个行为和url地址,通过url获取到对应的参数,app要执行的方法,毁掉明等
// h5传递给app的参数(拼接在schemeUrl中)包含以下这些
/**
 * @param {string} appMethodName: 需要执行的app方法名
 * @param {string} 自定义的各种参数
 * @param {string} callBackName: 需要app去调用的挂载载window的回调方法名,app可以将参数传递进去
 */
const isApp: boolean = navigator.userAgent.indexOf('SKYAPP') > -1
const jsBridge = {
  appurl: 'skyappscheme://',
  callapp(nativeMethodName, params) {
    if (!nativeMethodName || typeof nativeMethodName !== 'string') {
      console.error('nativeMethodName请输入string类型')
      return
    }
    // 将app的scheme地址与加密的url拼接
    let url: string = this.appurl + encodeURIComponent(nativeMethodName)
    let isFirst = true
    // 将参数进行加密,拼接在url后面
    if (params) {
      if (typeof params !== 'object') {
        console.error('params必须为object')
      } else {
        for(const key in params) {
          if (isFirst) {
            url = url + '?' + key + '=' + encodeURIComponent(params[key])
            isFirst = false
          } else {
            url = url + '&' + key + '=' + encodeURIComponent(params[key])
          }
        }
      }
    }
    // 拼装完url之后, 创立个iframe元素,调用url,以便于让app拦截
    const iframeDom = document.createElement('iframe')
    iframeDom.style.height = '1px'
    iframeDom.style.width = '1px'
    iframeDom.style.display = 'none'
    iframeDom.src = url
    document.append(iframeDom)
    console.log(url)
    setTimeout(() => {
      iframeDom.remove()
    }, 100)
  }
}
// 封装在h5中调用的方法
const h5CallAppHandle = (name: any, param = {}, callBack: any) => {
  console.log(name, param, callBack)
  // 是否存在回调->是: 拼装回调函数的名称,作为参数拼装在iframe的url中以便app获取, 将名称和回调挂在在windows对象以便于app调用
  if (callBack) {
    const callBackName = name + new Date().getTime() // 拼接时间戳, 避免之前有的属性被覆盖
    param = {
      ...param,
      callBackName,
    }
    (window: window)[callBackName] = (res) => {
      callBack && callBack(res)
    }
  }
  jsBridge.callApp(name, param)
}
export default h5CallAppHandle