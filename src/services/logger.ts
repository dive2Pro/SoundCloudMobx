export function logInfo(title: any, ...messages: any[]) {
  title = '😘 ' + title + ' 😘' || '😘';
  console.group(title);
  messages.forEach(m => {
    console.info(m);
    console.log('--------------------------');
  });

  console.groupEnd();
}
export function logError(title: string, ...messages: any[]) {
  title = '😘 ' + title + ' 😘' || '😘';
  console.group(title);
  messages.forEach(m => {
    console.error(m);
    console.log('--------------------------');
  });

  console.groupEnd();
}
