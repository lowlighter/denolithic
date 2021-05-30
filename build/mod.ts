//Imports
import { createPublicDirectory, templateIndexHTML, copyStaticAssets } from "./setup.ts"

//Entry point
if (import.meta.main) {
  await createPublicDirectory()
  await templateIndexHTML()
  await copyStaticAssets()
}