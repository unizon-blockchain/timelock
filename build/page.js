const fs = require('fs')
const nodePath = require('path')
const color = require('colors')

const stat = fs.stat;

console.log('根路径：', process.env.INIT_CWD)

function pathResolve(path) {
  return nodePath.resolve(__dirname, path)
}

function wrapPromise(fn) {
  return new Promise((resolve, reject) => {
    fn(resolve, reject)
  })
}

function firstToUpperCase(str) {
  return str.replace(str[0], str[0].toUpperCase())
}

const options = process.argv.splice(2)
const targetPath = options[0]


console.log(`\nCreate file: ${targetPath}\n`.green)

const modulePath = '../build/module'
const outputPath = '../pages'

let moduleFile = {
  vue: `${modulePath}\\vue.txt`,
  ts: `${modulePath}\\ts.txt`,
  scss: `${modulePath}\\scss.txt`
}

// yarn p user/login

const targetPathSplit = targetPath.split('/')

const fileNamePrefix = outputPath + '/' + (targetPath.indexOf('/') > -1 ? targetPath.substring(0, targetPath.lastIndexOf("/")) : targetPath)
const filename = targetPathSplit.length > 0 ? targetPathSplit[targetPathSplit.length - 1] : targetPath

const outputFile = {
  vue: `${outputPath}\\${targetPath}.vue`,
  ts: `${outputPath}\\${targetPath}.ts`,
  scss: `${outputPath}\\${targetPath}.scss`
}

/**
 * 替换 vue 模板内容
 * @param {*} data 
 */
function replaceVue(content) {
  content = content.replace(/#path#/g, filename)
  return content
}

/**
 * 替换模板 ts 内容
 * @param {*} data 
 */
function replaceTs(content) {
  content = content.replace(/#component#/g, firstToUpperCase(filename))
  return content
}

/**
 * 文件是否已存在
 * @param {*} output 
 */
async function exists(output) {
  return await wrapPromise(resolve => {
    //测试某个路径下文件是否存在
    fs.exists(pathResolve(output), function (exists) {
      if (exists) {//存在
        resolve(true)
      } else {//不存在
        resolve(false)
      }
    })
  })
}

/**
 * 创建文件夹
 * @param {*} path 
 */
async function createDir(path) {
  return await wrapPromise(resolve => {
    fs.mkdir(path, { recursive: true }, (err) => {//创建目录
      if (err) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

/**
 * 读取文件内容
 * @param {*} path 
 */
async function readFile(path) {
  return await wrapPromise(resolve => {
    fs.readFile(nodePath.join(__dirname, path), 'utf8', (err, data) => {
      if (err) { resolve(null) }
      resolve(data)
    })
  })
}

/**
 * 创建并写入文件
 * @param {*} path 
 * @param {*} data 
 */
async function writeFile(path, data) {
  return await wrapPromise(resolve => {
    fs.writeFile(nodePath.join(__dirname, path), data, 'utf8', (err) => {
      if (err) return false;
      resolve(true)
    })
  })
}

/**
 * 是否存在原文件，true: 替换模板文件路径为已存在文件路径
 */
async function isExistsOriginalFile() {
  const isVueExists = await exists(outputFile.vue)
  moduleFile.vue = isVueExists ? outputFile.vue : moduleFile.vue
  const isTsExists = await exists(outputFile.ts)
  moduleFile.ts = isTsExists ? outputFile.ts : moduleFile.ts
  const isScssExists = await exists(outputFile.scss)
  moduleFile.scss = isScssExists ? outputFile.scss : moduleFile.scss
}

/**
 * 数据读取并生成文件
 */
async function generateFile() {
  await isExistsOriginalFile()
  let vuePath = moduleFile.vue
  const tsPath = moduleFile.ts
  const scssPath = moduleFile.scss

  const vueData = await readFile(vuePath)
  vueData && await writeFile(outputFile.vue, replaceVue(vueData))
  const tsData = await readFile(tsPath)
  tsData && await writeFile(outputFile.ts, replaceTs(tsData))
  const scssData = await readFile(scssPath)
  scssData && await writeFile(outputFile.scss, scssData)

  return true
}

/**
 * 初始化
 */
async function initialize() {
  const filePath = pathResolve(`${fileNamePrefix}`)

  const isExists = await exists(filePath)
  if (!isExists) {
    await createDir(filePath)
  }
  await generateFile()

  console.log('√ Generated Successful!'.green)
}

initialize()