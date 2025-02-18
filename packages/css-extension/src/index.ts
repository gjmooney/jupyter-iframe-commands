import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyter-css-loader extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-css-loader:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter-css-loader is activated!');
    const { commands } = app;

    commands.addCommand('jupyter-import-css', {
      execute: args => {
        console.log('args', args);
        console.log("args['parsedCSS']", args['parsedCSS']);
        console.log('args string', JSON.stringify(args));
        // const { style } = args;
        const styleTag = document.createElement('style');
        styleTag.id = 'searchText';

        styleTag.innerText = args['parsedCSS'] as string;
        document.head.appendChild(styleTag);
      }
    });
  }
};

export default plugin;
