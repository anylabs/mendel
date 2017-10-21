export default class Logger {
  current: Date | null

  start(text: string) {
    console.log("-----> " + text)
    this.current = new Date()
  }

  log(text: string, ...args: any[]) {
    console.log("       " + text, ...args)
  }

  complete() {
    if (!this.current) {
      return
    }

    console.log(
      `       Done in ${new Date().getTime() - this.current.getTime()}ms\n`,
    )

    this.current = null
  }
}
