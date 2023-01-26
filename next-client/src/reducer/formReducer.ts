import React from "react";

export default function formReducer(
  state: any,
  event: React.FormEvent<EventTarget>
) {
  const target = event.target as HTMLInputElement;
  return {
    ...state,
    [target.name]: target.value,
  };
}
