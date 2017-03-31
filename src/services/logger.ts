export function logInfo(title: any, ...messages: any[]) {
  title = '😘 ' + title + ' 😘' || '😘'
  console.group(title)
  messages.forEach(m => {
    console.info(m)
    console.log('--------------------------')
  })

  console.groupEnd()
}