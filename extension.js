// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

  let createDeployment = vscode.commands.registerCommand(
    "kubernetes-file-generator.createDeployment",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-deployment.yaml`, getTemplateContent("deployment", name));
    }
  );

  let createService = vscode.commands.registerCommand(
    "kubernetes-file-generator.createService",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-service.yaml`, getTemplateContent("service", name));
    }
  );

  let createConfigMap = vscode.commands.registerCommand(
    "kubernetes-file-generator.createConfigMap",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-configmap.yaml`, getTemplateContent("configmap", name));
    }
  );

  let createCronjob = vscode.commands.registerCommand(
    "kubernetes-file-generator.cronJob",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-cronjob.yaml`, getTemplateContent("cronjob", name));
    }
  );

  let createDaemonSet = vscode.commands.registerCommand(
    "kubernetes-file-generator.daemonSet",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-daemonset.yaml`, getTemplateContent("daemonset", name));
    }
  );

  let createHorizontalPodAutoescaller = vscode.commands.registerCommand(
    "kubernetes-file-generator.horizontalPodAutoescaller",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-horizontalpodautoescaller.yaml`, getTemplateContent("horizontalpodautoescaller", name));
    }
  );

  let createIngress = vscode.commands.registerCommand(
    "kubernetes-file-generator.ingress",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-ingress.yaml`, getTemplateContent("ingress", name));
    }
  );

  let createPersistentVolume = vscode.commands.registerCommand(
    "kubernetes-file-generator.persistentVolume",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-persistentvolume.yaml`, getTemplateContent("persistentvolume", name));
    }
  );

  let createPersistentVolumeClaim = vscode.commands.registerCommand(
    "kubernetes-file-generator.persistentVolumeClaim",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-persistentvolumeclaim.yaml`, getTemplateContent("persistentvolumeclaim", name));
    }
  );

  let createSecret = vscode.commands.registerCommand(
    "kubernetes-file-generator.secret",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-secret.yaml`, getTemplateContent("secret", name));
    }
  );

  let createStatefulSet = vscode.commands.registerCommand(
    "kubernetes-file-generator.statefulSet",
    async (uri) => {
      const name = await getComponentName();
      createKubernetesTemplate(uri, `${name}-statefulset.yaml`, getTemplateContent("statefulset", name));
    }
  );

  context.subscriptions.push(
    createDeployment, createService, createConfigMap, 
    createCronjob, createDaemonSet, createHorizontalPodAutoescaller, 
    createIngress, createPersistentVolume, createPersistentVolumeClaim, 
    createSecret, createStatefulSet
  );
}

function createKubernetesTemplate(uri, filename, content) {
  const dirPath = uri.fsPath;
  const filePath = path.join(dirPath, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      vscode.window.showErrorMessage(
        `Failed to create ${filename}: ${err.message}`
      );
      return;
    }
    vscode.window.showInformationMessage(`${filename} created successfully!`);
    vscode.workspace.openTextDocument(filePath).then((doc) => {
      vscode.window.showTextDocument(doc);
    });
  });
}

function getTemplateContent(component, name){
  return fs.readFileSync(`${__dirname}/kubernetes-templates/${component}.yaml`, 'utf-8')
          .replace("<name>", name);
}

async function getComponentName(){
  const userInput = await vscode.window.showInputBox({
    placeHolder: "Enter the name of the component",
    prompt: "Please provide the required information",
  });
  
  let name="";

  if(userInput != undefined){
    name = userInput;
  }

  return name;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
