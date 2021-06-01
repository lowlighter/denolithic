//Imports
import { createPublicDirectory, bundleClientApp, templateIndexHTML, copyStaticAssets } from "./setup.ts"

//Entry point
if (import.meta.main) {
  await createPublicDirectory()
  await bundleClientApp()
  await templateIndexHTML()
  await copyStaticAssets()
}