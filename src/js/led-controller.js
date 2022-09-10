import { GattServiceCharacteristicIds } from "./superbit-constants.js";

const colorControlsSection = document.querySelector('[data-section="colors"]');

let debounceTimer;

export function registerLedControls() {
  colorControlsSection.addEventListener("click", async (event) => {
    /**@type {BluetoothDevice} */
    const superbitDevice = globalThis.superbitDevice;
    /**@type {BluetoothRemoteGATTService} */
    const superbitGattService = globalThis.superbitGattService;
    /**@type {HTMLButtonElement} */
    const buttonClicked = event.target.closest("button");
    if (
      !superbitDevice ||
      !superbitDevice.gatt.connected ||
      !superbitGattService ||
      !buttonClicked ||
      globalThis.bleWriteInProgress
    ) {
      return;
    }
    /**@type {BluetoothRemoteGATTCharacteristic} */
    let ledService = globalThis.ledService;
    if (!ledService) {
      ledService = await superbitGattService.getCharacteristic(
        GattServiceCharacteristicIds.ledService
      );
      globalThis.ledService = ledService;
    }
    globalThis.bleWriteInProgress = true;
    const colorPositionToWrite = Number(buttonClicked.dataset.colorPosition);
    if (Number.isSafeInteger(colorPositionToWrite) && !debounceTimer) {
      await ledService.writeValueWithoutResponse(
        Uint8Array.of(colorPositionToWrite)
      );
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
      }, 80);
    }
    globalThis.bleWriteInProgress = false;
  });
}
