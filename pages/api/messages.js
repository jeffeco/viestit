import wilma from '../../components/api/Wilma'

const Messages = async (req, res) => {
  const {
    query: { SID }
  } = req

  if (SID) {
    const messages = await wilma
      .GetMessages(SID)
      .catch(err => res.status(403).json({ error: true, errorMsg: err }))

    if (messages) {
      if (!messages.Messages) {
        return res
          .status(200)
          .json({ error: true, messages: [], errorMsg: '!messages.Messages' })
      }

      const msgs = messages.Messages.map(messsage => {
        return {
          Viesti: messsage.Subject,
          Nimi: messsage.Sender,
          Aika: messsage.TimeStamp,
          Id: messsage.Id
        }
      })

      res.status(200).json({ error: false, messages: msgs })
    } else {
      res.status(200).json({ error: true, messages: [] })
    }
  }
}

export default Messages
