/* @flow */
// 当我们的代码执行 import Vue from 'vue' 的时候，就是从这个入口执行代码来初始化 Vue，
import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref,
} from "./util/compat";

const idToTemplate = cached((id) => {
  const el = query(id);
  return el && el.innerHTML;
});
//缓存mount方法
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el?: string | Element, //参数可选项
  hydrating?: boolean
): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    //Vue 不能挂载在 body、html 这样的根节点上
    process.env.NODE_ENV !== "production" &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    // 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      /*
       无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 
      render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 compileToFunctions 
      方法实现的，最后，调用原先原型上的 $mount 方法挂载。
       */
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,//该选项可以改变纯文本插入分隔符，当不传递值时， Vue 默认的分隔符为
          // {{}} 。如果我们想使用其他模板，可以通过 delimiters 修改。
          
          comments: options.comments,//当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃
          // 它们。
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  //无论是template模板还是手写render函数最终调用缓存的 $moun方法
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
