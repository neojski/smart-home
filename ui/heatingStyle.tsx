export function heatingStyle(isOn: boolean) {
  if (isOn) {
    return { borderRadius: "30px", background: "#fff", color: "#000" };
  } else {
    return {};
  }
}
