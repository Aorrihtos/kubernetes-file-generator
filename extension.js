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
    (uri) => {
      createKubernetesTemplate(uri, "deployment.yaml", getTemplateContent("deployment"));
    }
  );

  let createService = vscode.commands.registerCommand(
    "kubernetes-file-generator.createService",
    (uri) => {
      createKubernetesTemplate(uri, "service.yaml", getTemplateContent("service"));
    }
  );

  let createConfigMap = vscode.commands.registerCommand(
    "kubernetes-file-generator.createConfigMap",
    (uri) => {
      createKubernetesTemplate(uri, "configmap.yaml", getTemplateContent("configmap"));
    }
  );

  context.subscriptions.push(createDeployment, createService, createConfigMap);
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

function getTemplateContent(name){
  return fs.readFileSync(`${__dirname}/kubernetes-templates/${name}.yaml`, 'utf-8');
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
