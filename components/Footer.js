import styled from 'styled-components'

const Appbar = styled.div`
  height: 44px;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  position: absolute;
  bottom: 0;
  background-color: transparent;
`
const Logo = styled.img`
  height: 27px;
`
const Links = styled.div`
  display: flex;
  align-items: center;
`
const Dropdown = styled.div`
  padding: 0px;
  position: relative;
  display: inline-block;
  font-family: Poppins;
  font-weight: 500;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.4;
  color: black;

  :hover {
    opacity: 1;

    &:after {
      content: ' ';
      position: absolute;
      left: 18px;
      right: 0px;
      bottom: 2px;
      height: 2px;

      background: linear-gradient(-134deg, #ff7b2e, #f7da2c, #e73c7e, #ff2828);
      background-size: 400% 400%;
      animation: gradient 30s ease infinite;

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    }
  }
`

function Footer({ aapo, setAapo }) {
  return (
    <Appbar>
      <Logo src="/images/jeffelogo.svg" alt="Logo" />
      <a href="https://jeffe.co">
        <Dropdown>© 2020 JEFFe.co</Dropdown>
      </a>
    </Appbar>
  )
}

export default Footer
