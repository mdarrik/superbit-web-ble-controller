import { GattServiceCharacteristicIds } from "./superbit-constants.js";

const armControlsSection = document.querySelector(
  '[data-section="arm-controls"]'
);

let debounceTimer;

export function registerCatapultArmControls() {
  armControlsSection.addEventListener("click", async (event) => {
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
    let armService = globalThis.armService;
    if (!armService) {
      armService = await superbitGattService.getCharacteristic(
        GattServiceCharacteristicIds.armService
      );
      globalThis.armService = armService;
    }
    globalThis.bleWriteInProgress = true;
    const armCommand = buttonClicked.dataset.command;
    console.log(armCommand, debounceTimer);
    if (armCommand === "fire" && !debounceTimer) {
      await armService.writeValueWithoutResponse(Uint8Array.of(1));
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
      }, 80);
      console.log("here", Uint8Array.of(1), armService);
    } else if (armCommand === "reset" && !debounceTimer) {
      await armService.writeValueWithoutResponse(Uint8Array.of(0));
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
      }, 80);
    }
    globalThis.bleWriteInProgress = false;
  });
}
