// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { App, P1CompletionItemProvider } from "./app";
import { ImportFixer } from "./import-fixer";
import { YnComponent } from "./YnComponent";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "元年 P1" is now active!');

  const WORD_REG: RegExp = /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/gi;

  let completionItemProvider = new P1CompletionItemProvider();
  let completion = vscode.languages.registerCompletionItemProvider(
    [
      {
        language: "vue",
        scheme: "file"
      },
      {
        language: "html",
        scheme: "file"
      }
    ],
    completionItemProvider,
    "",
    " ",
    ":",
    "<",
    '"',
    "'",
    "/",
    "@",
    "("
  );
  let importFixer = vscode.commands.registerCommand(
    "extension.fixImport",
    (document, position, token, tag, componentPath) => {
      if (document.languageId === "vue") {
        new ImportFixer().fix(document, position, token, tag, componentPath);
      }
    }
  );
  let terminal: vscode.Terminal = vscode.window.createTerminal("YN P1");
  terminal.sendText("clear");
  let addYnComponentCommand = vscode.commands.registerCommand(
    "extension.createYnComponent",
    (...args) => {
      new YnComponent().add(terminal, ...args);
    }
  );
  let vueLanguageConfig = vscode.languages.setLanguageConfiguration("vue", {
    wordPattern: WORD_REG
  });
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "extension.helloWorld",
  //   () => {
  //     // The code you place here will be executed every time your command is executed

  //     // Display a message box to the user
  //     vscode.window.showInformationMessage("Hello VS Code!");
  //   }
  // );

  context.subscriptions.push(
    importFixer,
    completion,
    vueLanguageConfig,
    addYnComponentCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
