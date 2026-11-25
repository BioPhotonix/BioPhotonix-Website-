"use client";

import PhotonField from "./PhotonField";
import { EYEPIECES } from "./RevoluxDevice";

/**
 * The photon field for a hero that shows the Revolux device: photons drift in
 * from all round and converge between the device's eyepieces.
 *
 * Place it directly inside the hero's section, as a sibling of the content.
 * It finds the device in that same section by its class, so the landing page
 * (a client component) and the technology page (rendered on the server) use
 * it the same way, and the eyepiece position stays in one place: measured in
 * RevoluxDevice, read here.
 */
export default function DevicePhotons({ className = "" }: { className?: string }) {
  return <PhotonField className={className} focus={{ selector: ".vt-device", ...EYEPIECES }} />;
}
