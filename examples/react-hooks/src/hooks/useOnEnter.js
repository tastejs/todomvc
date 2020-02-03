import { useCallback } from "react";

export default function useOnEnter(callback, inputs) {
  return useCallback(event => {
    if (event.key === "Enter") {
      event.preventDefault();
      callback(event);
    }
  }, inputs);
}
