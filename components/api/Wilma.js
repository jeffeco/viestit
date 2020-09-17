const request = require('request')

var cJar = request.jar()
var Cookie = require('request-cookies').Cookie

var Days = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
  properties: {
    1: { name: 'Monday', value: 1, code: 'Mon' },
    2: { name: 'Tuesday', value: 2, code: 'Tue' },
    3: { name: 'Wednesday', value: 3, code: 'Wed' },
    4: { name: 'Thursday', value: 4, code: 'Thu' },
    5: { name: 'Friday', value: 5, code: 'Fri' },
    6: { name: 'Saturday', value: 6, code: 'Sat' },
    0: { name: 'Sunday', value: 7, code: 'Sun' }
  }
}
/** Gets the SID */
function GetSID() {
  return new Promise((resolve, reject) => {
    try {
      request(
        { url: 'https://kangasala.inschool.fi/', method: 'GET' },
        (error, res, body) => {
          if (error) return reject(error)
          let hiddenInput = ''
          const splitResults = body.split('\n')
          // Search session id
          for (var i = 0; i < splitResults.length; i++) {
            if (
              splitResults[i].includes('<input type="hidden" name="SESSIONID"')
            ) {
              hiddenInput = splitResults[i]
              break
            }
          }
          // extract SESSIONID from html
          hiddenInput = hiddenInput.trim()
          const index = hiddenInput.indexOf('"', hiddenInput.search('value'))

          resolve(
            hiddenInput.slice(index + 1, hiddenInput.indexOf('"', index + 1))
          )
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
/** Login to wilma and returns a SID */
exports.LoginWilma = async function(username, password) {
  return new Promise(async (resolve, reject) => {
    var SESSIONID = await GetSID().catch(err => reject(err))
    // initialize postOptions wich will be sent to wilma
    const postOptions = {
      url: 'https://kangasala.inschool.fi/login',
      headers: 'Wilma2LoginID=' + SESSIONID,
      method: 'POST',
      jar: cJar,
      formData: {
        Login: username,
        Password: password,
        submit: 'Kirjaudu sisään',
        SESSIONID: SESSIONID
      }
    }
    // send the request
    try {
      request(postOptions, (error, res, body) => {
        if (error) return reject(error)

        var cookie = new Cookie(cJar.getCookies(postOptions.url)[0])
        resolve(cookie.toJSON().value)
      })
    } catch (err) {
      reject(err)
    }
  })
}
/** Get all messages and return a JSON of the messages */
exports.GetMessages = function(SID) {
  return new Promise((resolve, reject) => {
    try {
      const postOptions = {
        url: 'https://kangasala.inschool.fi/messages/list',
        headers: {
          Cookie: 'Wilma2SID=' + SID
        },
        method: 'GET'
      }
      // Make a request
      request(postOptions, (error, res, body) => {
        if (error) return reject(error)

        // eslint-disable-next-line prefer-promise-reject-errors
        if (body.includes('<!DOCTYPE html>')) return reject('Session overlap')

        resolve(JSON.parse(body))
      })
    } catch (err) {
      reject(err)
    }
  })
}
/** Gets the whole schedule of the month and returns a JSON of the schedule */
exports.GetSchedule = function(SID) {
  return new Promise((resolve, reject) => {
    const postOptions = {
      url: 'https://kangasala.inschool.fi/overview',
      headers: {
        Cookie: 'Wilma2SID=' + SID
      },
      method: 'GET'
    }
    request(postOptions, (error, res, body) => {
      if (error) return reject(error)

      resolve(JSON.parse(body))
    })
  })
}

/** Get the content of a message and returns the message information in a nice JSON format */
exports.GetMessageBody = function(messageID, SID) {
  return new Promise((resolve, reject) => {
    try {
      const postOptions = {
        url:
          'https://kangasala.inschool.fi/messages/' +
          messageID +
          '?recipients',
        headers: {
          Cookie: 'Wilma2SID=' + SID
        },
        method: 'GET'
      }
      request(postOptions, (error, res, body) => {
        if (error) return reject(error)

        var text = body
        var start = text.search('<!-- Sivukohtainen alue alkaa -->')
        var end = text.search(' <!-- Sivukohtainen alue loppuu -->')
        text = text.slice(start + 34, end)

        var result = {
          title: text.slice(text.search('<h1>') + 4, text.search('</h1>')),
          sender: text
            .slice(
              text.indexOf('">', text.search('</th>')) + 2,
              text.indexOf('</div>', text.search('<th>Lähettäjä: </th>'))
            )
            .trim(),
          recipients: [],
          info: {
            replies: Number(
              text.slice(
                text.search('vastausta') - 2,
                text.search('vastausta') - 1
              )
            ),
            date: text.slice(
              text.indexOf('<td>', text.search('<th>Lähetetty: </th>')) + 4,
              text.indexOf(
                '<',
                text.indexOf('<td>', text.search('<th>Lähetetty: </th>')) + 4
              )
            )
          },
          mainMessageBody: text.slice(
            text.indexOf('class="ckeditor') + 24,
            text.indexOf('</div>', text.indexOf('class="ckeditor') + 24)
          ),
          replies: []
        }

        // Gets the date
        result.info.date = result.info.date.replace(' klo ', '-')
        result.info.date = result.info.date.replace('.', '-')
        result.info.date = result.info.date.replace('.', '-')
        result.info.date = result.info.date.replace(':', '-')

        if (
          Number(result.info.date.slice(0, result.info.date.indexOf('-'))) < 10
        ) {
          result.info.date.replace(
            result.info.date.slice(0, result.info.date.indexOf('-')),
            '0' + result.info.date.slice(0, result.info.date.indexOf('-'))
          )
        }

        if (
          Number(result.info.date.slice(3, result.info.date.indexOf('-', 3))) <
          10
        ) {
          result.info.date = result.info.date.replace(
            result.info.date.slice(3, result.info.date.indexOf('-', 3)),
            '0' + result.info.date.slice(3, result.info.date.indexOf('-', 3))
          )
        }
        var dates = result.info.date.split('-')
        result.info.date = new Date(
          dates[2],
          dates[1],
          dates[0],
          dates[3],
          dates[4]
        )

        // Fixing the sender if it is a teacher

        if (result.sender.includes('</a>')) {
          result.sender = result.sender.slice(
            result.sender.indexOf('>') + 1,
            result.sender.indexOf('</a>')
          )
        }

        // Get the recipients
        var recipientsCell = text.slice(
          text.indexOf('<a', text.indexOf('recipients-cell')),
          text.indexOf(
            '\n',
            text.indexOf('<a', text.indexOf('id="recipients-cell"'))
          )
        )

        if (recipientsCell.trim() == '')
          result.recipients.push({ name: 'Piilotettu' })
        else {
          recipientsCell = recipientsCell.replace(/\r/g, '')
          recipientsCell = recipientsCell.replace(/, /g, '')
          recipientsCell = recipientsCell.trim()
          recipientsCell = recipientsCell.split('</a>')
          for (let i = 0; i < recipientsCell.length; i++) {
            const recipient = recipientsCell[i].slice(
              recipientsCell[i].indexOf('>') + 1
            )
            if (recipientsCell[i].trim() != '')
              result.recipients.push({ name: recipient })
          }
        }

        // Get the reply bodies

        // var numberOfReplies = text.match(/m-replybox /g).length

        // for (let i = 0; i < numberOfReplies; i++) {
        //   const reply = text.slice(
        //     text.indexOf('<div class="m-replybox '),
        //     text.indexOf('</div>', text.indexOf('<div class="m-replybox'))
        //   )
        //   text = text.replace(reply, '')
        //   // Get the name of the replier
        //   let name = reply.slice(
        //     reply.indexOf('>', reply.indexOf('<h2')) + 1,
        //     reply.indexOf('</h2>')
        //   )
        //   if (name.includes('<a href')) {
        //     name = name.slice(name.indexOf('>') + 1, name.indexOf('</'))
        //   } else {
        //     name = 'Sinä'
        //   }
        //   // Get the reply body
        //   const body = reply.slice(
        //     reply.indexOf('>', reply.indexOf('<div class="inner hidden"')) + 1,
        //     reply.indexOf('</div>')
        //   )

        //   // push the replies to the result
        //   result.replies.push({ name: name, messageContent: body })
        // }

        resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}
