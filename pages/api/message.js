import wilma from '../../components/api/Wilma'

const Message = async (req, res) => {
  const {
    query: { SID, id }
  } = req

  if (SID && id) {
    const message = await wilma
      .GetMessageBody(id, SID)
      .catch(() => res.status(500).json({ error: true }))
    if (message) {
      // console.log(message.mainMessageBody)
      // const text = htmlToText.fromString(message.mainMessageBody)
      // message.mainMessageBody = text

      res.status(200).json({ error: false, message })
    } else {
      res.status(200).json({ error: true, message })
    }
  } else {
    res.status(500).json({ error: true, message: {} })
  }
}

export default Message
