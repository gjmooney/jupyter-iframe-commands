const JupyterIframe = () => {
  return (
    <iframe
      id="jupyterlab"
      src={import.meta.env.VITE_DEMO_SRC}
      sandbox="allow-scripts allow-same-origin"
      title="JupyterLab Instance"
      loading="lazy"
    ></iframe>
  );
};

export default JupyterIframe;
