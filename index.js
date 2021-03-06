const fs = require("fs")
const path = require('path')

const ROOT = __dirname

class Node {
  constructor(name, key, children) {
    this.name = name
    this.key = key
    this.children = children || []
  }

  read() {
    const filePath = path.join(ROOT, this.key)
    const data = fs.readFileSync(filePath)

    return data
  }
}

class Memo {
  tree(key = "") {
    const nodeName = key == "" ? "*root" : key
    const nodeChildren = []

    fs.readdirSync(path.join(ROOT, key)).forEach((fileName) => {
      if (this.isNotMemo(fileName)) { return }

      const fileKey = path.join(key, fileName)
      const stat = fs.statSync(path.join(ROOT, fileKey))

      if (stat.isDirectory()) {
        nodeChildren.push(this.tree(fileKey))
      } else {
        nodeChildren.push(new Node(fileName, fileKey))
      }
    })
    return new Node(nodeName, key, nodeChildren)
  }

  isNotMemo(fileName) {
    return fileName.startsWith(".") ||
      fileName == 'index.js' ||
      fileName == 'package.json'
  }

  test() {
    const tree = this.tree()
    const node = tree.children.find((node) => node.key == "README.md")

    console.dir(tree, { depth: 6 })
    console.dir(node.read().toString())
  }
}

module.exports = new Memo()
