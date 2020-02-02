export default function() {
  return new Date().toISOString(); // socket IO doesn't support Date so we have to send string
}
