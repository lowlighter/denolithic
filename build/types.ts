/** Configuration type */
export type configuration = {

  /** Organization name */
  name?:string

  /** Opengraph metadata */
  opengraph?:{[key:string]:string}

  /** List of additional styles to add */
  styles?:string[]

  /** List of additional scripts to add */
  scripts?:string[]

  /** List of additional plugins to add */
  plugins?:string[]

}

