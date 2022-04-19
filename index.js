const fs = require("fs")
const ROOT = __dirname

class Node {
  constructor(name, key, children) {
    this.name = name
    this.key = key
    this.children = children || []
  }

  read() {
    const path = `${ROOT}/${this.key}`
    const data = fs.readFileSync(path)

    return data
  }
}

class Memo {
  tree(key = "") {
    const nodeName = key == "" ? "*root" : key
    const nodeChildren = []

    fs.readdirSync(`${ROOT}/${key}`).forEach((fileName) => {
      const fileKey = `${key}/${fileName}`
      const stat = fs.statSync(`${ROOT}/${fileKey}`)

      if (fileName.startsWith(".")) {
        // . で始まるファイルは無視する
      } else if (stat.isDirectory()) {
        nodeChildren.push(new Node(fileName, fileKey, this.tree(fileKey)))
      } else {
        nodeChildren.push(new Node(fileName, fileKey))
      }
    })
    return new Node(nodeName, key, nodeChildren)
  }

  test() {
    const tree = this.tree()
    const node = tree.children.find((node) => node.key == "/README.md")

    console.dir(tree, { depth: 6 })
    console.dir(node.read().toString())
  }
}

(new Memo()).test()

module.exports = new Memo()
