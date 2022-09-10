import { GattServiceCharacteristicIds } from "./superbit-constants.js";

const movementController = document.getElementsByClassName(
  "movement-controller"
)[0];

const movementMap = {
  forward: Uint8Array.of(0),
  left: Uint8Array.of(1),
  right: Uint8Array.of(2),
  backwards: Uint8Array.of(3),
};

export function registerMovementController() {
  let mousedownInterval = null;
  let mousedownInProgress = false;
  movementController.addEventListener("touchstart", (event) => {
    if (!mousedownInProgress) {
      handleButtonActivation(event);
      mousedownInterval = setInterval(() => handleButtonActivation(event), 80);
      mousedownInProgress = true;
    }
  });
  movementController.addEventListener("touchend", () => {
    clearInterval(mousedownInterval);
    mousedownInterval = null;
    mousedownInProgress = false;
  });
  movementController.addEventListener("click", handleButtonActivation);
}

const debounceInfo = { timer: null };
async function handleButtonActivation(event) {
  /**@type {BluetoothDevice} */
  const superbitDevice = globalThis.superbitDevice;
  /**@type {BluetoothRemoteGATTService} */
  const superbitGattService = globalThis.superbitGattService;
  /**@type {HTMLButtonElement} */
  const buttonClicked = event.target.closest("button");
  const directionToMove = buttonClicked.dataset.direction;
  const directionWriteData = movementMap[directionToMove];
  if (
    !superbitDevice ||
    !superbitDevice.gatt.connected ||
    !superbitGattService ||
    !buttonClicked ||
    !directionWriteData ||
    globalThis.bleWriteInProgress
  ) {
    return;
  }
  /**@type {BluetoothRemoteGATTCharacteristic} */
  let directionService = globalThis.directionService;
  if (!directionService) {
    directionService = await superbitGattService.getCharacteristic(
      GattServiceCharacteristicIds.directionService
    );
    globalThis.directionService = directionService;
  }
  globalThis.bleWriteInProgress = true;
  if (directionWriteData && !debounceInfo.timer) {
    clearTimeout(debounceInfo.timer);
    await directionService.writeValueWithoutResponse(directionWriteData);
    debounceInfo.timer = setTimeout(() => {
      debounceInfo.timer = null;
      debounceInfo.direction = null;
    }, 200);
  }
  globalThis.bleWriteInProgress = false;
}
