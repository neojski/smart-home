#!/usr/bin/env python3
"""Move a virtual mouse so chromium hides the cursor.

Wayfire draws the pointer, and chromium only applies the page's `cursor: none`
once it has seen a pointer event. After a kiosk restart nothing has moved the
mouse, so the desktop arrow stays on the screen until something does. There is
no mouse to move by hand, so make one: /dev/uinput gives us a virtual device,
and a one pixel jiggle is enough. Needs root, hence the sudo in start_chromium.
"""

import fcntl
import struct
import time

# linux/uinput.h
UI_SET_EVBIT = 0x40045564
UI_SET_KEYBIT = 0x40045565
UI_SET_RELBIT = 0x40045566
UI_DEV_CREATE = 0x5501
UI_DEV_DESTROY = 0x5502

# linux/input-event-codes.h
EV_SYN, EV_KEY, EV_REL = 0x00, 0x01, 0x02
SYN_REPORT, REL_X, REL_Y, BTN_LEFT = 0x00, 0x00, 0x01, 0x110

# Chromium takes a few seconds to put its window up, and a nudge that lands
# before then is wasted: the arrow comes back with the window. So keep trying.
NUDGE_AFTER_SECONDS = (5, 10, 20)

uinput = open("/dev/uinput", "wb", buffering=0)

# udev only tags a device ID_INPUT_MOUSE, and libinput only picks it up, when it
# has both relative axes and a button, so declare all three.
for request, value in (
    (UI_SET_EVBIT, EV_REL),
    (UI_SET_RELBIT, REL_X),
    (UI_SET_RELBIT, REL_Y),
    (UI_SET_EVBIT, EV_KEY),
    (UI_SET_KEYBIT, BTN_LEFT),
):
    fcntl.ioctl(uinput, request, value)

# struct uinput_user_dev: name, bus/vendor/product/version, ff_effects_max, then
# four absolute axis tables a mouse has no use for.
device = struct.pack("80sHHHHi", b"smart-home-nudge", 0x03, 0x1234, 0x5678, 1, 0)
uinput.write(device + bytes(4 * 64 * 4))
fcntl.ioctl(uinput, UI_DEV_CREATE)


def emit(type_, code, value):
    uinput.write(struct.pack("@llHHi", 0, 0, type_, code, value))


elapsed = 0
for delay in NUDGE_AFTER_SECONDS:
    time.sleep(delay - elapsed)
    elapsed = delay
    for dx in (1, -1):  # out and back, so the pointer ends up where it started
        emit(EV_REL, REL_X, dx)
        emit(EV_SYN, SYN_REPORT, 0)
        time.sleep(0.2)

fcntl.ioctl(uinput, UI_DEV_DESTROY)
uinput.close()
