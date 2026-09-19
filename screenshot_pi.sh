#!/bin/bash
set -e -u -o pipefail

out="${1:-/tmp/mirror.png}"

# The ssh session lands on a tty with no Wayland context, so grim has to be
# pointed at the compositor explicitly. The socket is wayland-1 today, but the
# number changes if wayfire restarts, so look it up rather than hardcoding it.
# scrot is no use here: under Wayland it only sees XWayland's root window.
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT

ssh pi '
  export XDG_RUNTIME_DIR=/run/user/1000
  export WAYLAND_DISPLAY=$(basename "$(ls "$XDG_RUNTIME_DIR"/wayland-[0-9] | head -1)")
  grim -
' > "$tmp"

# Only clobber the previous screenshot once we know we got one.
mv "$tmp" "$out"
trap - EXIT

echo "Screenshot saved to $out"

# Don't fail the script over the viewer; the screenshot is already safe on disk.
xdg-open "$out" >/dev/null 2>&1 || echo "Could not open $out automatically"
