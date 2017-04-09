export const RaceFetch = (p: string, method?: object, time?: number) => {

  return new Promise((res, rej) => {
    const timeoutPromise = new Promise((timeRes, timeRej) => {
      setTimeout(
        () => {
          timeRej({
            type: 'TimeOut',
            msg: '请求超时'
          })
        },
        time || 1000 * 5)
    })
    const pfetch = fetch(p, method)
    Promise.race([pfetch, timeoutPromise])
      .then(
      (data: any) => {
        res(data.json())
      },
      err => {
        rej(err)
      })
  })
}

