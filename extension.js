const vscode = require("vscode");

const getWebViewContent = async () => {
  const fs = await import("fs");
  const path = await import("path");
  return fs.readFileSync(path.join(__dirname, "./app/index.html"), {
    encoding: "utf8",
    flag: "r",
  });
};

function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

class PanelProvider {
  viewType = "webLLM.panelView";
  webviewView = null;
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }
  setCode(text) {
    this.webviewView.webview.postMessage({ type: 'code', data: text });
  }
  async resolveWebviewView(webviewView) {
    this.webviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = await getWebViewContent();
  }
}

// This method is called when your extension is deactivated
function deactivate() {}

function activate(context) {
  const provider = new PanelProvider(context.extensionUri);

  const handleEditorSelection = debounce(() => {
    const editor = vscode.window.activeTextEditor;
    const selectedText = editor.document.getText(editor.selection);
    provider.setCode(selectedText);
  }, 500);

  vscode.window.onDidChangeTextEditorSelection(handleEditorSelection);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(provider.viewType, provider)
  );
}

module.exports = {
  activate,
  deactivate,
};
