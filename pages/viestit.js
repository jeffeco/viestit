/* eslint-disable react/display-name */
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import cookie from 'cookie'
import wilma from '../components/api/Wilma'
// import Table from '../components/Table'
import { Table, Skeleton, Input, Button, Select } from 'antd'
import Highlighter from 'react-highlight-words'
import fetch from 'isomorphic-unfetch'
import { SearchOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'
// import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const { Option } = Select

const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
`

const DateCards = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 25px;

  && {
    border: 0px solid transparent;
    padding: 0px;
  }
`

const CustomCard = styled.div`
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 12px 14px;
  border: ${({ selected }) =>
    selected ? '0px solid #cccccc' : '1px solid #cccccc'};
  border-radius: ${({ selected }) => (selected ? '4px' : '4px')};

  background: ${({ selected }) =>
    selected && 'linear-gradient(60deg, rgb(255, 0, 136), rgb(221, 0, 238))'};

  color: ${({ selected }) => selected && 'white'};

  box-shadow: ${({ selected }) => selected && '0 2px 8px rgba(0, 0, 0, 0.15)'};

  :hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  :active {
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
  }
`

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

function MessagePreview({ id, SSID }) {
  const router = useRouter()

  const [state, setState] = useState({ error: true })
  const [error, setError] = useState(false)
  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/message?id=${id}&SID=${SSID}`).catch(() =>
        setError(true)
      )
      const data = await res.json().catch(() => setError(true))
      if (!data) return setError(true)
      if (!data.message) return setError(true)
      if (
        data.message.mainMessageBody.includes(
          'Käyttäjätunnus on varattu. Ota yhteys oppilaitokseen, mikäli epäilet, että käyttäjätunnustasi käytetään väärin.'
        )
      ) {
        return setError(true)
      }
      setState(data)
    }

    getData()
  }, [id, SSID])

  if (error) {
    router.push('/?r=1')
    return <h1>Kirjaudu uudelleen</h1>
  }
  if (state.error) return <Skeleton />

  return (
    <div>
      <div css="display: flex;">
        <h2 css="flex: 1;">{state.message.title}</h2>
        <h2>{state.message.sender}</h2>
      </div>
      <div
        css="font-size: 16px;"
        dangerouslySetInnerHTML={{ __html: state.message.mainMessageBody }}
      />
    </div>
  )
}

const Viestit = ({ messages: mess, error, SSID }) => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [selected, setSelected] = useState(2283)
  const [messages, setMessages] = useState(mess)
  const [errorMsg, setError] = useState(false)

  const router = useRouter()
  var searchInput

  useEffect(() => {
    const epic = setInterval(() => {
      getData()
    }, 120000)
    return () => {
      clearInterval(epic)
    }
  }, [])

  async function getData() {
    setLoading2(true)
    const res = await fetch(`/api/messages?SID=${SSID}`).catch(() => {
      setLoading2(false)
      setError(true)
    })
    const data = await res.json().catch(() => {
      setLoading2(false)
      setError(true)
    })
    if (!data) {
      setError(true)
      return setLoading2(false)
    }
    if (data.error) {
      setError(true)
      return setLoading2(false)
    }
    setMessages(data.messages)
    setLoading2(false)
  }

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => {
        if (typeof window !== 'undefined' && window) {
          window.epic = confirm
          window.epic2 = clearFilters
          window.epic3 = setSelectedKeys
        }

        return (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                searchInput = node
              }}
              placeholder={`Hae ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={
                e => setSelectedKeys(e.target.value ? [e.target.value] : [])
                // eslint-disable-next-line react/jsx-curly-newline
              }
              onPressEnter={
                () => handleSearch(selectedKeys, confirm, dataIndex)
                // eslint-disable-next-line react/jsx-curly-newline
              }
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}>
              Hae
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}>
              Nollaa
            </Button>
          </div>
        )
      },
      filterIcon: filtered => (
        <SearchOutlined
          className={dataIndex}
          title="Hae"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => {
            if (searchInput) {
              if (searchInput.select) {
                searchInput.select()
              }
            }
          })
        }
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    }
  }

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  function handleReset(clearFilters) {
    clearFilters()
    setSearchText('')
  }

  function handleChange(value) {
    searchInput = document.querySelector('.Nimi')
    searchInput.click()

    if (value == 'all') {
      setTimeout(() => {
        return handleReset(window.epic2)
      }, 5)

      return
    }

    setTimeout(() => {
      window.epic3(value ? [value] : [])
      handleSearch([value], window.epic, 'Nimi')
    }, 5)
  }

  const columns = [
    {
      title: 'Viesti',
      dataIndex: 'Viesti',
      key: 'Viesti',
      ...getColumnSearchProps('Viesti')
    },
    {
      title: 'Lähettäjä',
      dataIndex: 'Nimi',
      key: 'Nimi',
      ...getColumnSearchProps('Nimi')
    },
    {
      title: 'Lähetetty',
      dataIndex: 'Aika',
      key: 'Aika',
      ...getColumnSearchProps('Aika')
    }
  ]

  const teacherArray = messages.map(msg => msg.Nimi)
  const unqTeacher = [...new Set(teacherArray)]
  unqTeacher.sort(function(a, b) {
    if (a > b) {
      return 1
    }
    if (b > a) {
      return -1
    }
    return 0
  })

  const dateArray = messages.map(msg => msg.Aika.split(' ')[0])
  const unqTimes = [...new Set(dateArray)]

  if (errorMsg) {
    router.push('/?r=1')
    return <h1>Odota...</h1>
  }

  return (
    <div css="background: #fff; height: 100vh;" style={{ paddingTop: 5 }}>
      {error && <h1>err</h1>}
      <Wrapper>
        <motion.div variants={item} initial="hidden" animate="visible">
          <div css="display: flex; align-items: center;">
            <img
              css="flex: 1; margin-bottom: 0px; max-width: 150px; margin-top: 3px; height: 29px"
              src="/images/Viestit.svg"
              alt="Logo"
            />
            <div css="flex: 1" />
            <Button
              loading={loading2}
              css="margin-right: 8px;"
              onClick={() => getData()}>
              Lataa viestit
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true)
                Cookies.remove('SSID')
                router.push('/')
              }}>
              Kirjaudu ulos
            </Button>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="visible">
          <DateCards>
            {unqTimes.map((aika, i) => {
              if (i > 3) return
              return (
                <motion.div key={aika} className="item2" variants={item}>
                  <CustomCard
                    style={{ textAlign: 'center' }}
                    hoverable
                    onClick={() => {
                      if (selected == i) {
                        setSelected(22)
                        setTimeout(() => {
                          return handleReset(window.epic2)
                        }, 5)
                      } else {
                        setSelected(i)

                        searchInput = document.querySelector('.Aika')
                        searchInput.click()

                        setTimeout(() => {
                          window.epic3(aika ? [aika] : [])
                          handleSearch([aika], window.epic, 'Aika')
                        }, 5)
                      }
                    }}
                    selected={i == selected}>
                    {aika}
                  </CustomCard>
                </motion.div>
              )
            })}

            <motion.div className="item2" variants={item}>
              <Select
                size="large"
                defaultValue="Kaikki opettajat"
                style={{ width: '100%' }}
                onChange={handleChange}>
                <Option key={0} value="all">
                  Kaikki opettajat
                </Option>
                {unqTeacher.map(teacher => (
                  <Option key={teacher} value={teacher}>
                    {teacher}
                  </Option>
                ))}
              </Select>
            </motion.div>
          </DateCards>
        </motion.div>
        <Table
          bordered
          columns={columns}
          expandedRowRender={record => (
            <MessagePreview id={record.Id} SSID={SSID} />
          )}
          rowExpandable={record => true}
          expandRowByClick
          dataSource={messages}
          rowKey={record => record.Id}
        />
      </Wrapper>

      {/* <Footer /> */}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const headerCookies = ctx.req.headers.cookie
  if (!headerCookies) {
    ctx.res.writeHead(301, {
      Location: '/'
    })
    ctx.res.end()
  }
  const cookies = cookie.parse(headerCookies)
  if (cookies.SSID) {
    const messages = await wilma.GetMessages(cookies.SSID).catch(() => {
      ctx.res.writeHead(301, {
        Location: '/?r=1'
      })
      ctx.res.end()
    })

    if (!messages) {
      return {
        props: {
          messages: [],
          error: true
        }
      }
    }

    const msgs = messages.Messages.map(messsage => {
      return {
        Viesti: messsage.Subject,
        Nimi: messsage.Sender,
        Aika: messsage.TimeStamp,
        Id: messsage.Id
      }
    })

    return {
      props: {
        messages: msgs,
        error: false,
        SSID: cookies.SSID
      }
    }
  } else {
    ctx.res.writeHead(301, {
      Location: '/?r=1'
    })
    ctx.res.end()
  }
  return {
    props: {} // will be passed to the page component as props
  }
}

export default Viestit
