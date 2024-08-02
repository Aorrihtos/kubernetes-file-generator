// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
    let showTemplates = vscode.commands.registerCommand('kubernetes-file-generator.showTemplates', async (uri) => {
        const options = ["Create Deployment", "Create Service", "Create ConfigMap"];
        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: "Select a Kubernetes template to create"
        });

        switch (selected) {
            case "Create Deployment":
                vscode.commands.executeCommand('kubernetes-file-generator.createDeployment', uri);
                break;
            case "Create Service":
                vscode.commands.executeCommand('kubernetes-file-generator.createService', uri);
                break;
            case "Create ConfigMap":
                vscode.commands.executeCommand('kubernetes-file-generator.createConfigMap', uri);
                break;
        }
    });

    let createDeployment = vscode.commands.registerCommand('kubernetes-file-generator.createDeployment', (uri) => {
        createKubernetesTemplate(uri, 'deployment.yaml', getDeploymentTemplate());
    });

    let createService = vscode.commands.registerCommand('kubernetes-file-generator.createService', (uri) => {
        createKubernetesTemplate(uri, 'service.yaml', getServiceTemplate());
    });

    let createConfigMap = vscode.commands.registerCommand('kubernetes-file-generator.createConfigMap', (uri) => {
        createKubernetesTemplate(uri, 'configmap.yaml', getConfigMapTemplate());
    });

    context.subscriptions.push(showTemplates, createDeployment, createService, createConfigMap);
}


function createKubernetesTemplate(uri, filename, content) {
    const dirPath = uri.fsPath;
    const filePath = path.join(dirPath, filename);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            vscode.window.showErrorMessage(`Failed to create ${filename}: ${err.message}`);
            return;
        }
        vscode.window.showInformationMessage(`${filename} created successfully!`);
        vscode.workspace.openTextDocument(filePath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
}

function getDeploymentTemplate() {
    return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx
        ports:
        - containerPort: 80
`;
}

function getServiceTemplate() {
    return `apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
`;
}

function getConfigMapTemplate() {
    return `apiVersion: v1
kind: ConfigMap
metadata:
  name: my-configmap
data:
  key: value
`;
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
