export default function useDoubleClick(onClick, onDoubleClick) {
  let clicks = [];
  let timeout;

  return (event, ...rest) => {
    clicks.push(new Date().getTime());

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (
        clicks.length > 1 &&
        clicks[clicks.length - 1] - clicks[clicks.length - 2] < 250
      ) {
        if (onDoubleClick) {
          onDoubleClick(event, ...rest);
        }
      } else if (onClick) {
        onClick(event, ...rest);
      }
      clicks = [];
    }, 250);
  };
}
