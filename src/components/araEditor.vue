<template>
  <div class="editor">
    <div class="editor-toolbar">
      <div class="tabs">
        <div
          v-for="tab in enabledTabs"
          :key="`toolbar-tab-${tab.name}`"
          :class="{
            active: 'active' in tab && tab.active,
            spacer: tab.type == 'spacer',
          }"
          @click="toogleTab(tab.name)"
          class="tab"
        >
          <div class="tab-contents">
            <div v-if="tab.icon" class="icon" v-html="tab.icon"></div>

            <div v-if="tab.title" class="name">{{ tab.title }}</div>
          </div>
        </div>
      </div>

      <div class="tab-contents">
        <div
          v-for="(tabContent, tabContentIndex) in currentTab.items"
          :key="
            `toolbar-tab-conetnt-item-` +
              ('name' in tabContent ? currentTab.name : tabContentIndex) +
              '-' +
              tabContent.name
          "
          :style="{ 'animation-delay': `${tabContentIndex * 0.03}s` }"
          class="tab-item"
        >
          <div v-if="tabContent.type == 'separator'" class="separator"></div>

          <button
            v-if="tabContent.type == 'button'"
            :class="{ active: tabContent.active }"
            @click="
              run('options' in tabContent ? tabContent.options : {}, $event)
            "
            class="button"
          >
            <div
              v-html="tabContent.icon"
              class="icon"
              :style="{ color: 'color' in tabContent ? tabContent.color : '' }"
            ></div>

            <div class="name">{{ tabContent.title }}</div>
          </button>
        </div>
      </div>
    </div>
    <!-- <div ref="editor"
                @click="caretChange($event)"
                @mousemove="mouseMove($event)"
                @input="contentChanged"
                class="editor-content"
                contenteditable="true"
                v-html="content"
                >
            </div> -->
    <div
      ref="editor"
      @click="caretChange($event)"
      @mousemove="mouseMove($event)"
      class="editor-content"
      contenteditable="true"
      v-html="content"
    ></div>

    <colorPicker
      v-if="windows.color.status"
      @close="windowClosed('color')"
      @done="colorPicked"
    />
    <imageUploader
      v-if="windows.image.status"
      @close="windowClosed('image')"
      @done="imageUploaded"
    />
    <linkMaker
      v-if="windows.link.status"
      @close="windowClosed('link')"
      @done="addLink"
    />
    <emojiPicker
      v-if="windows.emoji.status"
      @close="windowClosed('emoji')"
      @done="emojiPicked"
    />
    <chartDrawer
      v-if="windows.chart.status"
      @close="windowClosed('chart')"
      @done="addChart"
    />
    <symbols
      v-if="windows.specialChars.status"
      @close="windowClosed('specialChars')"
      @done="addSymbol"
      :symbols="specialChars"
      :title="'افزودن علامت'"
    />

    <mathColletion
      v-if="windows.math.status"
      :title="windows.math.title"
      :equation="windows.math.equation"
      @close="windowClosed('math')"
      @done="mathPicked"
    />
    <matrix
      v-if="windows.matrix.status"
      @close="windowClosed('matrix')"
      @done="addMatrix"
    />
    <symbols
      v-if="windows.mathSymbol.status"
      @close="windowClosed('mathSymbol')"
      @done="addSymbol"
      :symbols="mathSymbols"
      :title="'افزودن علامت ریاضی'"
    />
  </div>
</template>

<script>
import iconPack from "./araEditor/icons"
import toolbarItems from "./araEditor/toolbar"

import colorPicker from "./araEditor/colorPicker"
import imageUploader from "./araEditor/imageUploader"
import emojiPicker from "./araEditor/emojiPicker"
import linkMaker from "./araEditor/linkMaker"
import chartDrawer from "./araEditor/chartDrawer"
import specialCharsPack from "./araEditor/specialChars"

import mathColletion from "./araEditor/mathColletion"
import matrix from "./araEditor/matrix"

import symbols from "./araEditor/symbols"
import mathSymbolsPack from "./araEditor/mathSymbols"

import mathPack from "./araEditor/math"

export default {
  props: {
    rtl: Boolean,
    value: Boolean,
    defaultContent: String,
  },
  data() {
    return {
      content: "",
      icons: iconPack,
      toolbar: toolbarItems,
      path: [],
      windows: {
        color: {
          status: false,
          action: "fore",
        },
        image: {
          status: false,
        },
        link: {
          status: false,
        },
        emoji: {
          status: false,
        },
        chart: {
          status: false,
        },
        specialChars: {
          status: false,
        },
        math: {
          status: false,
          title: "عبارت ریاضی",
          equation: "",
        },
        matrix: {
          status: false,
        },
        mathSymbol: {
          status: false,
        },
      },
      math: mathPack,
      mathSymbols: mathSymbolsPack,
      specialChars: specialCharsPack,
      equationCount: 0,
      lastClickedTab: "",
    }
  },
  methods: {
    closePanel() {
      this.$set(this, "value", false)
    },
    contentChanged() {
      let html = this.$refs.editor.innerHTML
      html = html.replace(
        /<span\sclass="equation\sequation-item-.*">\s*<\/span>/g,
        ""
      )
      html =
        html.indexOf('<div class="editor-output">') == -1
          ? `<div class="editor-output">${html}</div>`
          : html
      return html

      // this.$set(this,"content",this.content)
    },
    confirmChanges() {
      this.$emit("changed", this.contentChanged())
      this.$emit("input", false)
    },
    toogleTab(name) {
      // Deactive all tabs and active the indexed one
      this.toolbar.forEach(tab => (tab.active = false))

      if (this.lastClickedTab == name) {
        console.log("hide now")
        this.lastClickedTab = ""
        this.toolbar.find(tab => tab.name == name).active = false
        return
      }

      this.toolbar.find(tab => tab.name == name).active = true

      this.lastClickedTab = name
    },
    getParents(e) {
      var result = []
      for (var p = e && e.parentElement; p; p = p.parentElement) {
        result.push(p)
      }
      return result
    },
    replaceSelectedText(html) {
      let sel, range
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection()

        if (this.getParents(sel.anchorNode).indexOf(this.$refs.editor) == -1) {
          this.$refs.editor.innerHTML += html
          return
        }

        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()

          // Range.createContextualFragment() would be useful here but is
          // non-standard and not supported in all browsers (IE9, for one)
          let el = document.createElement("div")
          el.innerHTML = html
          let frag = document.createDocumentFragment(),
            node,
            lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          range.insertNode(frag)

          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html)
      }

      this.contentChanged()
    },
    run(options, event) {
      if (!("type" in options)) {
        return
      }

      switch (options.type) {
        case "text":
          document.execCommand(options.command, false)
          break

        case "color":
        case "image":
        case "link":
        case "emoji":
        case "matrix":
        case "mathSymbol":
        case "specialChars":
        case "chart":
          this.windows[options.type].status = true

          if ("action" in this.windows[options.type]) {
            this.windows[options.type].action = options.action
          }
          break

        case "math":
          this.toolbar.find(tab => tab.name == "math").enabled = true

          this.toolbar.forEach(tab => (tab.active = false))
          this.toolbar.find(tab => tab.name == "math").active = true

          this.equationCount++
          let equation = document.createElement("span")
          equation.classList.add(
            "equation",
            `equation-item-${this.equationCount}`
          )

          this.replaceSelectedText(`&nbsp;${equation.outerHTML}&nbsp;`)

          let selection = window.getSelection()
          selection.collapse(
            document.querySelector(`.equation-item-${this.equationCount}`)
          )
          break
        case "equation":
          if (options.equation == "container") {
            this.mathPicked(
              `<div class="math block ${options.style}" contenteditable="false">
                                <span class="line"></span>
                                <span class="place here" contenteditable="true"></span>
                                <span class="line"></span>
                            </div>`
            )
          } else {
            this.windows.math.title = options.title
            this.windows.math.equation = options.equation
            this.windows.math.status = true
          }
          break
      }
    },
    windowClosed(window) {
      this.windows[window].status = false
    },
    getPath(path) {
      let newPath = []

      // Get all elements that are child of .editor-content
      let before = true
      path
        .filter(element => "matches" in element)
        .forEach(element => {
          if (element.matches(".editor-content")) {
            before = false
          } else if (before) {
            newPath.push(element)
          }
        })

      return newPath
    },
    getTool(name) {
      let tab = this.toolbar.find(t => t.items.some(tool => tool.name == name))

      if (!tab) return null

      return tab.items.find(tool => tool.name == name)
    },
    mouseMove(e) {},
    caretChange(e) {
      this.path = e ? this.getPath(e.path) : null

      // Hides or shows math tab depend on where the caret is
      let mathTab = this.toolbar.find(tab => tab.name == "math")
      let enableMath = this.path
        ? this.path.some(item => item.matches(".equation"))
        : false

      if (enableMath) {
        this.toolbar.forEach(tab => (tab.active = false))
      }
      mathTab.enabled = mathTab.active = enableMath

      this.getTool("bold").active = document.queryCommandState("bold")
      this.getTool("italic").active = document.queryCommandState("italic")
      this.getTool("underline").active = document.queryCommandState("underline")
      this.getTool("strikethrough").active = document.queryCommandState(
        "strikethrough"
      )

      this.getTool("alignRight").active = document.queryCommandState(
        "justifyRight"
      )
      this.getTool("alignCenter").active = document.queryCommandState(
        "justifyCenter"
      )
      this.getTool("alignLeft").active = document.queryCommandState(
        "justifyLeft"
      )
    },
    colorPicked(color) {
      let action = this.windows.color.action

      if (action == "fore") {
        document.execCommand("foreColor", false, color)
      } else if (action == "back") {
        document.execCommand("backColor", false, color)
      }
    },
    imageUploaded(url) {
      let image = document.createElement("div")
      image.classList.add("image", "editor-image")
      image.contentEditable = false

      let img = document.createElement("img")
      img.src = url
      image.appendChild(img)

      this.replaceSelectedText(`&nbsp;${image.outerHTML}&nbsp;`)
    },
    addLink(link) {
      // Add link to editor
      if (link) {
        this.replaceSelectedText(link)
      }

      // Attach event for detecting "ctrl + click"
      let links = document.querySelectorAll(".editor-content a")
      links.forEach(link => {
        let href = link.href

        link.addEventListener("click", e => {
          if (e.ctrlKey) {
            window.open(href, "_blank")
          }
        })
      })
    },
    emojiPicked(emoji) {
      this.replaceSelectedText(emoji)
    },
    addChart(chart) {
      this.replaceSelectedText(chart)
    },
    mathPicked(template) {
      this.replaceSelectedText(`&nbsp;${template}&nbsp;`)

      let allMathes = document.querySelectorAll(".editor-content .math")
      allMathes.forEach(math => {
        math.addEventListener("mouseover", e => {
          e.stopPropagation()
          this.hoverd = e.currentTarget
        })

        math.addEventListener("mouseleave", () => (this.hoverd = null))
      })
    },
    addMatrix(matrix) {
      this.replaceSelectedText(matrix)
    },
    addSymbol(symbol) {
      this.replaceSelectedText(
        `&nbsp;<span class="symbol">${symbol}</span>&nbsp;`
      )
    },
  },
  watch: {
    value(val) {
      this.$emit("input", false)
    },
  },
  computed: {
    enabledTabs() {
      // Return the tabs that are enable
      return this.toolbar.filter(tab => tab.enabled == true)
    },
    currentTab() {
      // Return the only tab that is active at the time
      let active = this.toolbar.find(tab => tab.active == true)

      if (!active) {
        this.toolbar[0].active = true
        active = this.toolbar[0]
      }

      return active
    },
  },
  created() {},
  async mounted() {
    // this.$refs.editor.focus();
    this.caretChange()
    if (!!this.defaultContent) {
      this.$set(this, "content", this.defaultContent)
    } else {
      this.$set(this, "content", "")
    }
    // this.contentChanged();
  },
  components: {
    colorPicker,
    imageUploader,
    linkMaker,
    emojiPicker,
    chartDrawer,
    mathColletion,
    matrix,
    symbols,
  },
}
</script>

<style>
/* -------------------------------- Keyframes ------------------------------- */
@keyframes fade-up-in {
  0% {
    opacity: 0;
    transform: translateY(0.5em);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tab-in {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

/* --------------------------------- General -------------------------------- */
.editor {
  --radius: 8px;
  --back: #fff;
  --primary: #0ac;
  --secondary: #48dc84;
  --toolbar: #fafafa;
  --fore: #4a5760;

  background-color: var(--back);
  border-radius: var(--radius) var(--radius) 0 0;
  box-shadow: 0 10px 20px #0001;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  height: 60vh;
  min-height: 300px;
  overflow: hidden;
  position: relative;
}

/* --------------------------------- Toolbar -------------------------------- */
.editor > .editor-toolbar {
  background-color: var(--toolbar);
  transition: all 0.3s ease;
  user-select: none;
}

.editor > .editor-toolbar > .tabs {
  background-color: #0001;
  display: flex;
  font-size: 0.8em;
  overflow: hidden;
}

.editor > .editor-toolbar > .tabs .tab {
  align-items: flex-end;
  animation: tab-in 0.3s ease forwards;
  box-sizing: border-box;
  color: var(--fore);
  cursor: pointer;
  display: flex;
  opacity: 0.6;
  overflow: hidden;
  padding: 0.6em 1em;
  position: relative;
  perspective: 30px;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.editor > .editor-toolbar > .tabs .tab.active {
  opacity: 1;
}

.editor > .editor-toolbar > .tabs .tab.spacer {
  visibility: hidden;
}

.editor > .editor-toolbar > .tabs .tab::before {
  background-color: var(--toolbar);
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  content: "";
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transform-origin: bottom;
  transform: rotateX(30deg);
  transition: all 0.3s ease;
  width: 100%;
  z-index: 0;
}

.editor > .editor-toolbar > .tabs .tab:hover::before,
.editor > .editor-toolbar > .tabs .tab.active::before {
  opacity: 1;
  transform: rotateX(5deg);
}

.editor > .editor-toolbar > .tabs .tab.active::before {
  transform: rotateX(0);
}

.editor > .editor-toolbar > .tabs .tab .tab-contents {
  align-items: center;
  display: flex;
  z-index: 1;
}

.editor > .editor-toolbar > .tabs .tab .icon {
  height: 0.8em;
  margin-left: 1em;
  width: 0.8em;
}

.editor > .editor-toolbar > .tabs .tab .icon svg {
  display: block;
  fill: currentColor;
  height: 100%;
  transition: all 0.3s ease;
  width: 100%;
}

.editor > .editor-toolbar > .tabs .tab.active .icon svg {
  fill: var(--primary);
}

.editor > .editor-toolbar > .tabs .tab.active .name {
  font-weight: bold;
  transition: all 0.3s ease;
}

.editor > .editor-toolbar > .tab-contents {
  background: linear-gradient(to bottom, var(--toolbar), #00000002);
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2em 0.5em;
}

.editor > .editor-toolbar > .tab-contents > .tab-item {
  animation: fade-up-in 0.3s ease forwards;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(0.5em);
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button {
  align-items: center;
  border: solid 1px transparent;
  border-radius: var(--radius);
  color: var(--fore);
  display: block;
  display: flex;
  flex-direction: column;
  min-width: 4em;
  opacity: 0.8;
  outline: none;
  padding: 0.5em 1em;
  transition: all 0.3s ease;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button:hover {
  background-color: #fff8;
  box-shadow: 0 0.1em 0.3em #00000005;
  opacity: 1;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button.active,
.editor > .editor-toolbar > .tab-contents > .tab-item > .button:active {
  box-shadow: inset 0 0.2em 0.3em #00000005, 0 0.1em 0.1em #00000005;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button.active {
  background-color: var(--primary);
  box-shadow: 0 1px 10px -3px var(--primary);
  color: #fff;
  transform: scale(0.9);
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button .icon {
  height: 1em;
  margin-bottom: 0.5em;
  width: 1em;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button .icon svg {
  display: block;
  fill: currentColor;
  height: 100%;
  width: 100%;
}

.colorPlaceholder {
  fill: currentColor;
  transition: all 0.3s ease;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .button .name {
  font-size: 0.6em;
  opacity: 0.8;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .separator {
  align-items: center;
  display: flex;
  height: 100%;
  margin: 0 0.3em;
}

.editor > .editor-toolbar > .tab-contents > .tab-item > .separator::after {
  background-color: #0001;
  content: "";
  height: 60%;
  width: 1px;
}

@media (max-width: 700px) {
  .editor > .editor-toolbar {
    font-size: 0.8em;
  }

  .editor > .editor-toolbar > .tabs,
  .editor > .editor-toolbar > .tab-contents {
    justify-content: center;
  }

  .editor > .editor-toolbar > .tab-contents > .tab-item > .button .icon {
    margin: 0.3em;
  }

  .editor > .editor-toolbar > .tab-contents > .tab-item > .button .name {
    display: none;
  }
}

@media (max-width: 200px) {
  .editor > .editor-toolbar > .tabs .tab .icon {
    margin: 0.2em;
  }

  .editor > .editor-toolbar > .tabs .name {
    display: none;
  }
}

/* --------------------------------- Content -------------------------------- */
.editor-content {
  background-color: var(--back);
  box-sizing: border-box;
  padding: 0.5em;
  height: 100%;
  outline: none;
  overflow: auto;
}

.editor-output {
  display: block;
  width: 100%;
}

.editor-content::-webkit-scrollbar {
  width: 0.5em;
}

.editor-content::-webkit-scrollbar-track {
  background: var(--toolbar)
    linear-gradient(to bottom, #00000002, var(--toolbar));
}

/* --------------------------------- Window --------------------------------- */
.window .form .field {
  margin-top: 1em;
}

.window .form .field label {
  display: block;
  font-size: 0.8em;
  margin-bottom: 0.5em;
  opacity: 0.8;
}

.window .form .field input {
  border: solid 1px #0001;
  border-radius: var(--radius);
  box-shadow: 0 7px 5px -7px #0002;
  box-sizing: border-box;
  display: block;
  outline: none;
  padding: 0.2em 0.5em;
  transition: all 0.3s ease;
  width: 100%;
}

.window .form .field.en input {
  direction: ltr;
  text-align: left;
}

.window .form .field input:hover {
  border-color: #0002;
}

.window .form .field input:focus {
  border-color: var(--primary);
}

/* ---------------------------------- Image --------------------------------- */
.editor-content .image,
.editor-image {
  background-color: #0001;
  border: solid 2px transparent;
  border-radius: 8px;
  box-sizing: border-box;
  display: inline-block;
  margin: 3px;
  min-width: 250px;
  transition: all 0.3s ease;
  vertical-align: middle;
  width: 40%;
}

.editor-content .image:hover {
  border-color: var(--primary);
}

@media (max-width: 400px) {
  .editor-content .image,
  .editor-image {
    display: block;
    margin: 3px auto;
  }
}

.editor-content .image img,
.editor-image img {
  border-radius: inherit;
  display: block;
  max-height: 300px;
  object-fit: contain;
  width: 100%;
}

.editor-content .image.chart {
  background-color: #00000008;
}

/* ---------------------------------- Math ---------------------------------- */
.editor-content .equation,
.math {
  box-sizing: border-box;
  direction: ltr;
  font-family: serif;
  font-style: italic;
  text-align: left;
}

.editor-content .equation *,
.math * {
  font-family: serif;
  font-style: italic;
}

.editor-content .equation {
  border: solid 1px #0001;
  border-radius: var(--radius);
  border-bottom-width: 2px;
  display: inline-block;
  outline: none;
  padding: 0.3em;
  vertical-align: middle;
}

.editor-content .equation:hover {
  border-color: #0003;
}

.editor-content .equation:focus-within {
  border-color: var(--primary);
}

.editor-content .equation:empty::before {
  color: #000a;
  content: "عبارت ریاضی را اینجا وارد کنید";
  font-size: 0.8em;
  margin: 0.2em;
  pointer-events: none;
}

.math {
  display: inline-flex;
}

@keyframes math-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.editor-content .math {
  animation: math-in 0.3s ease forwards;
  line-height: 1em;
  outline: none;
  padding: 0.5em;
  vertical-align: middle;
}

.math .place {
  align-items: center;
  border: dotted 1px transparent;
  display: inline-block;
  line-height: 1em;
  outline: none;
}

.math .place:focus-within {
  background-color: #0001;
}

.math .place:empty {
  border-color: currentColor;
  height: 1em;
  opacity: 0.6;
  width: 0.7em;
}

.math svg {
  fill: currentColor;
  overflow: visible;
}

.math .line svg {
  display: block;
  height: 100%;
  width: 100%;
}

.math .line svg line {
  color: currentColor;
  stroke: currentColor;
}

.symbol {
  display: inline-block;
  height: 0.8em;
  vertical-align: middle;
  width: 0.8em;
}

.symbol svg {
  display: block;
  fill: currentColor;
  height: 100%;
  width: 100%;
}

/* Fraction type 1 */
.math.fraction.type-1 {
  align-items: center;
  flex-direction: column;
}

.math.fraction.type-1 > .place {
  margin: 0 0.2em;
}

.math.fraction.type-1 > .line {
  background-color: currentColor;
  height: 1px;
  margin: 0.5em 0;
  width: 100%;
}

/* Fraction type 2 & 3 */
.math.fraction.type-2,
.math.fraction.type-3 {
  align-items: center;
  justify-content: space-between;
}

.math.fraction.type-2 > .line,
.math.fraction.type-3 > .line {
  margin: 0 0.3em;
  width: 0.8em;
}

/* Fraction type 3 */
.math.fraction.type-3 > .place:first-child {
  margin-bottom: 1em;
}

.math.fraction.type-3 > .place:last-child {
  margin-top: 1em;
}

/* Fraction type 4 */
.math.fraction.type-4 > .place:last-child {
  font-size: 0.7em;
}

/* Radical */
.math.radical > .left {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.math.radical > .left > .top > .place {
  font-size: 0.9em;
}

.math.radical > .left > .bottom .line {
  height: 0.8em;
  stroke-width: 8px;
  width: 0.5em;
}

.math.radical > .center > .line {
  height: 100%;
  stroke-width: 4px;
  width: 0.8em;
}

.math.radical > .center > .line svg {
  height: 100%;
  width: 100%;
}

.math.radical > .right {
  display: flex;
  flex-direction: column;
  position: relative;
}

.math.radical > .right::before {
  background-color: currentColor;
  content: "";
  display: block;
  height: 1px;
  left: 0;
  position: absolute;
  top: -1px;
  width: 100%;
}

.math.radical > .right > .compartment {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  padding: 0.5em;
}

/* Script */
.math.script > .place:nth-child(2) {
  font-size: 0.7em;
  margin-left: 0.2em;
  position: relative;
}

.math.script.exponent > .place:nth-child(2) {
  top: -0.6em;
}

.math.script.exponent {
  margin-top: 0.5em;
}

.math.script.index {
  margin-bottom: 0.5em;
}

.math.script.index > .place:nth-child(2) {
  top: 0.6em;
}

.math.script.chemistry {
  align-items: center;
  display: inline-flex;
}

.math.script.chemistry > .script {
  display: flex;
  flex-direction: column;
  font-size: 0.8em;
  margin-left: 0.3em;
}

.math.script.chemistry > .script > .place:first-child {
  margin-bottom: 0.5em;
}

/* Limit */
.math.limit {
  display: inline-flex;
  flex-direction: column;
}

.math.limit > .bottom {
  font-size: 0.7em;
  margin-left: 2ch;
}

.math.limit-to {
  align-items: center;
  display: inline-flex;
  flex-direction: row !important;
}

.math.limit-to > .arrow {
  margin: 0 0.2em;
  width: 1em !important;
}

.math.limit-to > .place {
  min-width: 0.5em;
}

/* Logarithm */
.math.log {
  display: inline-flex;
}

.math.log > .place {
  margin-left: 0.4em;
}

.math.log > .place.base {
  font-size: 0.7em;
  margin-top: 1em;
}

/* Integral */
.math.integral {
  display: inline-flex;
  flex-direction: column;
}

.math.integral > .top {
  margin-bottom: 0.3em;
}

.math.integral > .top,
.math.integral > .bottom {
  font-size: 0.8em;
  margin-left: 0.5em;
}

.math.integral.double > .top,
.math.integral.double > .bottom {
  margin-left: 0.8em;
}

.math.integral > .center {
  align-items: center;
  display: flex;
}

.math.integral > .center > .icon {
  height: 2em;
  width: 1em;
}

.math.integral.double > .center > .icon + .icon {
  margin-left: -0.6em;
}

.math.integral > .center > .icon svg {
  display: block;
  fill: currentColor;
  height: 100%;
  width: 100%;
}

.math.integral > .center > .compartment {
  align-items: center;
  display: flex;
}

.math.integral > .bottom {
  margin-top: 0.3em;
}

/* Matrix */
.math.matrix {
  display: inline-flex;
}

.math.matrix > .line {
  border: solid 1px currentColor;
  display: inline-flex;
  width: 0.5em;
}

.math.matrix > .line:first-child {
  border-right: none;
}

.math.matrix > .line:last-child {
  border-left: none;
}

.math.matrix > .content {
  display: grid;
  grid-gap: 0.5em;
  margin: 0.5em 0.3em;
}

.math.matrix > .content > .place {
  margin: 0 auto;
}

/* Sigma */
.math.sigma {
  display: inline-flex;
  flex-direction: column;
}

.math.sigma > .top,
.math.sigma > .bottom {
  font-size: 0.7em;
  margin-left: 1ch;
}

.math.sigma > .center {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.math.sigma > .center > .icon {
  height: 1.5em;
  width: 1.5em;
}

.math.sigma > .center > .icon svg {
  display: block;
  height: 100%;
  width: 100%;
}

.math.sigma > .center > .place {
  margin: 0.3em 0;
  margin-left: 0.3em;
}

/* Arrow operator */
.math.operator > .arrow {
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

.math.double-arrow,
.math.single-arrow {
  display: inline-flex;
  flex-direction: column;
}

.math.double-arrow > .arrow {
  border: solid 1px currentColor;
  border-left: none;
  border-right: none;
  height: 0.4em;
}

.math.single-arrow > .arrow {
  background-color: currentColor;
  height: 1px;
}

.math.double-arrow > .arrow::after,
.math.single-arrow > .arrow::after {
  border: solid 1px currentColor;
  border-bottom: none;
  box-sizing: border-box;
  content: "";
  display: block;
  height: 0.6em;
  top: 50%;
  position: absolute;
  width: 0.6em;
}

.math.single-arrow > .arrow::after {
  font-size: 0.8em;
}

.math.arrow-right > .arrow::after {
  border-left: none;
  right: -0.3em;
  transform: translateY(-50%) rotate(45deg);
}

.math.arrow-left > .arrow::after {
  border-right: none;
  left: -0.3em;
  transform: translateY(-50%) rotate(-45deg);
}

.math.double-arrow > .place,
.math.single-arrow > .place {
  font-size: 0.8em;
  margin: 0 0.5em;
}

.math.arrow-top > .place {
  margin-top: 0.7em;
}

.math.arrow-bottom > .place {
  margin-bottom: 0.7em;
}

/* Functions */
.math.function {
  align-items: center;
  display: inline-flex;
}

.math.function > .place {
  margin-left: 0.5em;
}

/* Block math */
.math.block {
  display: inline-flex;
}

.math.block > .line {
  pointer-events: none;
}

.math.block > .place {
  margin: 0.3em 0.2em;
}

.math.block.bracket > .line {
  border: solid 1px currentColor;
  width: 0.3em;
}

.math.block.bracket > .line:first-child {
  border-right: none;
}

.math.block.bracket > .line:last-child {
  border-left: none;
}

.math.block.absolute > .line {
  background-color: currentColor;
  width: 1px;
}

.math.block.parenthesis > .line {
  border-radius: 50%;
  width: 0.7em;
}

.math.block.parenthesis > .line:first-child {
  border-left: solid 2px currentColor;
}

.math.block.parenthesis > .line:last-child {
  border-right: solid 2px currentColor;
}

.math.block.parenthesis > .place {
  margin: 0.3em 0;
}
</style>
