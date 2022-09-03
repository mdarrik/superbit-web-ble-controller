/**@typedef {import('@types/web-bluetooth')} */
/**@typedef {globalThis & {superbitDevice: BluetoothDevice}} extendedGlobalThis */
import {
  SuperbitGattServiceUuid,
  GattServiceCharacteristicIds,
} from "./superbit-constants.js";
import { registerMovementController } from "./movement-controller.js";

const mainElement = document.getElementsByTagName("main")[0];

async function connectBluetoothDevice() {
  try {
    if (!navigator.bluetooth) {
      showUnsupportedBrowserWarning();
      return;
    }
    const bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ name: "SuperBit" }],
      optionalServices: [SuperbitGattServiceUuid],
    });
    globalThis.superbitDevice = bluetoothDevice;
    bluetoothDevice.addEventListener(
      "gattserverdisconnected",
      handleBluetoothDisconnected
    );
    const server = await bluetoothDevice.gatt.connect();
    if (server.connected) {
      mainElement.dataset.bluetoothConnected = "";
      document
        .getElementById("disconnect-bluetooth-button")
        .addEventListener("click", async () => {
          if (bluetoothDevice && bluetoothDevice.gatt.connected) {
            bluetoothDevice.gatt.disconnect();
          }
        });
      let superbitGattService = await server.getPrimaryService(
        SuperbitGattServiceUuid
      );
      globalThis.superbitGattService = superbitGattService;
    }
  } catch (e) {
    console.log(JSON.stringify(e, Object.getOwnPropertyNames(e)));
    await fetch("./.netlify/functions/log-errors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    });
  }
}

document
  .getElementById("connect-bluetooth-button")
  .addEventListener("click", connectBluetoothDevice);

registerMovementController();

function showUnsupportedBrowserWarning() {
  const unsupportedBrowserWarningElement = document.getElementById(
    "unsupported-browser-warning"
  );
  unsupportedBrowserWarningElement.dataset.warningShow = "";
}

async function handleBluetoothDisconnected() {
  delete mainElement.dataset.bluetoothConnected;
  try {
    // can only forget if experimental web platform is set in chrome/edge/etc
    await globalThis.superbitDevice.forget();
  } catch {}
  globalThis.superbitDevice = null;
  globalThis.superbitGattService = null;
}
