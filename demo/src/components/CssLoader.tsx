interface ICssLoaderProps {
  submitCommand: (command: string, args: string) => void;
}

const CssLoader = ({ submitCommand }: ICssLoaderProps) => {
  const handleSubmit = () => {
    const command = 'jupyter-import-css';
    // from MDN
    const getAllCss = [...document.styleSheets]
      .map(styleSheet => {
        try {
          return [...styleSheet.cssRules].map(rule => rule.cssText).join('');
        } catch (e) {
          console.log(
            'Access to stylesheet %s is denied. Ignoring…',
            styleSheet.href
          );
        }
      })
      .filter(Boolean)
      .join('\n');

    const parsedCSS = getAllCss.replace(/'/g, '"');

    submitCommand(command, JSON.stringify({ parsedCSS }));
  };

  return (
    <div>
      <button className="demo-button" onClick={handleSubmit}>
        Load CSS
      </button>
    </div>
  );
};

export default CssLoader;
